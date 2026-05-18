import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {sendOtp,verifyOtp,createTutorProfile,getNearbyRequests,getTutorDashboard,getLeaderboard,logout,} from "../controllers/tutor.controller.js";
import allowRoles from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import upload from "../middleware/multer.middleware.js";




import { tutorSchema } from "../validators/tutor.validator.js";
const router = express.Router();

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/create-profile",   validate(tutorSchema), createTutorProfile);

router.get( "/nearby-requests",authMiddleware,allowRoles("tutor"),getNearbyRequests);
router.get("/dashboard",authMiddleware,allowRoles("tutor"),getTutorDashboard);
router.get("/leaderboard",getLeaderboard);
router.post("/logout", authMiddleware, logout);
export default router;
