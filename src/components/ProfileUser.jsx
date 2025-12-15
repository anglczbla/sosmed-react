import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../utils/api";

const ProfileUser = () => {
  const { username } = useParams();
  const [showFollowers, setShowFollowers] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const response = await apiClient.get(
        `social-media/profile/u/${username}`
      );
      return response.data.data;
    },
  });

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

  const toggleFollowers = () => {
    setShowFollowers(!showFollowers);
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
      <p>Followers: {data.followersCount}</p>

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

      <p>Following: {data.followingCount}</p>
    </div>
  );
};

export default ProfileUser;
