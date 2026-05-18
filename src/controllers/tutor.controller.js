import jwt from "jsonwebtoken";
import Tutor from "../models/tutor.model.js";
import { sendOtpService, verifyOtpService } from "../services/otp.service.js";
import Session from "../models/session.model.js";
import LearnerDetail from "../models/learnerRequest.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  await sendOtpService(phone);

  return res.status(200).json({
    success: true,
    message: "OTP sent",
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    throw new ApiError(400, "Phone and OTP are required");
  }

  const isValid = await verifyOtpService(otp);

  if (!isValid) {
    throw new ApiError(400, "Invalid OTP");
  }

  const existingTutor = await Tutor.findOne({
    phone,
  });

  // Existing tutor
  if (existingTutor) {
    const token = jwt.sign(
      {
        id: existingTutor._id,

        type: "tutor",
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, cookieOptions);
  }

  return res.status(200).json({
    success: true,

    message: "OTP verified",

    isProfileComplete: !!existingTutor,

    phone,
  });
});

export const createTutorProfile = asyncHandler(async (req, res) => {
  const tutor = await Tutor.create(req.body);

  const token = jwt.sign(
    {
      id: tutor._id,
      type: "tutor",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token, cookieOptions);

  return res.status(201).json({
    success: true,
    tutor,
  });
});

export const getNearbyRequests = asyncHandler(async (req, res) => {
  const { lng, lat } = req.query;

  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  if (!lng || !lat) {
    throw new ApiError(400, "Longitude and latitude required");
  }

  const totalRequests = await LearnerDetail.countDocuments({
    status: "PENDING",
  });

  const nearbyRequests = await LearnerDetail.find({
    status: "PENDING",
  })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    success: true,

    currentPage: page,

    totalPages: Math.ceil(totalRequests / limit),

    totalRequests,

    count: nearbyRequests.length,

    nearbyRequests,
  });
});

export const getTutorDashboard = asyncHandler(async (req, res) => {
  const tutorId = req.user.id;

  const today = new Date();

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );

  const tutor = await Tutor.findById(tutorId);

  const totalSessions = await Session.countDocuments({
    tutor: tutorId,
  });

  const completedSessions = await Session.countDocuments({
    tutor: tutorId,

    status: "COMPLETED",
  });

  const upcomingSessions = await Session.countDocuments({
    tutor: tutorId,

    scheduledDate: {
      $gte: startOfDay,
    },

    status: {
      $in: ["SCHEDULED", "ACCEPTED"],
    },
  });

  const todaySessions = await Session.countDocuments({
    tutor: tutorId,

    scheduledDate: {
      $gte: startOfDay,

      $lt: endOfDay,
    },

    status: {
      $in: ["SCHEDULED", "ONGOING"],
    },
  });

  const pendingLearners = await LearnerDetail.countDocuments({
    status: "PENDING",
  });

  return res.status(200).json({
    success: true,

    dashboard: {
      totalSessions,
      completedSessions,
      upcomingSessions,
      todaySessions,
      pendingLearners,

      name: tutor?.name,

      rating: tutor?.rating || 0,

      totalRatings: tutor?.totalRatings || 0,

      points: tutor?.points || 0,

      certificateUnlocked: tutor?.points >= 100,
    },
  });
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const tutors = await Tutor.find()

    .select("name profileImage rating points certificateUnlocked")

    .sort({ points: -1 })

    .limit(10);

  return res.status(200).json({
    success: true,
    tutors,
  });
});
export const logout = asyncHandler(async (req, res) => {
res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
});

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
