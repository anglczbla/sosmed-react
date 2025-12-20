import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  User, 
  MapPin, 
  Calendar, 
  Users, 
  Globe, 
  ArrowLeft, 
  Sparkles, 
  Plus, 
  UserMinus, 
  UserPlus,
  MessageCircle,
  Share2,
  X
} from "lucide-react";
import apiClient from "../utils/api";

const ProfileUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { username } = useParams();
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const userString = localStorage.getItem("user");
  const loggedInUser = userString ? JSON.parse(userString) : null;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const response = await apiClient.get(
        `social-media/profile/u/${username}`
      );
      return response.data.data;
    },
  });

  const isOwnProfile =
    loggedInUser &&
    (loggedInUser.username === username ||
      loggedInUser.account?.username === username);

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
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const toggleFollowers = () => {
    setShowFollowers(!showFollowers);
    setShowFollowing(false);
  };

  const toggleFollowing = () => {
    setShowFollowing(!showFollowing);
    setShowFollowers(false);
  };

  const followUser = (idUser) => {
    if (!localStorage.getItem("accessToken")) return navigate("/login");
    followUserAPI.mutate(idUser);
  };

  const unfollowUser = (idUser) => {
    if (!localStorage.getItem("accessToken")) return navigate("/login");
    unfollowUserAPI.mutate(idUser);
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-black animate-pulse">Visiting @{username}...</p>
      </div>
    );
    
  if (isError)
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-red-50 text-red-500 p-8 rounded-[2.5rem] border border-red-100 inline-block font-bold">
          Error loading profile: {error.message} 😭
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 space-y-10">
      <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
        {/* Cover Banner */}
        <div className="h-48 bg-[#FAF9F6] relative">
            <button 
              onClick={() => navigate(-1)}
              className="absolute top-6 left-8 p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm text-gray-700 hover:bg-violet-600 hover:text-white transition-all group flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-black hidden sm:inline">Back</span>
            </button>
        </div>

        {/* Profile Header */}
        <div className="px-10 pb-10">
          <div className="relative flex flex-col md:flex-row justify-between items-end md:items-center -mt-16 mb-8 gap-6">
            <div className="relative">
              <img
                src={data.account.avatar?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.account.username}`}
                alt={data.account.username}
                className="w-40 h-40 rounded-[2.5rem] border-[6px] border-white shadow-xl object-cover bg-violet-50 transition-all"
              />
            </div>

            <div className="flex gap-4 items-center">
                <button
                  onClick={toggleFollowers}
                  className={`flex flex-col items-center px-8 py-4 rounded-3xl transition-all ${showFollowers ? 'bg-violet-600 text-white' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}
                >
                  <span className="text-2xl font-black">{data.followersCount}</span>
                  <span className={`text-xs font-bold uppercase tracking-widest ${showFollowers ? 'opacity-80' : 'text-gray-400'}`}>Followers</span>
                </button>
                <button
                  onClick={toggleFollowing}
                  className={`flex flex-col items-center px-8 py-4 rounded-3xl transition-all ${showFollowing ? 'bg-violet-600 text-white' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}
                >
                  <span className="text-2xl font-black">{data.followingCount}</span>
                  <span className={`text-xs font-bold uppercase tracking-widest ${showFollowing ? 'opacity-80' : 'text-gray-400'}`}>Following</span>
                </button>
            </div>
          </div>

          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                  {data.firstName} {data.lastName}
                </h1>
                {data.isFollowing && <Sparkles size={24} className="text-violet-400" />}
              </div>
              <p className="text-xl text-violet-600 font-black">@{data.account.username}</p>
            </div>

            {!isOwnProfile && (
              <div className="flex gap-3">
                {data.isFollowing ? (
                   <button
                    onClick={() => unfollowUser(data.account._id)}
                    className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl shadow-gray-100 hover:bg-red-500 transition-all group"
                  >
                    <UserMinus size={20} className="group-hover:rotate-12 transition-transform" />
                    <span>Unfollow</span>
                  </button>
                ) : (
                  <button
                    onClick={() => followUser(data.account._id)}
                    className="flex items-center gap-2 px-8 py-4 bg-violet-600 text-white font-black rounded-2xl shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all active:scale-95 group"
                  >
                    <UserPlus size={20} className="group-hover:-rotate-12 transition-transform" />
                    <span>Follow</span>
                  </button>
                )}
                <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl border border-gray-100 hover:bg-violet-50 hover:text-violet-600 transition-all">
                  <Share2 size={20} />
                </button>
              </div>
            )}
          </div>

          {data.bio && (
            <div className="mb-10 p-6 bg-[#FAF9F6] rounded-[2rem] border border-gray-100">
              <p className="text-gray-700 leading-relaxed font-medium italic">
                "{data.bio}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-gray-50">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-violet-50 transition-all">
                  <MapPin size={20} className="text-gray-400 group-hover:text-violet-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Lives in</p>
                  <p className="text-sm font-bold text-gray-700">{data.location || "Undisclosed"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-violet-50 transition-all">
                  <Calendar size={20} className="text-gray-400 group-hover:text-violet-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Birthday</p>
                  <p className="text-sm font-bold text-gray-700">
                    {data.dob ? new Date(data.dob).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : "Classified 🤫"}
                  </p>
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Lists Section */}
      {(showFollowers || showFollowing) && (
        <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-10 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              {showFollowers ? (
                <><Users className="text-violet-600" /> Community</>
              ) : (
                <><Globe className="text-violet-600" /> Exploring</>
              )}
            </h3>
            <button 
              onClick={() => { setShowFollowers(false); setShowFollowing(false); }}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showFollowers && followersData?.followers?.map((f) => (
              <div
                key={f._id}
                className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50 hover:bg-violet-50 transition-all group cursor-pointer"
                onClick={() => {
                  navigate(`/user-profile/${f.username}`);
                  setShowFollowers(false);
                }}
              >
                <img
                  src={f.avatar?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.username}`}
                  alt={f.username}
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                />
                <div>
                  <p className="font-black text-gray-900 group-hover:text-violet-600">@{f.username}</p>
                  <p className="text-xs font-bold text-gray-400">
                    {f.profile?.firstName} {f.profile?.lastName}
                  </p>
                </div>
              </div>
            ))}
            
            {showFollowing && followingData?.following?.map((f) => (
              <div
                key={f._id}
                className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50 hover:bg-violet-50 transition-all group cursor-pointer"
                onClick={() => {
                  navigate(`/user-profile/${f.username}`);
                  setShowFollowing(false);
                }}
              >
                <img
                  src={f.avatar?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.username}`}
                  alt={f.username}
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                />
                <div className="flex-1">
                  <p className="font-black text-gray-900 group-hover:text-violet-600">@{f.username}</p>
                  <p className="text-xs font-bold text-gray-400">
                    {f.profile?.firstName} {f.profile?.lastName}
                  </p>
                </div>
                {f.isFollowing && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 bg-white px-3 py-1.5 rounded-full border border-violet-100">Following</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileUser;
