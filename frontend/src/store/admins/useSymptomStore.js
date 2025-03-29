import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

export const useSymptomStore = create((set) => ({
  symptoms: [],
  isLoading: false,

  // Fetch Symptoms
  fetchSymptoms: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/admin/symptoms");
      set({ symptoms: res.data });
    } catch (error) {
      toast.error("Failed to fetch symptoms");
    } finally {
      set({ isLoading: false });
    }
  },

  // Add Symptom
  addSymptom: async (newSymptom, conditionList) => {
    if (!newSymptom || conditionList.length === 0) {
      toast.error("Please enter symptom and at least one condition");
      return;
    }

    try {
      const res = await axiosInstance.post("/admin/symptoms/add", {
        name: newSymptom,
        possibleConditions: conditionList,
      });
      set((state) => ({ symptoms: [...state.symptoms, res.data] }));
      toast.success("Symptom added successfully!");
    } catch (error) {
      toast.error("Error adding symptom");
    }
  },

  // Delete Symptom
  deleteSymptom: async (id) => {
    try {
      await axiosInstance.delete(`/admin/symptoms/${id}`);
      set((state) => ({
        symptoms: state.symptoms.filter((symptom) => symptom._id !== id),
      }));
      toast.success("Symptom deleted successfully!");
    } catch (error) {
      toast.error("Error deleting symptom");
    }
  },
}));
