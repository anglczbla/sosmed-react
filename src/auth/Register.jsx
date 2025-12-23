import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, Mail, Rocket, User, UserPlus } from "lucide-react";
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
  const [globalError, setGlobalError] = useState("");
  console.log(validationErrors);

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
      const message = error.response.data.message;
      const errors = error.response?.data?.errors;

      if (errors && Array.isArray(errors)) {
        const newErrors = {};
        errors.forEach((err) => {
          Object.keys(err).forEach((key) => {
            newErrors[key] = err[key];
          });
        });
        setValidationErrors(newErrors);
      }
      if (message) {
        setGlobalError(message);
      }
    },
  });

  const submitForm = (e) => {
    e.preventDefault();
    registrasi.mutate(formRegist);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4 font-sans">
      <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] w-full max-w-md border border-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -mr-16 -mt-16 z-0"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="bg-gray-900 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-gray-100 -rotate-6">
              <Rocket size={32} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              Join us!
            </h1>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
              Start your journey today
            </p>
          </div>

          {globalError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold">
              {globalError}
            </div>
          )}

          <form onSubmit={submitForm} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formRegist.email}
                  placeholder="name@vibe.com"
                  onChange={handleChangeForm}
                  className={`w-full pl-12 pr-6 py-4 rounded-2xl border-2 ${
                    validationErrors.email
                      ? "border-red-100 bg-red-50/30"
                      : "border-transparent bg-gray-50 focus:border-violet-200 focus:bg-white"
                  } outline-none font-bold text-gray-700 placeholder:text-gray-300 transition-all`}
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-[10px] font-black uppercase ml-2 tracking-wider">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="username"
                  type="text"
                  value={formRegist.username}
                  placeholder="cool_human"
                  onChange={handleChangeForm}
                  className={`w-full pl-12 pr-6 py-4 rounded-2xl border-2 ${
                    validationErrors.username
                      ? "border-red-100 bg-red-50/30"
                      : "border-transparent bg-gray-50 focus:border-violet-200 focus:bg-white"
                  } outline-none font-bold text-gray-700 placeholder:text-gray-300 transition-all`}
                />
              </div>
              {validationErrors.username && (
                <p className="text-red-500 text-[10px] font-black uppercase ml-2 tracking-wider">
                  {validationErrors.username}
                </p>
              )}
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formRegist.password}
                  placeholder="At least 8 vibes long"
                  onChange={handleChangeForm}
                  className={`w-full pl-12 pr-14 py-4 rounded-2xl border-2 ${
                    validationErrors.password
                      ? "border-red-100 bg-red-50/30"
                      : "border-transparent bg-gray-50 focus:border-violet-200 focus:bg-white"
                  } outline-none font-bold text-gray-700 placeholder:text-gray-300 transition-all`}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-[10px] font-black uppercase ml-2 tracking-wider">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={registrasi.isPending}
              className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-gray-200 hover:bg-violet-600 hover:shadow-violet-200 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
            >
              {registrasi.isPending ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <UserPlus size={20} />
                </>
              )}
            </button>

            <div className="text-center mt-8">
              <p className="text-gray-400 font-bold text-sm">
                Already part of the community?{" "}
                <button
                  type="button"
                  onClick={toggleLogin}
                  className="text-violet-600 font-black hover:text-violet-700 transition-all ml-1"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
