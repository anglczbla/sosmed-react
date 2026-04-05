import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../utils/api";

const useProfileUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { username } = useParams();
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const userString = localStorage.getItem("user");
  const loggedInUser = userString ? JSON.parse(userString) : null;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const response = await apiClient.get(
        `social-media/profile/u/${username}`
      );
      return response.data.data;
    },
  });

  const isOwnProfile =
    loggedInUser &&
    (loggedInUser.username === username ||
      loggedInUser.account?.username === username);

  const {
    data: followersData,
    isLoading: followersLoading,
  } = useQuery({
    queryKey: ["followers", username],
    queryFn: async () => {
      const response = await apiClient.get(
        `social-media/follow/list/followers/${username}`
      );
      return response.data.data;
    },
    enabled: showFollowers,
  });

  const {
    data: followingData,
    isLoading: followingLoading,
  } = useQuery({
    queryKey: ["following", username],
    queryFn: async () => {
      const response = await apiClient.get(
        `social-media/follow/list/following/${username}`
      );
      return response.data.data;
    },
    enabled: showFollowing,
  });

  const followUserAPI = useMutation({
    mutationFn: (userId) => {
      return apiClient.post(`social-media/follow/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const unfollowUserAPI = useMutation({
    mutationFn: (userId) => {
      return apiClient.post(`social-media/follow/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const toggleFollowers = () => {
    setShowFollowers(!showFollowers);
    setShowFollowing(false);
  };

  const toggleFollowing = () => {
    setShowFollowing(!showFollowing);
    setShowFollowers(false);
  };

  const followUser = (idUser) => {
    if (!localStorage.getItem("accessToken")) return navigate("/login");
    followUserAPI.mutate(idUser);
  };

  const unfollowUser = (idUser) => {
    if (!localStorage.getItem("accessToken")) return navigate("/login");
    unfollowUserAPI.mutate(idUser);
  };

  return {
    data,
    isLoading,
    isError,
    error,
    showFollowers,
    showFollowing,
    followersData,
    followersLoading,
    followingData,
    followingLoading,
    isOwnProfile,
    username,
    toggleFollowers,
    toggleFollowing,
    followUser,
    unfollowUser,
    navigate,
    setShowFollowers,
    setShowFollowing
  };
};

export default useProfileUser;
