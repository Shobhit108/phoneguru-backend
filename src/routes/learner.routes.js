import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {sendOtp,verifyOtp,createLearnerDetail,getLearnerDashboard,logout,} from "../controllers/learner.controller.js";
import validate from "../middleware/validate.middleware.js";
import { learnerSchema } from "../validators/learner.validator.js";
const router = express.Router();

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/create-request", authMiddleware,validate(learnerSchema),createLearnerDetail);
router.get("/dashboard",authMiddleware,getLearnerDashboard);
router.post("/logout", authMiddleware, logout);

export default router;
