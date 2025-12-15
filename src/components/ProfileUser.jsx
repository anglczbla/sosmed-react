import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import apiClient from "../utils/api";

const ProfileUser = () => {
  const { username } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const response = await apiClient.get(
        `social-media/profile/u/${username}`
      );
      return response.data.data;
    },
  });

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading comments...</p>;
  if (isError)
    return (
      <p className="text-sm text-red-500">
        Error loading comments: {error.message}
      </p>
    );

  return (
    <div>
      <p>Username: {data.account.username}</p>
      <img src={data.account.avatar.url} />
      <p>Bio: {data.bio}</p>
      <p>Country Code: {data.countryCode}</p>
      <p>DOB: {data.dob}</p>
      <p>
        First name: {data.firstName} - {data.lastName}
      </p>
      <p>Followers: {data.followersCount}</p>
      <p>Following: {data.followingCount}</p>
    </div>
  );
};

export default ProfileUser;
