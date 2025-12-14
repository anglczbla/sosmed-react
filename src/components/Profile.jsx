import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const Profile = () => {
  const queryClient = useQueryClient();
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
      console.log("isi response", response);

      return response.data.data;
    },
    staleTime: Infinity,
  });

  const updateAvatar = useMutation({
    mutationFn: (avatar) => {
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("avatar", avatar);
      return axios.patch(
        "https://api.freeapi.app/api/v1/users/avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      alert("avatar successfull update");
    },
    onError: (error) => {
      console.error(error);
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

  if (isLoading) return "Loading...";

  if (isError) return "An error has occurred: " + error.message;

  console.log("xxx", data);

  const updateNewAvatar = (avatar) => {
    updateAvatar.mutate(avatar);
  };

  return (
    <div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {data && (
        <div key={data._id}>
          <img
            src={data.account.avatar?.url}
            alt={data.account.username}
            width="100"
          />
          <button onClick={toggleAvatar}>Update Avatar</button>
          {showFormAvatar ? (
            <div>
              <input
                type="file"
                onChange={handleAvatar}
                accept="image/*"
                placeholder="send avatar"
              />
              <button onClick={() => updateNewAvatar(newAvatar)}>Update</button>
            </div>
          ) : null}
          <h2>{data.account.username}</h2>
          <p>{data.account.email}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
