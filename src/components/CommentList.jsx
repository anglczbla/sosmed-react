import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const CommentList = ({ postId }) => {
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
        <ul style={{ listStyle: "none", padding: 0 }}>
          {comments.map((comment) => (
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
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentList;
