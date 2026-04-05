import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/api";

export const getValidationErrors = (error) => {
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

const useCreatePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [page] = useState(1);
  const [limit] = useState(10);
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

  const isPostOwner = (postAuthorId) => {
    return currentUser?.account?._id === postAuthorId;
  };

  const handleFormPost = (e) => {
    const { name, value } = e.target;
    setFormPost({ ...formPost, [name]: value });

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

  return {
    data,
    isLoading,
    isError,
    formPost,
    images,
    editPost,
    editImages,
    showEditForm,
    comment,
    activeCommentId,
    currentUser,
    createPost,
    updatePostAPI,
    handleFormPost,
    handleImage,
    handleEditPost,
    handleEditImage,
    handleChangeComment,
    toggleShowEditPost,
    submitPost,
    deletePost,
    updatePost,
    addComment,
    toggleComments,
    likePost,
    unlikePost,
    isPostOwner,
    setImages,
    setShowEditForm,
    navigate
  };
};

export default useCreatePost;
