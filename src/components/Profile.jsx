import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apiClient from "../utils/api";

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

const Profile = () => {
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

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await apiClient.get("/social-media/profile");
      console.log("isi response", response);
      return response.data.data;
    },
  });

  const {
    data: followersData,
    isLoading: followersLoading,
    isError: followersError,
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
    isError: followingError,
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
      alert("avatar successfully updated");
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
      alert("success update profile");
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

  const [newAvatar, setNewAvatar] = useState(null);
  const [showFormAvatar, setShowFormAvatar] = useState(null);

  const handleAvatar = (e) => {
    setNewAvatar(e.target.files[0]);
  };

  const toggleAvatar = () => {
    setShowFormAvatar(!showFormAvatar);
  };

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setFormEdit({ ...formEdit, [name]: value });

    // Clear validation error for this field when user starts typing
    if (updateProfileAPI.error) {
      updateProfileAPI.reset();
    }
  };

  const toggleFollowers = () => {
    setShowFollowers(!showFollowers);
  };

  const toggleFollowing = () => {
    setShowFollowing(!showFollowing);
  };

  if (isLoading)
    return (
      <div className="text-center py-20 text-gray-500">Loading profile...</div>
    );
  if (isError)
    return (
      <div className="text-center py-20 text-red-500">
        An error has occurred: {error.message}
      </div>
    );

  console.log("xxx", data);

  const updateNewAvatar = (avatar) => {
    updateAvatar.mutate(avatar);
  };

  const showEditForm = () => {
    setShowFormEdit(!showFormEdit);
    if (!showFormEdit && updateProfileAPI.error) {
      updateProfileAPI.reset();
    }
  };

  const updateProfile = (formEdit) => {
    updateProfileAPI.mutate(formEdit);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {data && (
        <div
          key={data._id}
          className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100"
        >
          {/* Cover Banner */}
          <div className="h-48 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 relative"></div>

          {/* Profile Header */}
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-16 mb-6">
              <div className="relative">
                <img
                  src={
                    data.account.avatar?.url ||
                    "https://via.placeholder.com/150"
                  }
                  alt={data.account.username}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                />
                <button
                  onClick={toggleAvatar}
                  className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-purple-600 transition-colors"
                >
                  ✏️
                </button>
              </div>

              <button
                onClick={showEditForm}
                className="mb-4 px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-all"
              >
                Edit Profile
              </button>
            </div>

            {/* Avatar Update Form */}
            {showFormAvatar && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                <p className="text-sm font-bold text-gray-600 mb-2">
                  Update Profile Picture
                </p>
                <div className="flex gap-2">
                  <input
                    type="file"
                    onChange={handleAvatar}
                    accept="image/*"
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  <button
                    onClick={() => updateNewAvatar(newAvatar)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700"
                  >
                    Upload
                  </button>
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 mb-1">
                {data.firstName} {data.lastName}
              </h1>
              <p className="text-lg text-gray-500 font-medium">
                @{data.account.username}
              </p>

              <div className="flex gap-8 mt-6">
                <button
                  onClick={toggleFollowers}
                  className="text-center group hover:bg-gray-50 p-2 rounded-xl transition-colors"
                >
                  <span className="block text-2xl font-bold text-gray-900">
                    {data.followersCount}
                  </span>
                  <span className="text-sm text-gray-500 font-medium group-hover:text-purple-600 transition-colors">
                    Followers
                  </span>
                </button>
                <button
                  onClick={toggleFollowing}
                  className="text-center group hover:bg-gray-50 p-2 rounded-xl transition-colors"
                >
                  <span className="block text-2xl font-bold text-gray-900">
                    {data.followingCount}
                  </span>
                  <span className="text-sm text-gray-500 font-medium group-hover:text-purple-600 transition-colors">
                    Following
                  </span>
                </button>
              </div>

              {data.bio && (
                <div className="mt-6 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <p className="text-purple-900 leading-relaxed">
                    "{data.bio}"
                  </p>
                </div>
              )}
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-2">
                <span className="font-bold">Email:</span> {data.account.email}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Phone:</span>{" "}
                {data.phoneNumber || "-"}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Location:</span>{" "}
                {data.location || "-"}
              </div>
            </div>

            {/* Edit Profile Form Overlay */}
            {showFormEdit === true && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Edit Profile
                    </h2>
                    <button
                      onClick={showEditForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formEdit.firstName}
                          onChange={handleEdit}
                          className={`w-full px-4 py-2 rounded-xl border ${
                            getValidationErrors(updateProfileAPI.error)
                              .firstName
                              ? "border-red-400 focus:ring-red-400"
                              : "border-gray-200 focus:ring-purple-400"
                          } focus:ring-2 outline-none`}
                          placeholder="First Name"
                        />
                        {getValidationErrors(updateProfileAPI.error)
                          .firstName && (
                          <p className="text-xs text-red-500 mt-1">
                            {
                              getValidationErrors(updateProfileAPI.error)
                                .firstName
                            }
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formEdit.lastName}
                          onChange={handleEdit}
                          className={`w-full px-4 py-2 rounded-xl border ${
                            getValidationErrors(updateProfileAPI.error).lastName
                              ? "border-red-400 focus:ring-red-400"
                              : "border-gray-200 focus:ring-purple-400"
                          } focus:ring-2 outline-none`}
                          placeholder="Last Name"
                        />
                        {getValidationErrors(updateProfileAPI.error)
                          .lastName && (
                          <p className="text-xs text-red-500 mt-1">
                            {
                              getValidationErrors(updateProfileAPI.error)
                                .lastName
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formEdit.bio}
                        onChange={handleEdit}
                        className={`w-full px-4 py-2 rounded-xl border ${
                          getValidationErrors(updateProfileAPI.error).bio
                            ? "border-red-400 focus:ring-red-400"
                            : "border-gray-200 focus:ring-purple-400"
                        } focus:ring-2 outline-none h-24 resize-none`}
                        placeholder="Tell us about yourself..."
                      />
                      {getValidationErrors(updateProfileAPI.error).bio && (
                        <p className="text-xs text-red-500 mt-1">
                          {getValidationErrors(updateProfileAPI.error).bio}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formEdit.location}
                        onChange={handleEdit}
                        className={`w-full px-4 py-2 rounded-xl border ${
                          getValidationErrors(updateProfileAPI.error).location
                            ? "border-red-400 focus:ring-red-400"
                            : "border-gray-200 focus:ring-purple-400"
                        } focus:ring-2 outline-none`}
                        placeholder="City, Country"
                      />
                      {getValidationErrors(updateProfileAPI.error).location && (
                        <p className="text-xs text-red-500 mt-1">
                          {getValidationErrors(updateProfileAPI.error).location}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phoneNumber"
                          value={formEdit.phoneNumber}
                          onChange={handleEdit}
                          className={`w-full px-4 py-2 rounded-xl border ${
                            getValidationErrors(updateProfileAPI.error)
                              .phoneNumber
                              ? "border-red-400 focus:ring-red-400"
                              : "border-gray-200 focus:ring-purple-400"
                          } focus:ring-2 outline-none`}
                          placeholder="+123456789"
                        />
                        {getValidationErrors(updateProfileAPI.error)
                          .phoneNumber && (
                          <p className="text-xs text-red-500 mt-1">
                            {
                              getValidationErrors(updateProfileAPI.error)
                                .phoneNumber
                            }
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">
                          Country Code
                        </label>
                        <input
                          type="text"
                          name="countryCode"
                          value={formEdit.countryCode}
                          onChange={handleEdit}
                          className={`w-full px-4 py-2 rounded-xl border ${
                            getValidationErrors(updateProfileAPI.error)
                              .countryCode
                              ? "border-red-400 focus:ring-red-400"
                              : "border-gray-200 focus:ring-purple-400"
                          } focus:ring-2 outline-none`}
                          placeholder="+62"
                        />
                        {getValidationErrors(updateProfileAPI.error)
                          .countryCode && (
                          <p className="text-xs text-red-500 mt-1">
                            {
                              getValidationErrors(updateProfileAPI.error)
                                .countryCode
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formEdit.dob}
                        onChange={handleEdit}
                        className={`w-full px-4 py-2 rounded-xl border ${
                          getValidationErrors(updateProfileAPI.error).dob
                            ? "border-red-400 focus:ring-red-400"
                            : "border-gray-200 focus:ring-purple-400"
                        } focus:ring-2 outline-none`}
                      />
                      {getValidationErrors(updateProfileAPI.error).dob && (
                        <p className="text-xs text-red-500 mt-1">
                          {getValidationErrors(updateProfileAPI.error).dob}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => updateProfile(formEdit)}
                      disabled={updateProfileAPI.isPending}
                      className="w-full mt-4 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {updateProfileAPI.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Followers Section */}
      {showFollowers && (
        <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Followers</h3>
          {followersLoading && (
            <p className="text-gray-500">Loading followers...</p>
          )}
          {followersError && (
            <p className="text-red-500">Error loading followers</p>
          )}
          {followersData && followersData.followers?.length === 0 && (
            <p className="text-gray-500 italic">No followers yet.</p>
          )}
          {followersData && followersData.followers?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {followersData.followers.map((f) => (
                <div
                  key={f._id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-purple-50 transition-colors border border-transparent hover:border-purple-100"
                >
                  <img
                    src={f.avatar?.url || "https://via.placeholder.com/50"}
                    alt={f.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-800">@{f.username}</p>
                    <p className="text-xs text-gray-500">
                      {f.profile?.firstName} {f.profile?.lastName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Following Section */}
      {showFollowing && (
        <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Following</h3>
          {followingLoading && (
            <p className="text-gray-500">Loading following...</p>
          )}
          {followingError && (
            <p className="text-red-500">Error loading following</p>
          )}
          {followingData && followingData.following?.length === 0 && (
            <p className="text-gray-500 italic">Not following anyone.</p>
          )}
          {followingData && followingData.following?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {followingData.following.map((f) => (
                <div
                  key={f._id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-purple-50 transition-colors border border-transparent hover:border-purple-100"
                >
                  <img
                    src={f.avatar?.url || "https://via.placeholder.com/50"}
                    alt={f.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-800">@{f.username}</p>
                    <p className="text-xs text-gray-500">
                      {f.profile?.firstName} {f.profile?.lastName}
                    </p>
                    <p className="text-xs font-semibold text-purple-600 mt-1">
                      {f.isFollowing ? "Following" : "Not Following"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
