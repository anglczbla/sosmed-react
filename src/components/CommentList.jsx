import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Edit2, Heart, Trash2, X } from "lucide-react";
import { useState } from "react";
import apiClient from "../utils/api";

const CommentList = ({ postId }) => {
  const queryClient = useQueryClient();
  const [updateComments, setUpdateComments] = useState({
    content: "",
  });
  const [showEdit, setShowEdit] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await apiClient.get(
        `/social-media/comments/post/${postId}?page=1&limit=50`
      );
      return response.data.data;
    },
    enabled: !!postId,
  });

  const deleteCommentAPI = useMutation({
    mutationFn: (id) => {
      return apiClient.delete(`/social-media/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const updateCommentAPI = useMutation({
    mutationFn: (data) => {
      const { id, updateComments } = data;
      return apiClient.patch(`/social-media/comments/${id}`, updateComments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setShowEdit(null);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const likesCommentAPI = useMutation({
    mutationFn: (id) => {
      return apiClient.post(`/social-media/like/comment/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const unlikesCommentAPI = useMutation({
    mutationFn: (id) => {
      return apiClient.post(`/social-media/like/comment/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const deleteComment = (id) => {
    if (window.confirm("Remove this comment?")) {
      deleteCommentAPI.mutate(id);
    }
  };

  const handleEditComment = (e) => {
    const { name, value } = e.target;
    setUpdateComments({ ...updateComments, [name]: value });
  };

  const toggleEdit = (idx, currentContent) => {
    setUpdateComments({ content: currentContent });
    setShowEdit(idx);
  };

  const undoEdit = () => {
    setShowEdit(null);
  };

  const saveEditComment = (id, updateComments) => {
    const data = { id, updateComments };
    updateCommentAPI.mutate(data);
  };

  const likeComment = (id) => {
    likesCommentAPI.mutate(id);
  };

  const unlikesComment = (id) => {
    unlikesCommentAPI.mutate(id);
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-4">
        <div className="w-5 h-5 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );

  if (isError)
    return (
      <p className="text-xs text-red-500 py-2 font-bold">
        Error loading comments 😭
      </p>
    );

  const comments = data?.comments || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Comments ({comments.length})
        </h4>
      </div>

      {comments.length === 0 ? (
        <div className="py-4 text-center">
          <p className="text-sm text-gray-400 font-medium italic">
            No comments yet. Be the first to vibe! ✨
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {comments.map((comment, idx) => (
            <li key={comment._id} className="group flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 font-black text-sm border border-violet-100 shadow-sm">
                  {comment.author?.account?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="bg-gray-50/80 rounded-[1.25rem] px-5 py-4 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-100 transition-all relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-sm text-gray-900">
                      @{comment.author?.account?.username || "anonymous"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-gray-400">
                        {comment.likes} likes
                      </span>
                    </div>
                  </div>

                  {showEdit === idx ? (
                    <div className="space-y-3 mt-3">
                      <input
                        type="text"
                        name="content"
                        value={updateComments.content}
                        onChange={handleEditComment}
                        className="w-full px-4 py-2 text-sm border-2 border-violet-100 rounded-xl focus:outline-none focus:border-violet-300 bg-white font-medium transition-all"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            saveEditComment(comment._id, updateComments)
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-xs font-black rounded-lg hover:bg-violet-700 transition-all"
                        >
                          <Check size={14} /> Update
                        </button>
                        <button
                          onClick={undoEdit}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-400 border border-gray-100 text-xs font-black rounded-lg hover:bg-gray-50 transition-all"
                        >
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {comment.content}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 ml-2">
                  <button
                    onClick={() => likeComment(comment._id)}
                    className={`text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 ${
                      comment.isLiked
                        ? "text-pink-600"
                        : "text-gray-400 hover:text-pink-500"
                    }`}
                  >
                    <Heart
                      size={12}
                      fill={comment.isLiked ? "currentColor" : "none"}
                    />
                    {comment.isLiked ? "Liked" : "Like"}
                  </button>

                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => toggleEdit(idx, comment.content)}
                      className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-violet-600 transition-colors flex items-center gap-1"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => deleteComment(comment._id)}
                      className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentList;
