import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../utils/api";

const ProfileUser = () => {
  const queryClient = useQueryClient();
  const { username } = useParams();
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  // profile user
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const response = await apiClient.get(
        `social-media/profile/u/${username}`
      );
      return response.data.data;
    },
  });

  console.log("isi data user", data);

  // followers
  const {
    data: followersData,
    isLoading: followersLoading,
    isError: followersError,
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

  // following
  const {
    data: followingData,
    isLoading: followingLoading,
    isError: followingError,
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
      alert("success follow user");
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
      alert("success unfollow user");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const toggleFollowers = () => {
    setShowFollowers(!showFollowers);
  };

  const toggleFollowing = () => {
    setShowFollowing(!showFollowing);
  };

  const followUser = (idUser) => {
    followUserAPI.mutate(idUser);
  };

  const unfollowUser = (idUser) => {
    unfollowUserAPI.mutate(idUser);
  };

  if (isLoading)
    return (
      <div className="text-center py-20 text-gray-500">Loading profile...</div>
    );
  if (isError)
    return (
      <div className="text-center py-20 text-red-500">
        Error loading profile: {error.message}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
        {/* Cover Banner */}
        <div className="h-48 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-400"></div>

        {/* Profile Header */}
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <div className="relative">
              <img
                src={
                  data.account.avatar?.url || "https://via.placeholder.com/150"
                }
                alt={data.account.username}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
              />
            </div>

            <button
              onClick={() => followUser(data.account._id)}
              className="mb-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Follow ✨
            </button>

            <button
              onClick={() => unfollowUser(data.account._id)}
              className="mb-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              UnFollow ✨
            </button>
          </div>

          <div className="mb-6">
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
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-700 leading-relaxed italic">
                  "{data.bio}"
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
              {data.location && <span>📍 {data.location}</span>}
              {data.dob && (
                <span>🎂 {new Date(data.dob).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>

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

export default ProfileUser;
