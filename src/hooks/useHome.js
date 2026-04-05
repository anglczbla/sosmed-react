import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/api";

const useHome = () => {
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

  return {
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
    navigate
  };
};

export default useHome;
