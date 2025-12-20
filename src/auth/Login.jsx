import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Sparkles } from "lucide-react";
import Helper from "../hooks/helper";
import apiClient from "../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showPassword, toggleShowPassword } = Helper();
  const [formLogin, setFormLogin] = useState({
    username: "",
    password: "",
  });

  const toggleRegist = () => {
    navigate("/register");
  };

  const handleFormLogin = (e) => {
    const { name, value } = e.target;
    setFormLogin({ ...formLogin, [name]: value });
  };

  const login = useMutation({
    mutationFn: (data) => {
      return apiClient.post("users/login", data);
    },
    onSuccess: (data) => {
      const { accessToken, user } = data.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      queryClient.invalidateQueries();
      navigate("/");
      setFormLogin({
        username: "",
        password: "",
      });
    },
    onError: (error) => {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    },
  });

  const submitLogin = (e) => {
    e.preventDefault();
    login.mutate(formLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4 font-sans">
      <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] w-full max-w-md border border-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-full -mr-16 -mt-16 z-0"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="bg-violet-600 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-violet-100 rotate-12 group-hover:rotate-0 transition-transform">
              <Sparkles size={32} fill="currentColor" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
              Join the conversation
            </p>
          </div>

          <form onSubmit={submitLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formLogin.username}
                  placeholder="Your unique handle"
                  onChange={handleFormLogin}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-violet-200 focus:bg-white transition-all outline-none font-bold text-gray-700 placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formLogin.password}
                  placeholder="Keep it secret 🤫"
                  onChange={handleFormLogin}
                  className="w-full pl-12 pr-14 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-violet-200 focus:bg-white transition-all outline-none font-bold text-gray-700 placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-gray-200 hover:bg-violet-600 hover:shadow-violet-200 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
            >
              {login.isPending ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <div className="text-center mt-10">
              <p className="text-gray-400 font-bold text-sm">
                New here?{" "}
                <button
                  type="button"
                  onClick={toggleRegist}
                  className="text-violet-600 font-black hover:text-violet-700 transition-all ml-1"
                >
                  Create an account
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
