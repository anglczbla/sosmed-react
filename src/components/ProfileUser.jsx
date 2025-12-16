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

  const toggleFollowers = () => {
    setShowFollowers(!showFollowers);
  };

  const toggleFollowing = () => {
    setShowFollowing(!showFollowing);
  };

  const followUser = (idUser) => {
    followUserAPI.mutate(idUser);
  };

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading profile...</p>;
  if (isError)
    return (
      <p className="text-sm text-red-500">
        Error loading profile: {error.message}
      </p>
    );

  return (
    <div>
      <p>Username: {data.account.username}</p>
      <img src={data.account.avatar.url} alt={data.account.username} />
      <p>Bio: {data.bio}</p>
      <p>Country Code: {data.countryCode}</p>
      <p>DOB: {data.dob}</p>
      <p>
        First name: {data.firstName} - {data.lastName}
      </p>

      {/* followers */}
      <div>
        <p>Followers: {data.followersCount}</p>
        <button onClick={() => followUser(data.account._id)}>
          Follow user
        </button>
        <button onClick={toggleFollowers}>
          {showFollowers ? "Hide Followers" : "See Followers"}
        </button>

        {showFollowers && (
          <div>
            {followersLoading && <p>Loading followers...</p>}
            {followersError && <p>Error loading followers</p>}

            {followersData && followersData.followers?.length === 0 && (
              <p>No followers</p>
            )}

            {followersData && followersData.followers?.length > 0 && (
              <div>
                {followersData.followers.map((f) => (
                  <div key={f._id}>
                    <img src={f.avatar.url} alt={f.username} />
                    <ul>
                      <li>Username: {f.username}</li>
                      <li>BIO: {f.profile.bio}</li>
                      <li>Country Code: {f.profile.countryCode}</li>
                      <li>Dob: {f.profile.dob}</li>
                      <li>
                        Name: {f.profile.firstName} - {f.profile.lastName}
                      </li>
                      <li>Location: {f.profile.location}</li>
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* following */}
      <div>
        <p>Following: {data.followingCount}</p>
        <button onClick={toggleFollowing}>
          {showFollowing ? "Hide Following" : "See Following"}
        </button>

        {showFollowing && (
          <div>
            {followingLoading && <p>Loading following...</p>}
            {followingError && <p>Error loading following</p>}

            {followingData && followingData.following?.length === 0 && (
              <p>Not following anyone</p>
            )}

            {followingData && followingData.following?.length > 0 && (
              <div>
                {followingData.following.map((f) => (
                  <div key={f._id}>
                    <img src={f.avatar.url} alt={f.username} />
                    <ul>
                      <li>Username: {f.username}</li>
                      <li>BIO: {f.profile.bio}</li>
                      <li>Country Code: {f.profile.countryCode}</li>
                      <li>Dob: {f.profile.dob}</li>
                      <li>
                        Name: {f.profile.firstName} - {f.profile.lastName}
                      </li>
                      <li>Location: {f.profile.location}</li>
                      <li>
                        Status:{" "}
                        {f.isFollowing ? "Following ✓" : "Not Following"}
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileUser;
