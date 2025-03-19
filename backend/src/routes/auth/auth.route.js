import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
} from "../../contrallers/auth/auth.contraller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);

export default router;
