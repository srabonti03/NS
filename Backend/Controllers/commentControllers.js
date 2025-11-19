import prisma from "../Config/prismaClient.js";
import { createNotification } from "./notificationControllers.js";

// ================== Create Comment ==================
export const createComment = async (req, res) => {
  try {
    const { noticeId, text } = req.body;
    const userId = req.user.id;

    if (!noticeId || !text) {
      return res.status(400).json({ message: "noticeId and text are required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.role === "student" && !user.isEnabled) {
      return res.status(403).json({ message: "Students not enabled cannot create comments" });
    }

    const comment = await prisma.noticeComment.create({
      data: {
        text,
        user: { connect: { id: userId } },
        notice: { connect: { id: noticeId } },
        createdBy: userId,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } },
      },
    });

    const notice = await prisma.notice.findUnique({ where: { id: noticeId } });
    if (notice.createdBy !== userId) {
      await createNotification({
        userId: notice.createdBy,
        fromUserId: userId,
        noticeId,
        type: "comment-notice",
        text,
        avatar: user.avatar || null,
      });
    }

    const formattedComment = {
      ...comment,
      time: `${Math.floor((new Date() - new Date(comment.createdAt)) / 3600000)}h ago`,
      avatar: comment.user.avatar || null
    };

    res.json({ message: "Comment added successfully", comment: formattedComment });
  } catch (err) {
    console.error("createComment error:", err);
    res.status(500).json({ message: "Error creating comment" });
  }
};

// ================== Create Reply (Nested Support) ==================
export const createReply = async (req, res) => {
  try {
    const { commentId, parentReplyId, text } = req.body;
    const userId = req.user.id;

    if ((!commentId && !parentReplyId) || !text) {
      return res.status(400).json({ message: "commentId or parentReplyId and text are required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.role === "student" && !user.isEnabled) {
      return res.status(403).json({ message: "Students not enabled cannot create replies" });
    }

    if (commentId) {
      const parentComment = await prisma.noticeComment.findUnique({ where: { id: commentId } });
      if (!parentComment) return res.status(404).json({ message: "Comment not found" });
    }
    if (parentReplyId) {
      const parentReply = await prisma.noticeCommentReply.findUnique({ where: { id: parentReplyId } });
      if (!parentReply) return res.status(404).json({ message: "Parent reply not found" });
    }

    const reply = await prisma.noticeCommentReply.create({
      data: {
        text,
        user: { connect: { id: userId } },
        ...(commentId && { comment: { connect: { id: commentId } } }),
        ...(parentReplyId && { parentReply: { connect: { id: parentReplyId } } }),
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } },
        parentReply: { select: { id: true, text: true, userId: true } },
      },
    });

    if (commentId) {
      const parentComment = await prisma.noticeComment.findUnique({ where: { id: commentId } });
      const notice = await prisma.notice.findUnique({ where: { id: parentComment.noticeId } });
      if (notice.createdBy !== userId) {
        await createNotification({
          userId: notice.createdBy,
          fromUserId: userId,
          noticeId: notice.id,
          type: "reply-comment",
          text,
          avatar: user.avatar || null,
        });
      }
    }

    const formattedReply = {
      ...reply,
      time: `${Math.floor((new Date() - new Date(reply.createdAt)) / 3600000)}h ago`,
      avatar: reply.user.avatar || null
    };

    res.json({ message: "Reply added successfully", reply: formattedReply });
  } catch (err) {
    console.error("createReply error:", err);
    res.status(500).json({ message: "Error creating reply" });
  }
};

// ================== Get Comments by Notice (Nested Replies) ==================
export const getCommentsByNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    if (!noticeId) return res.status(400).json({ message: "noticeId is required" });

    const comments = await prisma.noticeComment.findMany({
      where: { noticeId },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });

    const allReplies = await prisma.noticeCommentReply.findMany({
      where: { commentId: { in: comments.map(c => c.id) } },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } } },
      orderBy: { createdAt: "asc" },
    });

    const buildTree = (replies, parentId = null) =>
      replies
        .filter(r => r.parentReplyId === parentId)
        .map(r => ({
          ...r,
          time: `${Math.floor((new Date() - new Date(r.createdAt)) / 3600000)}h ago`,
          avatar: r.user.avatar || null,
          childReplies: buildTree(replies, r.id),
        }));

    comments.forEach(comment => {
      const repliesForComment = allReplies.filter(r => r.commentId === comment.id);
      comment.replies = buildTree(repliesForComment, null);
      comment.time = `${Math.floor((new Date() - new Date(comment.createdAt)) / 3600000)}h ago`;
      comment.avatar = comment.user.avatar || null;
    });

    res.json({ totalCount: comments.length, comments });
  } catch (err) {
    console.error("getCommentsByNotice error:", err);
    res.status(500).json({ message: "Error fetching comments" });
  }
};

// ================== Delete Comment ==================
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await prisma.noticeComment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const notice = await prisma.notice.findUnique({ where: { id: comment.noticeId } });

    if (comment.userId !== userId && notice.createdBy !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    const deleteRepliesRecursively = async parentId => {
      const childReplies = await prisma.noticeCommentReply.findMany({ where: { parentReplyId: parentId } });
      for (const r of childReplies) {
        await deleteRepliesRecursively(r.id);
        await prisma.noticeCommentReply.delete({ where: { id: r.id } });
      }
    };

    const directReplies = await prisma.noticeCommentReply.findMany({ where: { commentId: id } });
    for (const r of directReplies) {
      await deleteRepliesRecursively(r.id);
      await prisma.noticeCommentReply.delete({ where: { id: r.id } });
    }

    await prisma.noticeComment.delete({ where: { id } });

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("deleteComment error:", err);
    res.status(500).json({ message: "Error deleting comment" });
  }
};

// ================== Delete Reply ==================
export const deleteReply = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Reply ID is required" });

    const userId = req.user.id;

    const reply = await prisma.noticeCommentReply.findUnique({ where: { id } });
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    let notice = null;
    if (reply.commentId) {
      const parentComment = await prisma.noticeComment.findUnique({ where: { id: reply.commentId } });
      if (parentComment) {
        notice = await prisma.notice.findUnique({ where: { id: parentComment.noticeId } });
      }
    }

    if (reply.userId !== userId && notice?.createdBy !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this reply" });
    }

    const deleteChildReplies = async parentId => {
      const children = await prisma.noticeCommentReply.findMany({ where: { parentReplyId: parentId } });
      for (const child of children) {
        await deleteChildReplies(child.id);
        await prisma.noticeCommentReply.delete({ where: { id: child.id } });
      }
    };

    await deleteChildReplies(id);
    await prisma.noticeCommentReply.delete({ where: { id } });

    res.json({ message: "Reply deleted successfully" });
  } catch (err) {
    console.error("deleteReply error:", err);
    res.status(500).json({ message: "Error deleting reply" });
  }
};
