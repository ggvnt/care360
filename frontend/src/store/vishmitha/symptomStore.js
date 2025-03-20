import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

export const useSymptomStore = create((set) => ({
  symptoms: [],
  possibleConditions: [],
  isLoading: false,
  error: "",

  // Fetch Symptoms
  fetchSymptoms: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/admin/symptoms");
      set({ symptoms: res.data });
    } catch (error) {
      set({ error: "Failed to fetch symptoms" });
      toast.error("Failed to fetch symptoms");
    } finally {
      set({ isLoading: false });
    }
  },

  // Submit Symptoms for checking
  checkSymptoms: async (selectedSymptoms) => {
    set({ isLoading: true, error: "" });
    try {
      const response = await axiosInstance.post(
        "/symptom-checker/symptoms/check",
        {
          symptoms: selectedSymptoms,
        }
      );
      console.log("Possible Conditions Response:", response.data); // Log the response
      set({ possibleConditions: response.data.possibleConditions });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching possible conditions";
      console.error(errorMessage); // Log the error message
      set({ error: errorMessage });
      toast.error(errorMessage); // Toast with the error message
    } finally {
      set({ isLoading: false });
    }
  },
}));
