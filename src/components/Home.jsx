import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, Calendar, TrendingUp, Send, User } from "lucide-react";
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
  
  const accessToken = localStorage.getItem("accessToken");

  const { data, isLoading, isError, error } = useQuery({
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

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium animate-pulse">Curating your feed...</p>
    </div>
  );

  if (isError) return (
    <div className="text-center py-20 px-4">
      <div className="bg-red-50 text-red-600 p-6 rounded-3xl inline-block border border-red-100">
        <p className="font-bold mb-2">Oops! Something went wrong</p>
        <p className="text-sm opacity-80">{error.message}</p>
      </div>
    </div>
  );

  const handleChangeComment = (e) => {
    const { name, value } = e.target;
    setComment({ ...comment, [name]: value });
  };

  const checkAuth = () => {
    if (!accessToken) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const addComment = (postId, comment) => {
    if (checkAuth()) {
      const data = { postId, comment };
      commentAPI.mutate(data);
    }
  };

  const toggleComments = (id) => {
    setActiveCommentId(activeCommentId === id ? null : id);
  };

  const likePost = (id) => {
    if (checkAuth()) {
      likesPostAPI.mutate(id);
    }
  };

  const unlikePost = (id) => {
    if (checkAuth()) {
      unlikesPostAPI.mutate(id);
    }
  };

  const handleShareClick = (e) => {
    if (!accessToken) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 space-y-10">
       {/* Welcome Section */}
       <div className="bg-[#FAF9F6] border border-gray-100 rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
              What's the <span className="text-violet-600 underline decoration-violet-200 decoration-8 underline-offset-4">vibe</span> today?
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md font-medium">Explore the latest stories and thoughts from your favorite people.</p>
            <Link 
              to="/create-post" 
              onClick={handleShareClick}
              className="group flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-2xl shadow-gray-200 hover:bg-violet-600 hover:shadow-violet-200 transition-all active:scale-95 inline-flex"
            >
              <span>Share a story</span>
              <TrendingUp size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
          <div className="relative hidden md:block">
            <div className="w-48 h-48 bg-violet-100 rounded-[3rem] rotate-12 flex items-center justify-center text-6xl shadow-inner border-2 border-white">✨</div>
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 border-white animate-bounce">🔥</div>
          </div>
       </div>

      {data.posts.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
          <p className="text-gray-400 text-xl font-medium">Your feed is a bit quiet... <br/> Be the first to break the silence! 🚀</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              Your Feed <span className="text-sm bg-gray-100 px-3 py-1 rounded-full font-bold text-gray-500">Newest</span>
            </h2>
          </div>
          
          <div className="grid gap-8">
            {data.posts.map((d) => (
              <div key={d._id} className="group bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-violet-100 transition-all hover:shadow-[0_20px_50px_-20px_rgba(124,58,237,0.1)]">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    {d.author.account.avatar?.url ? (
                      <img
                        src={d.author.account.avatar.url}
                        alt={d.author.account.username}
                        className="w-14 h-14 rounded-2xl object-cover ring-4 ring-gray-50 group-hover:ring-violet-50 transition-all"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 font-black text-xl border border-violet-100">
                         {d.author.account.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                        <button
                          onClick={() =>
                            navigate(`/user-profile/${d.author.account.username}`)
                          }
                          className="font-black text-gray-900 text-lg hover:text-violet-600 transition-colors block"
                        >
                          @{d.author.account.username}
                        </button>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-widest mt-0.5">
                          <Calendar size={12} />
                          {new Date(d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>

                {/* Content */}
                <p className="text-gray-700 text-lg mb-6 whitespace-pre-wrap leading-relaxed font-medium">{d.content}</p>
                
                {/* Images */}
                {d.images.length > 0 && (
                   <div className={`grid ${d.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-6`}>
                      {d.images.map((i, idx) => (
                        <img 
                          key={idx} 
                          src={i.url} 
                          alt="Post attachment" 
                          className="rounded-[1.5rem] object-cover w-full h-64 hover:scale-[1.02] transition-transform duration-500 shadow-sm border border-gray-50" 
                        />
                      ))}
                   </div>
                )}

                {/* Tags */}
                {d.tags && d.tags.filter(t => t).length > 0 && (
                   <div className="flex flex-wrap gap-2 mb-6">
                      {d.tags.map((tag, tIdx) => (
                         tag && (
                          <span key={tIdx} className="px-4 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-full border border-gray-100 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-100 transition-colors cursor-default">
                            #{tag}
                          </span>
                         )
                      ))}
                   </div>
                )}

                {/* Stats & Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                   <div className="flex gap-6">
                      <button 
                        onClick={() => likePost(d._id)}
                        className="flex items-center gap-2 group/btn"
                      >
                         <div className={`p-2 rounded-xl transition-all ${d.isLiked ? 'bg-pink-100 text-pink-600' : 'bg-gray-50 text-gray-400 group-hover/btn:bg-pink-50 group-hover/btn:text-pink-500'}`}>
                            <Heart size={20} fill={d.isLiked ? "currentColor" : "none"} />
                         </div>
                         <span className={`text-sm font-black ${d.isLiked ? 'text-pink-600' : 'text-gray-500'}`}>{d.likes}</span>
                      </button>

                      <button 
                        onClick={() => toggleComments(d._id)}
                        className="flex items-center gap-2 group/btn"
                      >
                         <div className={`p-2 rounded-xl transition-all ${activeCommentId === d._id ? 'bg-violet-100 text-violet-600' : 'bg-gray-50 text-gray-400 group-hover/btn:bg-violet-50 group-hover/btn:text-violet-500'}`}>
                            <MessageCircle size={20} />
                         </div>
                         <span className={`text-sm font-black ${activeCommentId === d._id ? 'text-violet-600' : 'text-gray-500'}`}>
                            {Array.isArray(d.comments) ? d.comments.length : d.comments}
                         </span>
                      </button>
                   </div>
                   
                   <div className="flex gap-2">
                      <button 
                        onClick={() => unlikePost(d._id)} 
                        className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        Dismiss
                      </button>
                   </div>
                </div>

                {/* Comments Section */}
                {activeCommentId === d._id && (
                  <div className="mt-8 pt-8 border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CommentList postId={d._id} />
                    {accessToken && (
                        <div className="mt-6 flex gap-3 bg-gray-50 p-2 rounded-[1.5rem] border border-gray-100 focus-within:border-violet-200 transition-all">
                          <input
                              type="text"
                              name="content"
                              value={comment.content}
                              onChange={handleChangeComment}
                              placeholder="Write a cute comment..."
                              className="flex-1 px-4 py-3 bg-transparent outline-none text-sm font-medium placeholder:text-gray-400"
                            />
                            <button 
                              onClick={() => addComment(d._id, comment)}
                              disabled={!comment.content.trim()}
                              className="p-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50 shadow-lg shadow-violet-100"
                            >
                              <Send size={18} />
                            </button>
                        </div>
                    )}
                    {!accessToken && (
                        <div className="mt-6 text-center p-6 bg-gray-50 rounded-2xl text-sm font-bold text-gray-500 border border-gray-100">
                            Please <Link to="/login" className="text-violet-600 hover:underline">login</Link> to join the conversation.
                        </div>
                    )}
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
