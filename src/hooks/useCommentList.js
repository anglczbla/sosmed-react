import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apiClient from "../utils/api";

const useCommentList = (postId) => {
  const queryClient = useQueryClient();
  const [updateComments, setUpdateComments] = useState({
    content: "",
  });
  const [showEdit, setShowEdit] = useState(null);

  const { data, isLoading, isError } = useQuery({
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
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const deleteComment = (id) => {
    if (window.confirm("Remove this comment?")) {
      deleteCommentAPI.mutate(id);
    }
  };

  const handleEditComment = (e) => {
    const { name, value } = e.target;
    setUpdateComments({ ...updateComments, [name]: value });
  };

  const toggleEdit = (idx, currentContent) => {
    setUpdateComments({ content: currentContent });
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

  return {
    data,
    isLoading,
    isError,
    updateComments,
    showEdit,
    handleEditComment,
    toggleEdit,
    undoEdit,
    saveEditComment,
    likeComment,
    unlikesComment,
    deleteComment
  };
};

export default useCommentList;
