import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const Login = () => {
  const queryClient = useQueryClient();
  const [formLogin, setFormLogin] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(null);

  const handleFormLogin = (e) => {
    const { name, value } = e.target;
    setFormLogin({ ...formLogin, [name]: value });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const login = useMutation({
    mutationFn: (login) => {
      return axios.post("https://api.freeapi.app/api/v1/users/login", login);
    },
    onSuccess: () => {
      alert("login success");
      queryClient.invalidateQueries({ queryKey: ["login"] });
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
      </form>
    </div>
  );
};

export default Login;
