import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Camera,
  Edit,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Sparkles,
  Users,
  X,
} from "lucide-react";
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

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse">
          Loading your profile...
        </p>
      </div>
    );

  if (isError)
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-red-50 text-red-500 p-8 rounded-[2.5rem] border border-red-100 inline-block">
          <p className="font-black text-lg mb-2">Error fetching profile 😭</p>
          <p className="text-sm opacity-70">{error.message}</p>
        </div>
      </div>
    );

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

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 space-y-10">
      {data && (
        <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
          {/* Cover Banner */}
          <div className="h-48 bg-[#FAF9F6] relative">
            <div className="absolute top-6 right-8 flex gap-3">
              <button
                onClick={showEditFormHandler}
                className="p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm text-gray-700 hover:bg-violet-600 hover:text-white transition-all"
              >
                <Edit size={20} />
              </button>
            </div>
          </div>

          {/* Profile Header */}
          <div className="px-10 pb-10">
            <div className="relative flex flex-col md:flex-row justify-between items-end md:items-center -mt-16 mb-8 gap-6">
              <div className="relative group">
                <img
                  src={
                    data.account.avatar?.url ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                      data.account.username
                  }
                  alt={data.account.username}
                  className="w-40 h-40 rounded-[2.5rem] border-[6px] border-white shadow-xl object-cover bg-violet-50 group-hover:brightness-90 transition-all"
                />
                <button
                  onClick={toggleAvatar}
                  className="absolute bottom-2 right-2 bg-gray-900 p-3 rounded-2xl shadow-lg text-white hover:bg-violet-600 transition-all active:scale-90"
                >
                  <Camera size={20} />
                </button>
              </div>

              <div className="flex gap-4 md:pt-12">
                <button
                  onClick={toggleFollowers}
                  className={`flex flex-col items-center px-8 py-4 rounded-3xl transition-all ${
                    showFollowers
                      ? "bg-violet-600 text-white"
                      : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-2xl font-black">
                    {data.followersCount}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      showFollowers ? "opacity-80" : "text-gray-400"
                    }`}
                  >
                    Followers
                  </span>
                </button>
                <button
                  onClick={toggleFollowing}
                  className={`flex flex-col items-center px-8 py-4 rounded-3xl transition-all ${
                    showFollowing
                      ? "bg-violet-600 text-white"
                      : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-2xl font-black">
                    {data.followingCount}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      showFollowing ? "opacity-80" : "text-gray-400"
                    }`}
                  >
                    Following
                  </span>
                </button>
              </div>
            </div>

            {/* Avatar Update Form Inline */}
            {showFormAvatar && (
              <div className="mb-10 p-6 bg-violet-50/50 rounded-[2rem] border border-violet-100 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-violet-900 uppercase tracking-widest">
                    Update Profile Picture
                  </h3>
                  <button
                    onClick={toggleAvatar}
                    className="text-violet-400 hover:text-violet-600"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="file"
                    onChange={handleAvatar}
                    accept="image/*"
                    className="flex-1 text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-violet-600 file:text-white hover:file:bg-violet-700 cursor-pointer"
                  />
                  <button
                    onClick={() => updateNewAvatar(newAvatar)}
                    disabled={!newAvatar || updateAvatar.isPending}
                    className="px-8 py-3 bg-white text-violet-600 border-2 border-violet-100 rounded-xl text-sm font-black hover:bg-violet-50 transition-all disabled:opacity-50"
                  >
                    {updateAvatar.isPending ? "Uploading..." : "Save Picture"}
                  </button>
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                  {data.firstName} {data.lastName}
                </h1>
                <Sparkles size={24} className="text-violet-400" />
              </div>
              <p className="text-xl text-violet-600 font-black mb-6">
                @{data.account.username}
              </p>

              {data.bio ? (
                <div className="p-6 bg-[#FAF9F6] rounded-[2rem] border border-gray-100 relative">
                  <p className="text-gray-700 leading-relaxed font-medium italic">
                    "{data.bio}"
                  </p>
                </div>
              ) : (
                <button
                  onClick={showEditFormHandler}
                  className="text-gray-400 font-bold hover:text-violet-500 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} /> Add a bio to express yourself
                </button>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 border-t border-gray-50">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-violet-50 transition-all">
                  <Mail
                    size={20}
                    className="text-gray-400 group-hover:text-violet-500"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Email Address
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {data.account.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-violet-50 transition-all">
                  <MapPin
                    size={20}
                    className="text-gray-400 group-hover:text-violet-500"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Based in
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {data.location || "Earth"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-violet-50 transition-all">
                  <Phone
                    size={20}
                    className="text-gray-400 group-hover:text-violet-500"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Phone
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {data.countryCode ? `(${data.countryCode}) ` : ""}
                    {data.phoneNumber || "Not shared"}
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Profile Form Overlay */}
            {showFormEdit === true && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md">
                <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                      Update Vibe ✨
                    </h2>
                    <button
                      onClick={showEditFormHandler}
                      className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 transition-all"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                            <input
                                              type="text"
                                              name="firstName"
                                              value={formEdit.firstName}
                                              onChange={handleEdit}
                                              className={`w-full px-6 py-4 rounded-2xl border-2 ${getValidationErrors(updateProfileAPI.error).firstName ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50'} focus:border-violet-200 focus:bg-white outline-none font-bold transition-all`}
                                            />
                                            {getValidationErrors(updateProfileAPI.error).firstName && (
                                              <p className="text-xs text-red-500 font-black ml-1 uppercase tracking-wider">{getValidationErrors(updateProfileAPI.error).firstName}</p>
                                            )}
                                          </div>
                                          <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                            <input
                                              type="text"
                                              name="lastName"
                                              value={formEdit.lastName}
                                              onChange={handleEdit}
                                              className={`w-full px-6 py-4 rounded-2xl border-2 ${getValidationErrors(updateProfileAPI.error).lastName ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50'} focus:border-violet-200 focus:bg-white outline-none font-bold transition-all`}
                                            />
                                            {getValidationErrors(updateProfileAPI.error).lastName && (
                                              <p className="text-xs text-red-500 font-black ml-1 uppercase tracking-wider">{getValidationErrors(updateProfileAPI.error).lastName}</p>
                                            )}
                                          </div>
                                        </div>
                    
                                        <div className="space-y-2">
                                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">About you</label>
                                          <textarea
                                            name="bio"
                                            value={formEdit.bio}
                                            onChange={handleEdit}
                                            className={`w-full px-6 py-4 rounded-2xl border-2 ${getValidationErrors(updateProfileAPI.error).bio ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50'} focus:border-violet-200 focus:bg-white outline-none font-bold h-32 resize-none transition-all`}
                                            placeholder="Tell the world who you are..."
                                          />
                                          {getValidationErrors(updateProfileAPI.error).bio && (
                                            <p className="text-xs text-red-500 font-black ml-1 uppercase tracking-wider">{getValidationErrors(updateProfileAPI.error).bio}</p>
                                          )}
                                        </div>
                    
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                                            <input
                                              type="text"
                                              name="location"
                                              value={formEdit.location}
                                              onChange={handleEdit}
                                              className={`w-full px-6 py-4 rounded-2xl border-2 ${getValidationErrors(updateProfileAPI.error).location ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50'} focus:border-violet-200 focus:bg-white outline-none font-bold transition-all`}
                                            />
                                            {getValidationErrors(updateProfileAPI.error).location && (
                                              <p className="text-xs text-red-500 font-black ml-1 uppercase tracking-wider">{getValidationErrors(updateProfileAPI.error).location}</p>
                                            )}
                                          </div>
                                          <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Birthday</label>
                                            <input
                                              type="date"
                                              name="dob"
                                              value={formEdit.dob}
                                              onChange={handleEdit}
                                              className={`w-full px-6 py-4 rounded-2xl border-2 ${getValidationErrors(updateProfileAPI.error).dob ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50'} focus:border-violet-200 focus:bg-white outline-none font-bold transition-all`}
                                            />
                                            {getValidationErrors(updateProfileAPI.error).dob && (
                                              <p className="text-xs text-red-500 font-black ml-1 uppercase tracking-wider">{getValidationErrors(updateProfileAPI.error).dob}</p>
                                            )}
                                          </div>
                                        </div>
                    
                                        <div className="grid grid-cols-3 gap-6">
                                          <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Code</label>
                                            <input
                                              type="text"
                                              name="countryCode"
                                              value={formEdit.countryCode}
                                              onChange={handleEdit}
                                              className={`w-full px-6 py-4 rounded-2xl border-2 ${getValidationErrors(updateProfileAPI.error).countryCode ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50'} focus:border-violet-200 focus:bg-white outline-none font-bold transition-all`}
                                              placeholder="+62"
                                            />
                                            {getValidationErrors(updateProfileAPI.error).countryCode && (
                                              <p className="text-xs text-red-500 font-black ml-1 uppercase tracking-wider">{getValidationErrors(updateProfileAPI.error).countryCode}</p>
                                            )}
                                          </div>
                                          <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                            <input
                                              type="text"
                                              name="phoneNumber"
                                              value={formEdit.phoneNumber}
                                              onChange={handleEdit}
                                              className={`w-full px-6 py-4 rounded-2xl border-2 ${getValidationErrors(updateProfileAPI.error).phoneNumber ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50'} focus:border-violet-200 focus:bg-white outline-none font-bold transition-all`}
                                            />
                                            {getValidationErrors(updateProfileAPI.error).phoneNumber && (
                                              <p className="text-xs text-red-500 font-black ml-1 uppercase tracking-wider">{getValidationErrors(updateProfileAPI.error).phoneNumber}</p>
                                            )}
                                          </div>
                                        </div>
                    

                    <button
                      onClick={() => updateProfile(formEdit)}
                      disabled={updateProfileAPI.isPending}
                      className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-violet-600 shadow-xl shadow-gray-200 hover:shadow-violet-100 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
                    >
                      {updateProfileAPI.isPending
                        ? "Updating your vibe..."
                        : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Followers/Following Modal-like Lists */}
      {(showFollowers || showFollowing) && (
        <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-10 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500 relative">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              {showFollowers ? (
                <>
                  <Users className="text-violet-600" /> Followers
                </>
              ) : (
                <>
                  <Globe className="text-violet-600" /> Following
                </>
              )}
            </h3>
            <button
              onClick={() => {
                setShowFollowers(false);
                setShowFollowing(false);
              }}
              className="text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {(followersLoading || followingLoading) && (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-3 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
            </div>
          )}

          {showFollowers && followersData?.followers?.length === 0 && (
            <p className="text-gray-400 font-bold italic py-10 text-center">
              No followers yet. Be famous soon!
            </p>
          )}
          {showFollowing && followingData?.following?.length === 0 && (
            <p className="text-gray-400 font-bold italic py-10 text-center">
              Not following anyone. Go explore!
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showFollowers &&
              followersData?.followers?.map((f) => (
                <div
                  key={f._id}
                  className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50 hover:bg-violet-50 transition-all group"
                >
                  <img
                    src={
                      f.avatar?.url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.username}`
                    }
                    alt={f.username}
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="font-black text-gray-900 group-hover:text-violet-600">
                      @{f.username}
                    </p>
                    <p className="text-xs font-bold text-gray-400">
                      {f.profile?.firstName} {f.profile?.lastName}
                    </p>
                  </div>
                </div>
              ))}

            {showFollowing &&
              followingData?.following?.map((f) => (
                <div
                  key={f._id}
                  className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50 hover:bg-violet-50 transition-all group"
                >
                  <img
                    src={
                      f.avatar?.url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.username}`
                    }
                    alt={f.username}
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-black text-gray-900 group-hover:text-violet-600">
                      @{f.username}
                    </p>
                    <p className="text-xs font-bold text-gray-400">
                      {f.profile?.firstName} {f.profile?.lastName}
                    </p>
                  </div>
                  {f.isFollowing && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 bg-white px-3 py-1.5 rounded-full border border-violet-100">
                      Following
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
