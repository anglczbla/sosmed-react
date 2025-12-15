import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apiClient from "../utils/api";

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
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await apiClient.get("/social-media/profile");
      console.log("isi response", response);
      return response.data.data;
    },
    staleTime: Infinity,
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
  };

  if (isLoading) return "Loading...";
  if (isError) return "An error has occurred: " + error.message;

  console.log("xxx", data);

  const updateNewAvatar = (avatar) => {
    updateAvatar.mutate(avatar);
  };

  const showEditForm = () => {
    setShowFormEdit(!showFormEdit);
  };

  const updateProfile = (formEdit) => {
    updateProfileAPI.mutate(formEdit);
  };

  return (
    <div>
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
          <h2>Username: {data.account.username}</h2>
          <p>Email: {data.account.email}</p>
          <p>First Name: {data.firstName}</p>
          <p>Last Name: {data.lastName}</p>
          <p>Followers: {data.followersCount}</p>
          <p>Following: {data.followingCount}</p>
          <p>Bio: {data.bio}</p>
          <p>Phone Number: {data.phoneNumber}</p>
          <p>Location: {data.location}</p>
          <button onClick={showEditForm}>Edit Profile</button>
          {showFormEdit === true ? (
            <div>
              <label htmlFor="bio">Bio</label>
              <input
                type="text"
                name="bio"
                value={formEdit.bio}
                onChange={handleEdit}
                placeholder="Add bio"
              />
              <label htmlFor="countryCode">Country Code</label>
              <input
                type="phone"
                name="countryCode"
                value={formEdit.countryCode}
                onChange={handleEdit}
                placeholder="Add Country Code"
              />
              <label htmlFor="dob">DOB</label>
              <input
                type="date"
                name="dob"
                value={formEdit.dob}
                onChange={handleEdit}
                placeholder="Add Dob"
              />
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formEdit.firstName}
                onChange={handleEdit}
                placeholder="First Name"
              />
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formEdit.lastName}
                onChange={handleEdit}
                placeholder="Last Name"
              />
              <label htmlFor="location">Location</label>
              <input
                type="text"
                name="location"
                value={formEdit.location}
                onChange={handleEdit}
                placeholder="Location"
              />
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="phone"
                name="phoneNumber"
                value={formEdit.phoneNumber}
                onChange={handleEdit}
                placeholder="Phone Number"
              />
              <button onClick={() => updateProfile(formEdit)}>
                Update Profile
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Profile;
