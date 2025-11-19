import React, { useState, useRef, useEffect } from "react";

function Comment({
  comment,
  addReply,
  isReply = false,
  noticeId,
  deleteComment,
  deleteReply,
  user,
  noticeAuthorId,
  autoFocusReply = false,
}) {
  const [showReplyInput, setShowReplyInput] = useState(autoFocusReply);
  const [replyInput, setReplyInput] = useState("");
  const [showReplies, setShowReplies] = useState(autoFocusReply);
  const replyInputRef = useRef(null);

  useEffect(() => {
    if (showReplyInput) replyInputRef.current?.focus();
  }, [showReplyInput]);

  const handleAddReply = () => {
    if (!replyInput.trim()) return;

    const payload = {
      commentId: comment.parentCommentId ? comment.parentCommentId : comment.id,
      parentReplyId: comment.parentReplyId || null,
      text: replyInput,
    };

    addReply(payload);

    setReplyInput("");
    setShowReplyInput(false);
    setShowReplies(true);
  };

  const canDelete =
    user &&
    (user.id === comment.user?.id ||
      user.role === "admin" ||
      user.id === noticeAuthorId);

  const isDisabledStudent = user?.role === "student" && user?.isEnabled === false;

  const avatarSrc = comment.user?.avatar || "Fallback/avatar.png";

  return (
    <div className={`flex gap-3 mb-3 items-start ${isReply ? "ml-6" : ""}`}>
      <div className="flex-shrink-0">
        <img
          src={avatarSrc}
          alt="avatar"
          className="w-10 h-10 md:w-10 md:h-10 sm:w-8 sm:h-8 xs:w-7 xs:h-7 rounded-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-1">
        <div className="bg-bg p-2 rounded-lg shadow-sm break-words md:text-sm sm:text-xs xs:text-xs">
          <span className="font-semibold text-textMain text-sm md:text-sm sm:text-xs xs:text-xs">
            {comment.user?.firstName || "Unknown"} {comment.user?.lastName || ""}
          </span>{" "}
          {comment.user?.role && (
            <span className="text-textFaint text-xs md:text-xs sm:text-[10px] xs:text-[9px]">
              · {comment.user.role}
            </span>
          )}{" "}
          <span className="text-textSubtle text-sm md:text-sm sm:text-xs xs:text-xs">
            {comment.text}
          </span>
        </div>

        <div className="flex gap-4 mt-1 text-textFaint text-xs md:text-xs sm:text-[10px] xs:text-[9px] flex-wrap">
          <span className="cursor-pointer hover:underline">Like</span>

          {!isReply && !isDisabledStudent && (
            <span
              className="cursor-pointer hover:underline"
              onClick={() => setShowReplyInput(true)}
            >
              Reply
            </span>
          )}

          {canDelete && (
            <span
              className="cursor-pointer hover:underline text-red-500"
              onClick={() =>
                isReply ? deleteReply(comment.id) : deleteComment(comment.id)
              }
            >
              Delete
            </span>
          )}

          {comment.createdAt && (
            <span className="text-gray-400">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          )}
        </div>

        {showReplyInput && !isDisabledStudent && !isReply && (
          <div
            className={`flex gap-2 mt-2 ${
              isReply ? "w-full max-w-[calc(100%-1rem)]" : "w-full"
            }`}
          >
            <input
              ref={replyInputRef}
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 border border-borderSubtle rounded-full px-3 py-1 text-textMain focus:outline-none focus:ring-[1px] focus:ring-primary bg-bg md:text-sm sm:text-xs xs:text-xs w-full"
              onKeyDown={(e) => e.key === "Enter" && handleAddReply()}
            />
            <button
              onClick={handleAddReply}
              className="text-primary font-semibold px-3 py-1 rounded-full hover:bg-btn hover:text-textMain transition md:text-sm sm:text-xs xs:text-xs"
            >
              Post
            </button>
          </div>
        )}

        {comment.replies?.length > 0 && (
          <div className="mt-2">
            {!showReplies && (
              <button
                className="text-textFaint text-xs md:text-xs sm:text-[10px] xs:text-[9px] hover:underline font-semibold"
                onClick={() => setShowReplies(true)}
              >
                Show {comment.replies.length}{" "}
                {comment.replies.length === 1 ? "Reply" : "Replies"}
              </button>
            )}

            {showReplies &&
              comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={{
                    ...reply,
                    parentCommentId: comment.parentCommentId
                      ? comment.parentCommentId
                      : comment.id,
                  }}
                  addReply={addReply}
                  isReply={true}
                  deleteComment={deleteComment}
                  deleteReply={deleteReply}
                  noticeId={noticeId}
                  user={user}
                  noticeAuthorId={noticeAuthorId}
                />
              ))}

            {showReplies && !isReply && (
              <button
                className="text-textFaint text-xs md:text-xs sm:text-[10px] xs:text-[9px] hover:underline font-semibold mt-1"
                onClick={() => setShowReplies(false)}
              >
                Show Less
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
