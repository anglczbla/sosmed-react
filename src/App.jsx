import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./auth/Login";
import Register from "./auth/Register";
import CreatePost from "./components/CreatePost";
import GuestRoute from "./components/GuestRoute";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ProfileUser from "./components/ProfileUser";
import ProtectedNavbar from "./components/ProtectedNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";

function App() {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<ProtectedNavbar />}>
              <Route path="/" element={<Home />} />
              <Route path="/user-profile/:username" element={<ProfileUser />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-post" element={<CreatePost />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
