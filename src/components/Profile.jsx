import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Profile = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axios.get(
        "https://api.freeapi.app/api/v1/social-media/profile"
      );
      return response.data.data;
    },
  });

  if (isLoading) return "Loading...";

  if (isError) return "An error has occurred: " + error.message;

  return (
    <div>
      <div key={data._id}>{data.account.username}</div>
    </div>
  );
};

export default Profile;
