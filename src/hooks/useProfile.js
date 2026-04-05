import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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

const useProfile = () => {
  const queryClient = useQueryClient();
  const [formEdit, setFormEdit] = useState({
    bio: "",
    countryCode: "",
    dob: "",
    firstName: "",
    lastName: "",
    location: "",
    phoneNumber: "",
  });
  const [showFormEdit, setShowFormEdit] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [showFormAvatar, setShowFormAvatar] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await apiClient.get("/social-media/profile");
      return response.data.data;
    },
  });

  const {
    data: followersData,
    isLoading: followersLoading,
  } = useQuery({
    queryKey: ["followers", data?.account?.username],
    queryFn: async () => {
      if (!data?.account?.username) return null;
      const response = await apiClient.get(
        `social-media/follow/list/followers/${data.account.username}`
      );
      return response.data.data;
    },
    enabled: !!data?.account?.username && showFollowers,
  });

  const {
    data: followingData,
    isLoading: followingLoading,
  } = useQuery({
    queryKey: ["following", data?.account?.username],
    queryFn: async () => {
      if (!data?.account?.username) return null;
      const response = await apiClient.get(
        `social-media/follow/list/following/${data.account.username}`
      );
      return response.data.data;
    },
    enabled: !!data?.account?.username && showFollowing,
  });

  const updateAvatar = useMutation({
    mutationFn: (avatar) => {
      const formData = new FormData();
      formData.append("avatar", avatar);
      return apiClient.patch("/users/avatar", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const updateProfileAPI = useMutation({
    mutationFn: (formEdit) => {
      return apiClient.patch("/social-media/profile", formEdit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setFormEdit({
        bio: "",
        countryCode: "",
        dob: "",
        firstName: "",
        lastName: "",
        location: "",
        phoneNumber: "",
      });
      setShowFormEdit(null);
    },
    onError: (error) => {
      console.error(error);
      if (error.response?.status !== 422) {
        alert("An error occurred while updating profile");
      }
    },
  });

  const handleAvatar = (e) => {
    setNewAvatar(e.target.files[0]);
  };

  const toggleAvatar = () => {
    setShowFormAvatar(!showFormAvatar);
  };

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setFormEdit({ ...formEdit, [name]: value });

    if (updateProfileAPI.error) {
      updateProfileAPI.reset();
    }
  };

  const toggleFollowers = () => {
    setShowFollowers(!showFollowers);
    setShowFollowing(false);
  };

  const toggleFollowing = () => {
    setShowFollowing(!showFollowing);
    setShowFollowers(false);
  };

  const updateNewAvatar = (avatar) => {
    updateAvatar.mutate(avatar);
    setShowFormAvatar(false);
  };

  const showEditFormHandler = () => {
    if (!showFormEdit) {
      setFormEdit({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        bio: data.bio || "",
        location: data.location || "",
        phoneNumber: data.phoneNumber || "",
        countryCode: data.countryCode || "",
        dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
      });
    }
    setShowFormEdit(!showFormEdit);
    if (!showFormEdit && updateProfileAPI.error) {
      updateProfileAPI.reset();
    }
  };

  const updateProfile = (formEdit) => {
    updateProfileAPI.mutate(formEdit);
  };

  return {
    data,
    isLoading,
    isError,
    error,
    formEdit,
    showFormEdit,
    showFollowers,
    showFollowing,
    newAvatar,
    showFormAvatar,
    followersData,
    followersLoading,
    followingData,
    followingLoading,
    updateAvatar,
    updateProfileAPI,
    handleAvatar,
    toggleAvatar,
    handleEdit,
    toggleFollowers,
    toggleFollowing,
    updateNewAvatar,
    showEditFormHandler,
    updateProfile,
    setShowFollowers,
    setShowFollowing
  };
};

export default useProfile;
