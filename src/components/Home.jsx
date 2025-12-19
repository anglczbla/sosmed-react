import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../utils/api";
import CommentList from "./CommentList";

const Home = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [page] = useState(1);
  const [limit] = useState(10);
  const [comment, setComment] = useState({
    content: "",
  });
  const [activeCommentId, setActiveCommentId] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", page, limit],
    queryFn: async () => {
      const response = await apiClient.get(
        `/social-media/posts?page=${page}&limit=${limit}`
      );
      return response.data.data;
    },
  });

  const commentAPI = useMutation({
    mutationFn: (data) => {
      const { postId, comment } = data;
      return apiClient.post(`/social-media/comments/post/${postId}`, comment);
    },
    onSuccess: (data, variables) => {
      alert("success add comment");
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      setComment({
        content: "",
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const likesPostAPI = useMutation({
    mutationFn: (id) => {
      return apiClient.post(`/social-media/like/post/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const unlikesPostAPI = useMutation({
    mutationFn: (id) => {
      return apiClient.post(`/social-media/like/post/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  if (isLoading) return <div className="text-center py-20 text-gray-500 font-medium">Loading feed...</div>;
  if (isError) return <div className="text-center py-20 text-red-500 font-medium">An error has occurred</div>;

  const handleChangeComment = (e) => {
    const { name, value } = e.target;
    setComment({ ...comment, [name]: value });
  };

  const addComment = (postId, comment) => {
    const data = { postId, comment };
    commentAPI.mutate(data);
  };

  const toggleComments = (id) => {
    setActiveCommentId(activeCommentId === id ? null : id);
  };

  const likePost = (id) => {
    likesPostAPI.mutate(id);
  };

  const unlikePost = (id) => {
    unlikesPostAPI.mutate(id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
       {/* Welcome Section */}
       <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2">Welcome Home! ✨</h1>
            <p className="opacity-90 mb-6">See what's happening in your network right now.</p>
            <Link 
              to="/create-post" 
              className="px-6 py-2.5 bg-white text-purple-600 font-bold rounded-xl shadow-md hover:bg-gray-50 transition-all inline-block"
            >
              Share Something ✍️
            </Link>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
       </div>

      {data.posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <p className="text-gray-500 text-lg italic">No posts yet. Be the first to start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-gray-800">Your Feed 🌍</h2>
            <div className="text-sm text-gray-400 font-medium">Top Posts</div>
          </div>
          
          <div className="space-y-6">
            {data.posts.map((d) => (
              <div key={d._id} className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-purple-700 font-bold border border-white">
                       {d.author.account.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <button
                          onClick={() =>
                            navigate(`/user-profile/${d.author.account.username}`)
                          }
                          className="font-bold text-gray-800 hover:text-purple-600 transition-colors"
                        >
                          @{d.author.account.username}
                        </button>
                        <p className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">{d.content}</p>
                
                {/* Images */}
                {d.images.length > 0 && (
                   <div className={`grid ${d.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-4`}>
                      {d.images.map((i, idx) => (
                        <img key={idx} src={i.url} alt="Post attachment" className="rounded-xl object-cover w-full h-48 hover:scale-[1.01] transition-transform shadow-sm" />
                      ))}
                   </div>
                )}

                {/* Tags */}
                {d.tags && d.tags.filter(t => t).length > 0 && (
                   <div className="flex flex-wrap gap-2 mb-4">
                      {d.tags.map((tag, tIdx) => (
                         tag && <span key={tIdx} className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded-full border border-purple-100">#{tag}</span>
                      ))}
                   </div>
                )}

                {/* Stats & Actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                   <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 group cursor-default">
                         <span className="text-sm font-bold text-gray-700">{d.likes}</span>
                         <span className="text-xs text-gray-400 font-medium">Likes</span>
                      </div>
                      <div className="flex items-center gap-1.5 group cursor-default">
                         <span className="text-sm font-bold text-gray-700">{Array.isArray(d.comments) ? d.comments.length : d.comments}</span>
                         <span className="text-xs text-gray-400 font-medium">Comments</span>
                      </div>
                   </div>
                   
                   <div className="flex gap-2">
                      <button 
                        onClick={() => likePost(d._id)} 
                        className="p-2 rounded-xl text-pink-600 bg-pink-50 hover:bg-pink-100 transition-all flex items-center gap-2 px-4 text-sm font-bold"
                      >
                        Like
                      </button>
                      <button 
                        onClick={() => unlikePost(d._id)} 
                        className="p-2 rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all flex items-center gap-2 px-4 text-sm font-bold"
                      >
                        Unlike
                      </button>
                      <button 
                        onClick={() => toggleComments(d._id)} 
                        className="p-2 rounded-xl text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all flex items-center gap-2 px-4 text-sm font-bold"
                      >
                        {activeCommentId === d._id ? "Close" : "Comment"}
                      </button>
                   </div>
                </div>

                {/* Comments Section */}
                {activeCommentId === d._id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <CommentList postId={d._id} />
                    <div className="mt-4 flex gap-2">
                       <input
                          type="text"
                          name="content"
                          value={comment.content}
                          onChange={handleChangeComment}
                          placeholder="Add a comment..."
                          className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm"
                        />
                        <button 
                          onClick={() => addComment(d._id, comment)}
                          disabled={!comment.content.trim()}
                          className="px-5 py-2.5 bg-purple-600 text-white rounded-2xl text-sm font-bold hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50"
                        >
                          Send
                        </button>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
