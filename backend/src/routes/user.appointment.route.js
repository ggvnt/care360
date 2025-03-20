import express from "express";
import {
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getDoctors
} from "../contrallers/user.appoinment.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/get-doctors", getDoctors);

router.get("/", protectRoute, getAppointment);
router.post("/create", protectRoute, createAppointment);

router.put("/update", updateAppointment);
router.delete("/delete", deleteAppointment);

export default router;
