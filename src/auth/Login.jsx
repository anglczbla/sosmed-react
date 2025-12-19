import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    navigate("/");
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
      alert("login success");
      const { accessToken, user } = data.data.data;
      console.log("isi data", data);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      queryClient.invalidateQueries();

      navigate("/home");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Welcome Back! ✨
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Please login to your account
          </p>
        </div>

        <form onSubmit={submitLogin} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-semibold text-gray-700 ml-1"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formLogin.username}
              placeholder="Enter your username"
              onChange={handleFormLogin}
              className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700 ml-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formLogin.password}
                placeholder="Enter your password"
                onChange={handleFormLogin}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 text-sm font-medium transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {login.isPending ? "Logging in..." : "Login"}
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={toggleRegist}
                className="text-purple-600 font-bold hover:text-purple-700 hover:underline transition-all"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
