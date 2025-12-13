import { useState } from "react";

const Helper = () => {
  const [showPassword, setShowPassword] = useState(null);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return { showPassword, toggleShowPassword };
};

export default Helper;
