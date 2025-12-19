import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/api";
import CommentList from "./CommentList";

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
      alert("success like post");
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
      alert("success unlike post");
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  if (isLoading) return <div className="text-center py-20 text-gray-500 font-medium">Loading posts...</div>;
  if (isError) return <div className="text-center py-20 text-red-500 font-medium">An error has occurred</div>;

  console.log("isi data", data);

  const handleFormPost = (e) => {
    const { name, value } = e.target;
    setFormPost({ ...formPost, [name]: value });
  };

  const handleImage = (e) => {
    setImages([...images, ...e.target.files]);
  };

  const handleEditPost = (e) => {
    const { name, value } = e.target;
    setEditPost({ ...editPost, [name]: value });
  };

  const handleEditImage = (e) => {
    setEditImages([...editImages, ...e.target.files]);
  };

  const handleChangeComment = (e) => {
    const { name, value } = e.target;
    setComment({ ...comment, [name]: value });
  };

  const toggleShowEditPost = (index) => {
    setShowEditForm(index);
  };

  const submitPost = (e) => {
    e.preventDefault();
    const data = { formPost, images };
    createPost.mutate(data);
  };

  const deletePost = (postId) => {
    deletePostAPI.mutate(postId);
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
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Create Post Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm p-6 border border-white/50">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Post ✍️</h3>
        <form onSubmit={submitPost} className="space-y-4">
          <textarea
            name="content"
            value={formPost.content}
            onChange={handleFormPost}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none resize-none h-24 bg-gray-50/50"
          />
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative flex-1">
                <input
                  type="file"
                  multiple={true}
                  name="images"
                  accept="image/*"
                  onChange={handleImage}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
             </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              name="tags[0]"
              value={formPost["tags[0]"]}
              onChange={handleFormPost}
              placeholder="#tag1"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-200 outline-none"
            />
            <input
              type="text"
              name="tags[1]"
              value={formPost["tags[1]"]}
              onChange={handleFormPost}
              placeholder="#tag2"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-200 outline-none"
            />
            <input
              type="text"
              name="tags[2]"
              value={formPost["tags[2]"]}
              onChange={handleFormPost}
              placeholder="#tag3"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg hover:opacity-90 transition-all"
          >
            Post It!
          </button>
        </form>
      </div>

      {data.posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-gray-800 pl-2">Explore Posts 🌍</h1>
          <div className="space-y-6">
            {data.posts.map((d, index) => (
              <div key={d._id} className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 transition-shadow hover:shadow-md">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-purple-700 font-bold">
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
                  
                  <div className="flex gap-2">
                     <button onClick={() => toggleShowEditPost(index)} className="text-gray-400 hover:text-blue-500 text-xs font-medium">Edit</button>
                     <button onClick={() => deletePost(d._id)} className="text-gray-400 hover:text-red-500 text-xs font-medium">Delete</button>
                  </div>
                </div>

                {/* Edit Form Overlay */}
                {showEditForm === index && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-blue-100">
                    <h4 className="text-sm font-bold text-gray-600 mb-2">Edit Post</h4>
                    <div className="space-y-3">
                        <input
                          type="text"
                          name="content"
                          value={editPost.content}
                          placeholder="Edit content..."
                          onChange={handleEditPost}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        <input
                          type="text"
                          name="tags[0]"
                          value={editPost["tags[0]"]}
                          placeholder="Edit tag..."
                          onChange={handleEditPost}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        <input
                          type="file"
                          multiple={true}
                          name="editImages"
                          accept="image/*"
                          onChange={handleEditImage}
                          className="text-xs text-gray-500"
                        />
                        <button
                          onClick={() => updatePost(editPost, editImages, d._id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600"
                        >
                          Update
                        </button>
                    </div>
                  </div>
                )}

                {/* Content */}
                <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">{d.content}</p>
                
                {/* Images */}
                {d.images.length > 0 && (
                   <div className="grid grid-cols-2 gap-2 mb-4">
                      {d.images.map((i, idx) => (
                        <img key={idx} src={i.url} alt="Post attachment" className="rounded-xl object-cover w-full h-48 hover:scale-[1.02] transition-transform" />
                      ))}
                   </div>
                )}

                {/* Tags */}
                {d.tags && d.tags.length > 0 && (
                   <div className="flex flex-wrap gap-2 mb-4">
                      {d.tags.map((tag, tIdx) => (
                         tag && <span key={tIdx} className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">#{tag}</span>
                      ))}
                   </div>
                )}

                {/* Stats & Actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                   <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                         <span className="text-sm font-bold text-gray-600">{d.likes}</span>
                         <span className="text-xs text-gray-400">Likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <span className="text-sm font-bold text-gray-600">{Array.isArray(d.comments) ? d.comments.length : d.comments}</span>
                         <span className="text-xs text-gray-400">Comments</span>
                      </div>
                   </div>
                   
                   <div className="flex gap-2">
                      <button onClick={() => likePost(d._id)} className="px-3 py-1.5 rounded-lg text-sm font-medium text-pink-600 bg-pink-50 hover:bg-pink-100 transition-colors">
                        Like
                      </button>
                      <button onClick={() => unlikePost(d._id)} className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                        Unlike
                      </button>
                      <button onClick={() => toggleComments(d._id)} className="px-3 py-1.5 rounded-lg text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors">
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
                          placeholder="Write a comment..."
                          className="flex-1 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm"
                        />
                        <button 
                          onClick={() => addComment(d._id, comment)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-bold hover:bg-purple-700 transition-colors"
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

export default CreatePost;
