import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Image as ImageIcon, 
  Tag, 
  Trash2, 
  Edit3, 
  Plus, 
  Send, 
  X, 
  Calendar, 
  Heart, 
  MessageCircle,
  MoreHorizontal,
  PlusCircle,
  Sparkles,
  Smile
} from "lucide-react";
import apiClient from "../utils/api";
import CommentList from "./CommentList";

const getValidationErrors = (error) => {
  if (error?.response?.status === 422 && error?.response?.data?.errors) {
    const errors = error.response.data.errors;
    const formattedErrors = {};

    errors.forEach((errorObj) => {
      const field = Object.keys(errorObj)[0];
      const message = errorObj[field];

      if (!formattedErrors[field]) {
        formattedErrors[field] = message;
      }
    });

    return formattedErrors;
  }
  return {};
};

const CreatePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [formPost, setFormPost] = useState({
    content: "",
    "tags[0]": "",
    "tags[1]": "",
    "tags[2]": "",
  });
  const [editPost, setEditPost] = useState({
    content: "",
    "tags[0]": "",
  });
  const [editImages, setEditImages] = useState([]);
  const [images, setImages] = useState([]);
  const [showEditForm, setShowEditForm] = useState(null);
  const [comment, setComment] = useState({
    content: "",
  });
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", page, limit],
    queryFn: async () => {
      const response = await apiClient.get(
        `/social-media/posts?page=${page}&limit=${limit}`
      );
      return response.data.data;
    },
    staleTime: Infinity,
  });

  const { data: currentUser } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await apiClient.get("/social-media/profile");
      return response.data.data;
    },
  });

  const createPost = useMutation({
    mutationFn: (data) => {
      const { formPost: newPost, images } = data;
      const formData = new FormData();
      formData.append("content", newPost.content);
      images.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("tags[0]", newPost["tags[0]"]);
      formData.append("tags[1]", newPost["tags[1]"]);
      formData.append("tags[2]", newPost["tags[2]"]);
      return apiClient.post("/social-media/posts", formData);
    },
    onSuccess: () => {
      alert("success add post");
      queryClient.invalidateQueries({ queryKey: ["post"] });
      setFormPost({
        content: "",
        "tags[0]": "",
        "tags[1]": "",
        "tags[2]": "",
      });
      setImages([]);
    },
    onError: (error) => {
      console.error(error);
      if (error.response?.status !== 422) {
        alert("An error occurred while creating post");
      }
    },
  });

  const updatePostAPI = useMutation({
    mutationFn: (newData) => {
      const { editPost, editImages, id } = newData;
      const formData = new FormData();
      formData.append("content", editPost.content);
      editImages.forEach((i) => formData.append("images", i));
      formData.append("tags[0]", editPost["tags[0]"]);
      return apiClient.patch(`/social-media/posts/${id}`, formData);
    },
    onSuccess: () => {
      alert("success update post");
      queryClient.invalidateQueries({ queryKey: ["post"] });
      setEditPost({
        content: "",
        "tags[0]": "",
      });
      setEditImages([]);
      setShowEditForm(null);
    },
    onError: (error) => {
      console.error(error);
      if (error.response?.status !== 422) {
        alert("An error occurred while updating post");
      }
    },
  });

  const deletePostAPI = useMutation({
    mutationFn: (postId) => {
      return apiClient.delete(`/social-media/posts/${postId}`);
    },
    onSuccess: () => {
      alert("success delete post");
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const commentAPI = useMutation({
    mutationFn: (data) => {
      const { postId, comment } = data;
      return apiClient.post(`/social-media/comments/post/${postId}`, comment);
    },
    onSuccess: (data, variables) => {
      console.log("isi variables", variables);

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

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse">Curating your space...</p>
      </div>
    );
    
  if (isError)
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-red-50 text-red-500 p-8 rounded-[2.5rem] border border-red-100 inline-block">
          <p className="font-black text-lg mb-2">Oops! Something went wrong 😭</p>
          <p className="text-sm opacity-70 italic">Please try again later</p>
        </div>
      </div>
    );

  // Check if current user is the post owner
  const isPostOwner = (postAuthorId) => {
    return currentUser?.account?._id === postAuthorId;
  };

  const handleFormPost = (e) => {
    const { name, value } = e.target;
    setFormPost({ ...formPost, [name]: value });

    // Reset error when user types
    if (createPost.error) {
      createPost.reset();
    }
  };

  const handleImage = (e) => {
    setImages([...images, ...e.target.files]);
  };

  const handleEditPost = (e) => {
    const { name, value } = e.target;
    setEditPost({ ...editPost, [name]: value });

    if (updatePostAPI.error) {
      updatePostAPI.reset();
    }
  };

  const handleEditImage = (e) => {
    setEditImages([...editImages, ...e.target.files]);
  };

  const handleChangeComment = (e) => {
    const { name, value } = e.target;
    setComment({ ...comment, [name]: value });
  };

  const toggleShowEditPost = (index, post) => {
    if (showEditForm === index) {
      setShowEditForm(null);
    } else {
      setEditPost({
        content: post.content,
        "tags[0]": post.tags?.[0] || "",
      });
      setShowEditForm(index);
    }
    
    if (updatePostAPI.error) {
      updatePostAPI.reset();
    }
  };

  const submitPost = (e) => {
    e.preventDefault();
    const data = { formPost, images };
    createPost.mutate(data);
  };

  const deletePost = (postId) => {
    if(window.confirm("Delete this? No cap?")) {
      deletePostAPI.mutate(postId);
    }
  };

  const updatePost = (editPost, editImages, id) => {
    const newPost = { editPost, editImages, id };
    updatePostAPI.mutate(newPost);
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
    <div className="max-w-3xl mx-auto px-4 pb-20 space-y-12">
      {/* Create Post Card */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-8 border border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50/50 rounded-full -mr-16 -mt-16 z-0"></div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            What's popping? <Sparkles size={24} className="text-violet-500" />
          </h3>
          
          <form onSubmit={submitPost} className="space-y-6">
            <div className="relative">
              <textarea
                name="content"
                value={formPost.content}
                onChange={handleFormPost}
                placeholder="Share your thoughts... be unique! ✨"
                className={`w-full px-6 py-5 rounded-[1.5rem] border-2 ${
                  getValidationErrors(createPost.error).content
                    ? "border-red-100 bg-red-50/30 focus:border-red-400"
                    : "border-gray-50 bg-gray-50/50 focus:border-violet-200 focus:bg-white"
                } outline-none resize-none h-32 text-gray-700 font-medium transition-all text-lg`}
              />
              {getValidationErrors(createPost.error).content && (
                <p className="text-xs text-red-500 mt-2 font-black ml-2 tracking-wide">
                  {getValidationErrors(createPost.error).content}
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border-2 border-dashed ${getValidationErrors(createPost.error).images ? 'border-red-200 bg-red-50' : 'border-gray-200'} cursor-pointer hover:border-violet-300 transition-all group`}>
                   <ImageIcon size={20} className={getValidationErrors(createPost.error).images ? 'text-red-400' : 'text-gray-400 group-hover:text-violet-500'} />
                   <span className={`text-sm font-black ${getValidationErrors(createPost.error).images ? 'text-red-500' : 'text-gray-500 group-hover:text-violet-600'}`}>
                    {images.length > 0 ? `${images.length} files selected` : "Add photos"}
                   </span>
                   <input
                    type="file"
                    multiple={true}
                    name="images"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>
                {getValidationErrors(createPost.error).images && (
                  <p className="text-xs text-red-500 mt-2 font-black ml-2 tracking-wide">
                    {getValidationErrors(createPost.error).images}
                  </p>
                )}
              </div>

              <div className="flex gap-2 flex-1">
                <div className="relative flex-1 group">
                  <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                  <input
                    type="text"
                    name="tags[0]"
                    value={formPost["tags[0]"]}
                    onChange={handleFormPost}
                    placeholder="#tag"
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-violet-200 focus:bg-white outline-none text-sm font-bold transition-all placeholder:text-gray-300"
                  />
                </div>
                <div className="relative flex-1 group">
                  <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                  <input
                    type="text"
                    name="tags[1]"
                    value={formPost["tags[1]"]}
                    onChange={handleFormPost}
                    placeholder="#vibe"
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-violet-200 focus:bg-white outline-none text-sm font-bold transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {Array.from(images).map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                    <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={18} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={createPost.isPending || !formPost.content.trim()}
              className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-gray-200 hover:bg-violet-600 hover:shadow-violet-200 transition-all active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-3 mt-4"
            >
              {createPost.isPending ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Post now</span>
                  <PlusCircle size={22} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-8">
        <h1 className="text-3xl font-black text-gray-900 pl-2 flex items-center gap-4">
          Explore <div className="h-1 flex-1 bg-gray-100 rounded-full mt-1"></div>
        </h1>
        
        <div className="grid gap-10">
          {data.posts.map((d, index) => (
            <div
              key={d._id}
              className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 hover:border-violet-100 transition-all hover:shadow-[0_30px_60px_-25px_rgba(124,58,237,0.12)]"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  {d.author.account.avatar?.url ? (
                    <img
                      src={d.author.account.avatar.url}
                      alt={d.author.account.username}
                      className="w-14 h-14 rounded-[1.25rem] object-cover ring-4 ring-gray-50 group-hover:ring-violet-50 transition-all"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-[1.25rem] bg-violet-50 flex items-center justify-center text-violet-600 font-black text-xl border border-violet-100">
                      {d.author.account.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <button
                      onClick={() => navigate(`/user-profile/${d.author.account.username}`)}
                      className="font-black text-gray-900 text-lg hover:text-violet-600 transition-colors block"
                    >
                      @{d.author.account.username}
                    </button>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-widest mt-0.5">
                      <Calendar size={12} />
                      {new Date(d.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {isPostOwner(d.author.account._id) && (
                  <div className="flex gap-2 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100">
                    <button
                      onClick={() => toggleShowEditPost(index, d)}
                      className={`p-2.5 rounded-xl transition-all ${showEditForm === index ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'text-gray-400 hover:text-violet-600 hover:bg-white hover:shadow-sm'}`}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => deletePost(d._id)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Edit Form Overlay */}
              {showEditForm === index && (
                <div className="mb-8 p-8 bg-violet-50/50 rounded-[2rem] border border-violet-100 animate-in zoom-in-95 duration-300">
                  <h4 className="text-xs font-black text-violet-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Edit3 size={14} /> Editing Post
                  </h4>
                  <div className="space-y-6">
                    <div className="relative">
                      <textarea
                        name="content"
                        value={editPost.content}
                        onChange={handleEditPost}
                        className={`w-full px-6 py-5 rounded-[1.5rem] border-2 ${
                          getValidationErrors(updatePostAPI.error).content
                            ? "border-red-300 bg-red-50 focus:border-red-400"
                            : "border-violet-100 focus:border-violet-300 bg-white"
                        } outline-none text-gray-700 font-medium shadow-inner transition-all`}
                        rows="3"
                      />
                      {getValidationErrors(updatePostAPI.error).content && (
                        <p className="text-xs text-red-500 mt-2 font-black ml-2 tracking-wide">
                          {getValidationErrors(updatePostAPI.error).content}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative group">
                        <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400" />
                        <input
                          type="text"
                          name="tags[0]"
                          value={editPost["tags[0]"]}
                          onChange={handleEditPost}
                          placeholder="Update tag"
                          className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-violet-100 focus:border-violet-300 outline-none text-sm font-bold bg-white transition-all"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <label className={`flex items-center justify-center px-6 py-4 rounded-2xl border-2 border-dashed ${
                          getValidationErrors(updatePostAPI.error).images
                            ? "border-red-300 bg-red-50"
                            : "border-violet-100 bg-white"
                        } cursor-pointer hover:border-violet-300 transition-colors group`}>
                          <ImageIcon size={20} className={getValidationErrors(updatePostAPI.error).images ? "text-red-400" : "text-violet-400"} />
                          <span className={`ml-2 text-sm font-bold ${getValidationErrors(updatePostAPI.error).images ? "text-red-500" : "text-violet-400"}`}>
                            {editImages.length > 0 ? `${editImages.length} new photos` : "Change photos"}
                          </span>
                          <input type="file" multiple onChange={handleEditImage} className="hidden" />
                        </label>
                        {getValidationErrors(updatePostAPI.error).images && (
                          <p className="text-xs text-red-500 mt-2 font-black ml-2 tracking-wide">
                            {getValidationErrors(updatePostAPI.error).images}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => updatePost(editPost, editImages, d._id)}
                        disabled={updatePostAPI.isPending}
                        className="flex-1 py-4 bg-violet-600 text-white rounded-2xl text-sm font-black hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all disabled:opacity-50"
                      >
                        {updatePostAPI.isPending ? "Updating..." : "Save changes"}
                      </button>
                      <button
                        onClick={() => setShowEditForm(null)}
                        className="px-8 py-4 bg-white text-gray-500 rounded-2xl text-sm font-bold border-2 border-gray-100 hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <p className="text-gray-700 text-xl mb-8 whitespace-pre-wrap leading-relaxed font-medium">
                {d.content}
              </p>

              {/* Images */}
              {d.images.length > 0 && (
                <div className={`grid ${d.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4 mb-8`}>
                  {d.images.map((i, idx) => (
                    <img
                      key={idx}
                      src={i.url}
                      alt="Post attachment"
                      className="rounded-[2rem] object-cover w-full h-80 hover:scale-[1.02] transition-transform duration-700 shadow-sm border border-gray-50"
                    />
                  ))}
                </div>
              )}

              {/* Tags */}
              {d.tags && d.tags.filter(t => t).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {d.tags.map((tag, tIdx) => (
                      tag && (
                        <span key={tIdx} className="px-5 py-2 bg-gray-50 text-gray-500 text-xs font-black rounded-full border border-gray-100 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-100 transition-colors">
                          #{tag}
                        </span>
                      )
                  ))}
                </div>
              )}

              {/* Stats & Actions */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                <div className="flex gap-8">
                  <button onClick={() => likePost(d._id)} className="flex items-center gap-2 group/btn">
                    <div className={`p-2.5 rounded-2xl transition-all ${d.isLiked ? 'bg-pink-100 text-pink-600' : 'bg-gray-50 text-gray-400 group-hover/btn:bg-pink-50'}`}>
                      <Heart size={22} fill={d.isLiked ? "currentColor" : "none"} />
                    </div>
                    <span className={`text-sm font-black ${d.isLiked ? 'text-pink-600' : 'text-gray-500'}`}>{d.likes}</span>
                  </button>
                  
                  <button onClick={() => toggleComments(d._id)} className="flex items-center gap-2 group/btn">
                    <div className={`p-2.5 rounded-2xl transition-all ${activeCommentId === d._id ? 'bg-violet-100 text-violet-600' : 'bg-gray-50 text-gray-400 group-hover/btn:bg-violet-50'}`}>
                      <MessageCircle size={22} />
                    </div>
                    <span className={`text-sm font-black ${activeCommentId === d._id ? 'text-violet-600' : 'text-gray-500'}`}>
                      {Array.isArray(d.comments) ? d.comments.length : d.comments}
                    </span>
                  </button>
                </div>
                
                <button className="p-3 text-gray-300 hover:text-gray-900 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Comments Section */}
              {activeCommentId === d._id && (
                <div className="mt-8 pt-8 border-t border-gray-50 animate-in fade-in slide-in-from-top-4 duration-500">
                  <CommentList postId={d._id} />
                  
                  {localStorage.getItem("accessToken") ? (
                    <div className="mt-8 flex gap-3 bg-gray-50 p-2.5 rounded-[2rem] border border-gray-100 focus-within:border-violet-200 focus-within:bg-white transition-all">
                      <input
                        type="text"
                        name="content"
                        value={comment.content}
                        onChange={handleChangeComment}
                        placeholder="Say something nice..."
                        className="flex-1 px-5 py-3 bg-transparent outline-none text-sm font-bold placeholder:text-gray-400"
                      />
                      <button
                        onClick={() => addComment(d._id, comment)}
                        disabled={!comment.content.trim()}
                        className="p-4 bg-violet-600 text-white rounded-2xl hover:bg-violet-700 shadow-xl shadow-violet-100 transition-all disabled:opacity-30"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-8 p-6 text-center bg-gray-50 rounded-[2rem] border border-gray-100">
                      <p className="text-gray-400 font-bold">Log in to join the conversation!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
