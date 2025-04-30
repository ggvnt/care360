import express from "express";
import {
    getAppointment,
    getAllAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getDoctors
} from "../contrallers/user.appoinment.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/get-doctors", getDoctors);
router.get("/", getAllAppointments);
router.get("/:id", getAppointment);
router.post("/create", protectRoute, createAppointment);


router.put("/:id", protectRoute, updateAppointment);
router.delete("/:id", protectRoute, deleteAppointment);

export default router;