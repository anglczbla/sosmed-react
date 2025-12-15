import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const CommentList = ({ postId }) => {
  const queryClient = useQueryClient();
  const [updateComments, setUpdateComments] = useState({
    content: "",
  });
  const [showEdit, setShowEdit] = useState(null);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://api.freeapi.app/api/v1/social-media/comments/post/${postId}?page=1&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.data;
    },
    enabled: !!postId,
  });

  const deleteCommentAPI = useMutation({
    mutationFn: (id) => {
      const accessToken = localStorage.getItem("accessToken");
      return axios.delete(
        `https://api.freeapi.app/api/v1/social-media/comments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
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
      const accessToken = localStorage.getItem("accessToken");
      return axios.patch(
        `https://api.freeapi.app/api/v1/social-media/comments/${id}`,
        updateComments,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
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

  const saveEditComment = (id, updateComments) => {
    const data = { id, updateComments };
    updateCommentAPI.mutate(data);
  };

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading comments...</p>;
  if (isError)
    return (
      <p className="text-sm text-red-500">
        Error loading comments: {error.message}
      </p>
    );

  const comments = data?.comments || [];

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        borderRadius: "5px",
      }}
    >
      <h4>Comments</h4>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {comments.map((comment, idx) => (
              <div>
                <li
                  key={comment._id}
                  style={{
                    marginBottom: "8px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "4px",
                  }}
                >
                  <strong>{comment.author?.username || "User"}</strong>:{" "}
                  {comment.content}
                </li>
                <button onClick={() => deleteComment(comment._id)}>
                  Delete Comment
                </button>
                <button onClick={() => toggleEdit(idx)}>Update Comment</button>
                {showEdit === idx ? (
                  <div>
                    <input
                      type="text"
                      name="content"
                      value={updateComments.content}
                      placeholder="update comment"
                      onChange={handleEditComment}
                    />
                    <button
                      onClick={() =>
                        saveEditComment(comment._id, updateComments)
                      }
                    >
                      Save
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommentList;
