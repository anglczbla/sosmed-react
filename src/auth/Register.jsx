import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTogglePassword from "../hooks/helper";

const Register = () => {
  const navigate = useNavigate();
  const { showPassword, toggleShowPassword } = useTogglePassword();
  const [formRegist, setFormRegist] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [showLogin, setShowLogin] = useState(null);

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormRegist({ ...formRegist, [name]: value });
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  if (showLogin === true) {
    navigate("/login");
  }

  const registrasi = useMutation({
    mutationFn: (regist) => {
      return axios.post(
        "https://api.freeapi.app/api/v1/users/register",
        regist
      );
    },
    onSuccess: () => {
      alert("registration success");
      navigate("/login");
      setFormRegist({
        email: "",
        password: "",
        username: "",
      });
    },
    onError: (error) => {
      console.error(error);
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
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={formRegist.password}
          placeholder="Input password"
          onChange={handleChangeForm}
        />
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
        <button type="submit">Register</button>
        <button onClick={toggleLogin}>Already Regist?</button>
      </form>
    </div>
  );
};

export default Register;
