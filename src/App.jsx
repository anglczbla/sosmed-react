import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ProtectedNavbar from "./components/ProtectedNavbar";
import Register from "./components/Register";
import AuthProvider from "./context/AuthContext";

function App() {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedNavbar />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
