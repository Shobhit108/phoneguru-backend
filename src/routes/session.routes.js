import express from "express";
import {acceptRequest, scheduleSession,updateSessionStatus,getAllSessions,getSessionHistory,getUpcomingSessions,getTodaySessions,rateTutor} from "../controllers/session.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { scheduleSessionSchema , updateSessionStatusSchema } from "../validators/session.validator.js";
const router = express.Router();

router.post("/accept-request",authMiddleware,allowRoles("tutor"),acceptRequest,);
router.patch("/schedule-session",authMiddleware,allowRoles("tutor"),validate(scheduleSessionSchema),scheduleSession,);
router.patch("/update-status",authMiddleware,allowRoles("tutor"),validate(updateSessionStatusSchema),updateSessionStatus,);
router.get("/all-sessions", authMiddleware, allowRoles("tutor"), getAllSessions);
router.get("/upcoming",authMiddleware,allowRoles("tutor"),getUpcomingSessions);
router.get("/today",authMiddleware,allowRoles("tutor"),getTodaySessions);
router.get("/history",authMiddleware,allowRoles("tutor"),getSessionHistory);
router.post("/rate",authMiddleware,allowRoles('learner'),rateTutor)
export default router;
