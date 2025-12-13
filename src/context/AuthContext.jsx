import { useQueryClient } from "@tanstack/react-query";
import { createContext } from "react";

export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const value = {};
  return (
    <div>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
