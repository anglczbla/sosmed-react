import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Profile = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://api.freeapi.app/api/v1/social-media/profile",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.data;
    },
  });

  if (isLoading) return "Loading...";

  if (isError) return "An error has occurred: " + error.message;

  return (
    <div>
      {data && (
        <div key={data._id}>
          <img src={data.avatar?.url} alt={data.username} width="100" />
          <h2>{data.username}</h2>
          <p>{data.email}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
