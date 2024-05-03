import express from "express";
import {
  loginUser,
  refreshAccessToken,
  logout,
  validateSession,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);
router.get("/validate-session", validateSession);

export default router;
