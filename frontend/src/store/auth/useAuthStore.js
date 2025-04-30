import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: JSON.parse(localStorage.getItem("authUser")) || null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    if (localStorage.getItem("authUser")) {
      set({ isCheckingAuth: true });
      try {
        const res = await axiosInstance.get("/auth/check");
        set({ authUser: res.data });
        localStorage.setItem("authUser", JSON.stringify(res.data)); // Persist user
      } catch (error) {
        console.log(
          "Error in checkAuth:",
          error.response ? error.response.data : error
        );
        set({ authUser: null });
        localStorage.removeItem("authUser"); // Clear storage on failure
      } finally {
        set({ isCheckingAuth: false });
      }
    } else {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Account created successfully");
      set({ authUser: res.data });
      localStorage.setItem("authUser", JSON.stringify(res.data)); // Persist user
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      toast.success("Logged in successfully");
      set({ authUser: res.data });
      localStorage.setItem("authUser", JSON.stringify(res.data)); // Persist user
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Credentials");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem("authUser"); // Clear storage
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      if (res?.data) {
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error in updateProfile:", error);
      toast.error(error.response?.data?.message || "Unexpected error occurred");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
