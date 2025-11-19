// import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
// import Comment from "./Comment";
// import axios from "axios";
// import { useAuth } from "../Context/AuthContext";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Comments = forwardRef(({ noticeId, noticeAuthorId }, ref) => {
//   const { user } = useAuth();
//   const [comments, setComments] = useState([]);
//   const [input, setInput] = useState("");
//   const [showAllComments, setShowAllComments] = useState(false);
//   const inputRef = React.useRef(null);

//   useEffect(() => {
//     const fetchComments = async () => {
//       if (!noticeId) return;
//       try {
//         const res = await axios.get(`https://ns-server.onrender.com/api/comment/comments/${noticeId}`, { withCredentials: true });
//         const formattedComments = (res.data.comments || []).map((c) => ({
//           ...c,
//           replies: c.replies || [],
//           user: c.user || { firstName: "Unknown", lastName: "", role: "" },
//         }));
//         setComments(formattedComments);
//       } catch (err) {
//         console.error("Error fetching comments:", err);
//         toast.error("Failed to fetch comments", { position: "top-center", style: { marginTop: "60px" } });
//       }
//     };
//     fetchComments();
//   }, [noticeId]);

//   const handleAddComment = async () => {
//     if (!noticeId || !input.trim()) return;
//     try {
//       const res = await axios.post(`https://ns-server.onrender.com/api/comment/comment`, { noticeId, text: input }, { withCredentials: true });
//       const newComment = { ...res.data.comment, replies: [], user: res.data.comment.user || { firstName: "Unknown", lastName: "", role: "" } };
//       setComments((prev) => [newComment, ...prev]);
//       setInput("");
//     } catch (err) {
//       console.error("Error posting comment:", err);
//       toast.error(err.response?.data?.message || "Failed to post comment", { position: "top-center", style: { marginTop: "60px" } });
//     }
//   };

//   const addReply = async ({ commentId, parentReplyId, text }) => {
//     try {
//       const res = await axios.post(
//         `https://ns-server.onrender.com/api/comment/reply`,
//         { commentId, parentReplyId: parentReplyId || null, text },
//         { withCredentials: true }
//       );

//       const newReply = { ...res.data.reply, replies: [], user: res.data.reply.user || { firstName: "Unknown", lastName: "", role: "" } };

//       const addReplyRecursively = (list) =>
//         list.map((c) => {
//           if (c.id === commentId || (c.replies?.length && c.replies.some(r => r.id === commentId))) {
//             return {
//               ...c,
//               replies: c.id === commentId ? [...(c.replies || []), newReply] : addReplyRecursively(c.replies),
//             };
//           } else if (c.replies?.length) {
//             return { ...c, replies: addReplyRecursively(c.replies) };
//           }
//           return c;
//         });

//       setComments((prev) => addReplyRecursively(prev));
//     } catch (err) {
//       console.error("Error posting reply:", err);
//       toast.error(err.response?.data?.message || "Failed to post reply", { position: "top-center", style: { marginTop: "60px" } });
//     }
//   };

//   const deleteComment = (commentId) => {
//     toast.info(
//       <div>
//         Are you sure you want to delete this comment?
//         <div className="mt-2 flex justify-end gap-2">
//           <button
//             onClick={async () => {
//               try {
//                 await axios.delete(`https://ns-server.onrender.com/api/comment/comment/${commentId}`, { withCredentials: true });
//                 setComments((prev) => prev.filter((c) => c.id !== commentId));
//                 toast.dismiss();
//                 toast.success("Comment deleted", { position: "top-center", style: { marginTop: "60px" } });
//               } catch (err) {
//                 console.error("Error deleting comment:", err);
//                 toast.error(err.response?.data?.message || "Failed to delete comment", { position: "top-center", style: { marginTop: "60px" } });
//               }
//             }}
//             className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Yes
//           </button>
//           <button
//             onClick={() => toast.dismiss()}
//             className="px-3 py-1 bg-green-500 text-black rounded hover:bg-green-600"
//           >
//             No
//           </button>
//         </div>
//       </div>,
//       { position: "top-center", style: { marginTop: "60px" }, autoClose: false, closeOnClick: false }
//     );
//   };

//   const deleteReply = (replyId) => {
//     toast.info(
//       <div>
//         Are you sure you want to delete this reply?
//         <div className="mt-2 flex justify-end gap-2">
//           <button
//             onClick={async () => {
//               try {
//                 await axios.delete(`https://ns-server.onrender.com/api/comment/reply/${replyId}`, { withCredentials: true });

//                 const removeReplyRecursively = (list) =>
//                   list
//                     .map((c) => ({
//                       ...c,
//                       replies: c.replies ? removeReplyRecursively(c.replies).filter(Boolean) : [],
//                     }))
//                     .filter((c) => c.id !== replyId);

//                 setComments((prev) => removeReplyRecursively(prev));
//                 toast.dismiss();
//                 toast.success("Reply deleted", { position: "top-center", style: { marginTop: "40px" } });
//               } catch (err) {
//                 console.error("Error deleting reply:", err);
//                 toast.error(err.response?.data?.message || "Failed to delete reply", { position: "top-center", style: { marginTop: "40px" } });
//               }
//             }}
//             className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Yes
//           </button>
//           <button
//             onClick={() => toast.dismiss()}
//             className="px-3 py-1 bg-green-500 text-black rounded hover:bg-green-600"
//           >
//             No
//           </button>
//         </div>
//       </div>,
//       { position: "top-center", style: { marginTop: "60px" }, autoClose: false, closeOnClick: false }
//     );
//   };

//   const displayedComments = showAllComments ? comments : comments.slice(0, 2);

//   useImperativeHandle(ref, () => ({
//     focusInput: () => inputRef.current?.focus(),
//   }));

//   return (
//     <div className="mt-3">
//       <ToastContainer />
//       <div className="flex items-center gap-2 mb-4">
//         <input
//           ref={inputRef}
//           type="text"
//           placeholder="Add a comment..."
//           className="flex-1 border border-borderSubtle rounded-full px-4 py-2 text-textMain focus:outline-none focus:ring-[1px] focus:ring-primary bg-bg"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
//         />
//         <button
//           className="text-primary font-semibold px-3 py-1 rounded-full hover:bg-btn hover:text-textMain transition"
//           onClick={handleAddComment}
//         >
//           Post
//         </button>
//       </div>

//       {comments.length > 0 && (
//         <div>
//           {displayedComments.map((c) => (
//             <Comment
//               key={c.id}
//               comment={c}
//               addReply={addReply}
//               deleteComment={deleteComment}
//               deleteReply={deleteReply}
//               user={user}
//               noticeAuthorId={noticeAuthorId}
//               noticeId={noticeId}
//               isReply={false}
//             />
//           ))}

//           {comments.length > 2 && (
//             <div className="mt-2">
//               <button
//                 className="text-textFaint text-xs hover:underline font-semibold"
//                 onClick={() => setShowAllComments(!showAllComments)}
//               >
//                 {showAllComments ? "Show Less" : `Show ${comments.length - 2} More Comments`}
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// });

// export default Comments;
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Comment from "./Comment";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Comments = forwardRef(({ noticeId, noticeAuthorId }, ref) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const inputRef = React.useRef(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!noticeId) return;
      try {
        const res = await axios.get(`https://ns-server.onrender.com/api/comment/comments/${noticeId}`, { withCredentials: true });
        const formattedComments = (res.data.comments || []).map((c) => ({
          ...c,
          replies: c.replies || [],
          user: c.user || { firstName: "Unknown", lastName: "", role: "" },
        }));
        setComments(formattedComments);
      } catch (err) {
        console.error("Error fetching comments:", err);
        toast.error("Failed to fetch comments", { position: "top-center", style: { marginTop: "60px" } });
      }
    };
    fetchComments();
  }, [noticeId]);

  const handleAddComment = async () => {
    if (!noticeId || !input.trim()) return;
    try {
      const res = await axios.post(`https://ns-server.onrender.com/api/comment/comment`, { noticeId, text: input }, { withCredentials: true });
      const newComment = { ...res.data.comment, replies: [], user: res.data.comment.user || { firstName: "Unknown", lastName: "", role: "" } };
      setComments((prev) => [newComment, ...prev]);
      setInput("");
    } catch (err) {
      console.error("Error posting comment:", err);
      toast.error(err.response?.data?.message || "Failed to post comment", { position: "top-center", style: { marginTop: "60px" } });
    }
  };

  const addReply = async ({ commentId, parentReplyId, text }) => {
    try {
      const res = await axios.post(
        `https://ns-server.onrender.com/api/comment/reply`,
        { commentId, parentReplyId: parentReplyId || null, text },
        { withCredentials: true }
      );

      const newReply = { ...res.data.reply, replies: [], user: res.data.reply.user || { firstName: "Unknown", lastName: "", role: "" } };

      const addReplyRecursively = (list) =>
        list.map((c) => {
          if (c.id === commentId || (c.replies?.length && c.replies.some(r => r.id === commentId))) {
            return {
              ...c,
              replies: c.id === commentId ? [...(c.replies || []), newReply] : addReplyRecursively(c.replies),
            };
          } else if (c.replies?.length) {
            return { ...c, replies: addReplyRecursively(c.replies) };
          }
          return c;
        });

      setComments((prev) => addReplyRecursively(prev));
    } catch (err) {
      console.error("Error posting reply:", err);
      toast.error(err.response?.data?.message || "Failed to post reply", { position: "top-center", style: { marginTop: "60px" } });
    }
  };

  const deleteComment = (commentId) => {
    toast.info(
      <div>
        Are you sure you want to delete this comment?
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={async () => {
              try {
                await axios.delete(`https://ns-server.onrender.com/api/comment/comment/${commentId}`, { withCredentials: true });
                setComments((prev) => prev.filter((c) => c.id !== commentId));
                toast.dismiss();
                toast.success("Comment deleted", { position: "top-center", style: { marginTop: "60px" } });
              } catch (err) {
                console.error("Error deleting comment:", err);
                toast.error(err.response?.data?.message || "Failed to delete comment", { position: "top-center", style: { marginTop: "60px" } });
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-green-500 text-black rounded hover:bg-green-600"
          >
            No
          </button>
        </div>
      </div>,
      { position: "top-center", style: { marginTop: "60px" }, autoClose: false, closeOnClick: false }
    );
  };

  const deleteReply = (replyId) => {
    toast.info(
      <div>
        Are you sure you want to delete this reply?
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={async () => {
              try {
                await axios.delete(`https://ns-server.onrender.com/api/comment/reply/${replyId}`, { withCredentials: true });

                const removeReplyRecursively = (list) =>
                  list
                    .map((c) => ({
                      ...c,
                      replies: c.replies ? removeReplyRecursively(c.replies).filter(Boolean) : [],
                    }))
                    .filter((c) => c.id !== replyId);

                setComments((prev) => removeReplyRecursively(prev));
                toast.dismiss();
                toast.success("Reply deleted", { position: "top-center", style: { marginTop: "40px" } });
              } catch (err) {
                console.error("Error deleting reply:", err);
                toast.error(err.response?.data?.message || "Failed to delete reply", { position: "top-center", style: { marginTop: "40px" } });
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-green-500 text-black rounded hover:bg-green-600"
          >
            No
          </button>
        </div>
      </div>,
      { position: "top-center", style: { marginTop: "60px" }, autoClose: false, closeOnClick: false }
    );
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 2);
  const isDisabledStudent = user?.role === "student" && user?.isEnabled === false;

  useImperativeHandle(ref, () => ({
    focusInput: () => inputRef.current?.focus(),
  }));

  return (
    <div className="mt-3">
      <ToastContainer />

      {/* ✅ Hide comment input for disabled students */}
      {!isDisabledStudent && (
        <div className="flex items-center gap-2 mb-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a comment..."
            className="flex-1 border border-borderSubtle rounded-full px-4 py-2 text-textMain focus:outline-none focus:ring-[1px] focus:ring-primary bg-bg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          />
          <button
            className="text-primary font-semibold px-3 py-1 rounded-full hover:bg-btn hover:text-textMain transition"
            onClick={handleAddComment}
          >
            Post
          </button>
        </div>
      )}

      {comments.length > 0 && (
        <div>
          {displayedComments.map((c) => (
            <Comment
              key={c.id}
              comment={c}
              addReply={addReply}
              deleteComment={deleteComment}
              deleteReply={deleteReply}
              user={user}
              noticeAuthorId={noticeAuthorId}
              noticeId={noticeId}
              isReply={false}
            />
          ))}

          {comments.length > 2 && (
            <div className="mt-2">
              <button
                className="text-textFaint text-xs hover:underline font-semibold"
                onClick={() => setShowAllComments(!showAllComments)}
              >
                {showAllComments ? "Show Less" : `Show ${comments.length - 2} More Comments`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default Comments;
