import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTogglePassword from "../hooks/helper";
import apiClient from "../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const { showPassword, toggleShowPassword } = useTogglePassword();
  const [formRegist, setFormRegist] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormRegist({ ...formRegist, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleLogin = () => {
    navigate("/login");
  };

  const registrasi = useMutation({
    mutationFn: (data) => {
      return apiClient.post("users/register", data);
    },
    onSuccess: () => {
      alert("registration success");
      navigate("/login");
      setFormRegist({
        email: "",
        password: "",
        username: "",
      });
      setValidationErrors({});
    },
    onError: (error) => {
      console.error(error);
      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        const newErrors = {};
        errors.forEach((err) => {
          Object.keys(err).forEach((key) => {
            newErrors[key] = err[key];
          });
        });
        setValidationErrors(newErrors);
      } else {
        alert(error.response?.data?.message || "Registration failed");
      }
    },
  });

  const submitForm = (e) => {
    e.preventDefault();
    registrasi.mutate(formRegist);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Create Account 🚀</h1>
          <p className="text-gray-500 mt-2 text-sm">Join us and start your journey</p>
        </div>

        <form onSubmit={submitForm} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">Email</label>
            <input
              type="email"
              name="email"
              value={formRegist.email}
              placeholder="Input an Email"
              onChange={handleChangeForm}
              className={`w-full px-5 py-3 rounded-xl border ${validationErrors.email ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-purple-400'} bg-white/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all outline-none placeholder:text-gray-400`}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs ml-1 font-medium">{validationErrors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="username" className="text-sm font-semibold text-gray-700 ml-1">Username</label>
            <input
              name="username"
              type="text"
              value={formRegist.username}
              placeholder="Input username"
              onChange={handleChangeForm}
              className={`w-full px-5 py-3 rounded-xl border ${validationErrors.username ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-purple-400'} bg-white/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all outline-none placeholder:text-gray-400`}
            />
            {validationErrors.username && (
              <p className="text-red-500 text-xs ml-1 font-medium">{validationErrors.username}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-semibold text-gray-700 ml-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formRegist.password}
                placeholder="Input password"
                onChange={handleChangeForm}
                className={`w-full px-5 py-3 rounded-xl border ${validationErrors.password ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-purple-400'} bg-white/50 focus:bg-white focus:ring-2 focus:border-transparent transition-all outline-none placeholder:text-gray-400`}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 text-sm font-medium transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-red-500 text-xs ml-1 font-medium">{validationErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={registrasi.isPending}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {registrasi.isPending ? "Registering..." : "Register"}
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleLogin}
                className="text-purple-600 font-bold hover:text-purple-700 hover:underline transition-all"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
