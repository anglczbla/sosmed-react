import {
  Calendar,
  Heart,
  MessageCircle,
  Send,
  Share2,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import useHome from "../hooks/useHome";
import CommentList from "./CommentList";

const Home = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    comment,
    activeCommentId,
    accessToken,
    handleChangeComment,
    addComment,
    toggleComments,
    likePost,
    unlikePost,
    handleShareClick,
    navigate,
  } = useHome();

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Curating your feed...
        </p>
      </div>
    );

  if (isError)
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-3xl inline-block border border-red-100">
          <p className="font-bold mb-2">Oops! Something went wrong</p>
          <p className="text-sm opacity-80">{error.message}</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-6 pb-32 pt-16">
      <div className="mb-24 space-y-8 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          Currently Vibe-ing
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tight leading-[0.9]">
            What's the <br/>
            <span className="text-violet-600">vibe</span> today?
          </h1>
          <p className="text-gray-400 text-xl font-medium max-w-md">
            A clean space for your thoughts, stories, and daily energy.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Link 
            to="/create-post" 
            onClick={handleShareClick}
            className="w-full sm:w-auto px-10 py-5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-gray-200"
          >
            <span>Post a Story</span>
            <TrendingUp size={20} />
          </Link>
          <div className="hidden sm:block h-10 w-px bg-gray-100 mx-2"></div>
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="pl-6 text-xs font-bold text-gray-400 flex items-center">
              +12 people sharing
            </div>
          </div>
        </div>
      </div>

      {data.posts.length === 0 ? (
        <div className="py-40 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl mx-auto flex items-center justify-center text-3xl">🏜️</div>
          <p className="text-gray-400 font-bold text-xl tracking-tight">
            Your feed is empty. <br/>
            <span className="text-violet-600 hover:underline cursor-pointer">Be the first to post.</span>
          </p>
        </div>
      ) : (
        <div className="space-y-24">
          <div className="grid gap-24">
            {data.posts.map((d) => (
              <article key={d._id} className="group relative">
                <div className="flex flex-col md:flex-row gap-8">
                  <aside className="md:w-16 flex-shrink-0 flex md:flex-col items-center gap-4">
                    <button
                      onClick={() => navigate(`/user-profile/${d.author.account.username}`)}
                      className="relative"
                    >
                      {d.author.account.avatar?.url ? (
                        <img
                          src={d.author.account.avatar.url}
                          alt={d.author.account.username}
                          className="w-16 h-16 rounded-3xl object-cover grayscale hover:grayscale-0 transition-all duration-500 ring-1 ring-gray-100"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-400 font-black text-xl border border-gray-100">
                           {d.author.account.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>
                    <div className="hidden md:block w-px flex-1 bg-gray-50 group-last:bg-transparent"></div>
                  </aside>

                  <div className="flex-1 space-y-6">
                    <header className="flex justify-between items-start">
                      <div className="space-y-1">
                        <button
                          onClick={() => navigate(`/user-profile/${d.author.account.username}`)}
                          className="text-lg font-black text-gray-900 hover:text-violet-600 transition-colors"
                        >
                          @{d.author.account.username}
                        </button>
                        <time className="block text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                          {new Date(d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </time>
                      </div>
                      <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                        <Share2 size={18} />
                      </button>
                    </header>

                    <section className="space-y-6">
                      <p className="text-xl text-gray-700 leading-relaxed font-medium">
                        {d.content}
                      </p>
                      
                      {d.images.length > 0 && (
                         <div className={`grid ${d.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                            {d.images.map((i, idx) => (
                              <div key={idx} className="aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden bg-gray-50">
                                <img 
                                  src={i.url} 
                                  alt="Post content" 
                                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" 
                                />
                              </div>
                            ))}
                         </div>
                      )}

                      {d.tags && d.tags.filter(t => t).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                           {d.tags.map((tag, tIdx) => (
                              tag && (
                               <span key={tIdx} className="text-xs font-bold text-gray-400 hover:text-violet-600 cursor-pointer">
                                 #{tag}
                               </span>
                              )
                           ))}
                        </div>
                      )}
                    </section>

                    <footer className="flex items-center gap-8 pt-4">
                      <button 
                        onClick={() => likePost(d._id)}
                        className={`flex items-center gap-2 group/btn transition-all ${d.isLiked ? 'text-pink-600' : 'text-gray-400 hover:text-gray-900'}`}
                      >
                        <Heart size={20} className="transition-transform group-hover/btn:scale-110" fill={d.isLiked ? "currentColor" : "none"} />
                        <span className="text-xs font-bold">{d.likes}</span>
                      </button>

                      <button 
                        onClick={() => toggleComments(d._id)}
                        className={`flex items-center gap-2 group/btn transition-all ${activeCommentId === d._id ? 'text-violet-600' : 'text-gray-400 hover:text-gray-900'}`}
                      >
                        <MessageCircle size={20} className="transition-transform group-hover/btn:scale-110" />
                        <span className="text-xs font-bold">
                           {Array.isArray(d.comments) ? d.comments.length : d.comments}
                        </span>
                      </button>
                    </footer>

                    {activeCommentId === d._id && (
                      <div className="mt-8 pt-8 border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-500">
                        <CommentList postId={d._id} />
                        {accessToken ? (
                            <div className="mt-8 flex gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:bg-white focus-within:border-violet-200 transition-all">
                              <input
                                  type="text"
                                  name="content"
                                  value={comment.content}
                                  onChange={handleChangeComment}
                                  placeholder="Write a comment..."
                                  className="flex-1 px-4 py-2 bg-transparent outline-none text-sm font-medium"
                                />
                                <button 
                                  onClick={() => addComment(d._id, comment)}
                                  disabled={!comment.content.trim()}
                                  className="p-3 bg-gray-900 text-white rounded-xl hover:bg-violet-600 transition-all disabled:opacity-30"
                                >
                                  <Send size={16} />
                                </button>
                            </div>
                        ) : (
                            <p className="mt-8 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                <Link to="/login" className="text-violet-600">Login</Link> to join the vibe
                            </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
