import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      alert("success delete comment");
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
      alert("success edit comments");
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
      alert("success likes comment");
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
      alert("success unlikes comment");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const deleteComment = (id) => {
    deleteCommentAPI.mutate(id);
  };

  const handleEditComment = (e) => {
    const { name, value } = e.target;
    setUpdateComments({ ...updateComments, [name]: value });
  };

  const toggleEdit = (idx) => {
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
    return <p className="text-sm text-gray-500 py-2">Loading comments...</p>;
  if (isError)
    return (
      <p className="text-sm text-red-500 py-2">
        Error loading comments: {error.message}
      </p>
    );

  const comments = data?.comments || [];

  return (
    <div className="space-y-4 mt-2">
      <h4 className="text-sm font-bold text-gray-700">Comments ({comments.length})</h4>
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment, idx) => (
            <li key={comment._id} className="group bg-gray-50 rounded-2xl p-4 hover:bg-white border border-transparent hover:border-gray-100 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-800">{comment.author?.username || "User"}</span>
                    <span className="text-xs text-gray-400">• {comment.likes} likes</span>
                  </div>
                  
                  {showEdit === idx ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        name="content"
                        value={updateComments.content}
                        placeholder="update comment"
                        onChange={handleEditComment}
                        className="flex-1 px-3 py-1 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                      />
                      <button
                        onClick={() => saveEditComment(comment._id, updateComments)}
                        className="text-xs bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700"
                      >
                        Save
                      </button>
                      <button onClick={undoEdit} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => likeComment(comment._id)} className="text-xs font-semibold text-pink-500 hover:text-pink-600">
                  Like
                </button>
                <button onClick={() => unlikesComment(comment._id)} className="text-xs font-semibold text-gray-400 hover:text-gray-600">
                  Unlike
                </button>
                <button onClick={() => toggleEdit(idx)} className="text-xs font-semibold text-blue-500 hover:text-blue-600">
                  Edit
                </button>
                <button onClick={() => deleteComment(comment._id)} className="text-xs font-semibold text-red-400 hover:text-red-500">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentList;
