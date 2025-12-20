import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./auth/Login";
import Register from "./auth/Register";
import CreatePost from "./components/CreatePost";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ProfileUser from "./components/ProfileUser";
import AuthProvider from "./context/AuthContext";
import GuestRoute from "./route/GuestRoute";
import ProtectedNavbar from "./route/ProtectedNavbar";
import ProtectedRoute from "./route/ProtectedRoute";

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
