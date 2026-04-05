import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/api";
import useTogglePassword from "./helper";

const useRegister = () => {
  const navigate = useNavigate();
  const { showPassword, toggleShowPassword } = useTogglePassword();
  const [formRegist, setFormRegist] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

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

  return {
    formRegist,
    showPassword,
    toggleShowPassword,
    validationErrors,
    globalError,
    handleChangeForm,
    submitForm,
    toggleLogin,
    isPending: registrasi.isPending,
  };
};

export default useRegister;
