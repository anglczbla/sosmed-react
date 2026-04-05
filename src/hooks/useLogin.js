import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/api";
import Helper from "./helper";

const useLogin = () => {
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

  return {
    formLogin,
    showPassword,
    toggleShowPassword,
    handleFormLogin,
    submitLogin,
    toggleRegist,
    isPending: login.isPending,
  };
};

export default useLogin;
