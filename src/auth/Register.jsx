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
    <div>
      <h1>Register</h1>
      <form onSubmit={submitForm}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={formRegist.email}
          placeholder="Input an Email"
          onChange={handleChangeForm}
        />
        {validationErrors.email && (
          <p style={{ color: "red", fontSize: "0.8rem" }}>
            {validationErrors.email}
          </p>
        )}
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={formRegist.password}
          placeholder="Input password"
          onChange={handleChangeForm}
        />
        {validationErrors.password && (
          <p style={{ color: "red", fontSize: "0.8rem" }}>
            {validationErrors.password}
          </p>
        )}
        <button onClick={toggleShowPassword}>
          {showPassword ? "Hide" : "Show"}
        </button>
        <input
          name="username"
          type="text"
          value={formRegist.username}
          placeholder="Input username"
          onChange={handleChangeForm}
        />
        {validationErrors.username && (
          <p style={{ color: "red", fontSize: "0.8rem" }}>
            {validationErrors.username}
          </p>
        )}
        <button type="submit">Register</button>
        <button onClick={toggleLogin}>Already Regist?</button>
      </form>
    </div>
  );
};

export default Register;
