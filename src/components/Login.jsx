import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Helper from "../hooks/helper";

const Login = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showPassword, toggleShowPassword } = Helper();
  const [formLogin, setFormLogin] = useState({
    username: "",
    password: "",
  });
  const [showRegist, setShowRegist] = useState(null);

  const toggleRegist = () => {
    setShowRegist(!showRegist);
  };

  toggleRegist ? navigate("/") : null;

  const handleFormLogin = (e) => {
    const { name, value } = e.target;
    setFormLogin({ ...formLogin, [name]: value });
  };

  const login = useMutation({
    mutationFn: (login) => {
      return axios.post("https://api.freeapi.app/api/v1/users/login", login);
    },
    onSuccess: (data) => {
      alert("login success");
      const { accessToken, user } = data.data;
      console.log("isi", accessToken, user);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      queryClient.invalidateQueries({ queryKey: ["login"] });
      navigate("/home");
      setFormLogin({
        username: "",
        password: "",
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const submitLogin = (e) => {
    e.preventDefault();
    login.mutate(formLogin);
  };

  return (
    <div>
      <h2>Form Login</h2>
      <form onSubmit={submitLogin}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={formLogin.username}
          placeholder="input username"
          onChange={handleFormLogin}
        />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formLogin.password}
          placeholder="input password"
          onChange={handleFormLogin}
        />
        <button onClick={toggleShowPassword}>
          {showPassword ? "Hide" : "Show"}
        </button>
        <button type="submit">Login</button>
        <button onClick={toggleRegist}>Not Registed?</button>
      </form>
    </div>
  );
};

export default Login;
