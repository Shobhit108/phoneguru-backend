import jwt from "jsonwebtoken";

import LearnerDetail from "../models/learnerRequest.model.js";

import { sendOtpService, verifyOtpService } from "../services/otp.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Session from "../models/session.model.js";

const cookieOptions = {
  httpOnly: true,

  secure:
    process.env.NODE_ENV ===
    "production",

  sameSite:
    process.env.NODE_ENV ===
    "production"
      ? "none"
      : "lax",

  path: "/",

  maxAge:
    7 *
    24 *
    60 *
    60 *
    1000,
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

  // CHECK EXISTING LEARNER
  const existingLearner = await LearnerDetail.findOne({
    phone,
  });

  // IF ALREADY EXISTS
  if (existingLearner) {
    const token = jwt.sign(
      {
        id: existingLearner._id,
        phone,
        type: "learner",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

   res.cookie(
  "token",
  token,
  cookieOptions
);
    return res.status(200).json({
      success: true,
      message: "Login successful",

      isProfileComplete: true,

      learner: existingLearner,
    });
  }

  // NEW USER
  const token = jwt.sign(
    {
      phone,
      type: "learner",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

 res.cookie(
  "token",
  token,
  cookieOptions
);
  return res.status(200).json({
    success: true,
    message: "OTP verified",
    isProfileComplete: false,
  });
});

export const createLearnerDetail = asyncHandler(async (req, res) => {
  // phone from logged in user
  req.body.phone = req.user.phone;

  const learner = await LearnerDetail.create(req.body);

  return res.status(201).json({
    success: true,
    learner,
  });
});

export const getLearnerDashboard = asyncHandler(async (req, res) => {
  const currentLearner = await LearnerDetail.findOne({
    phone: req.user.phone,
  })
    .populate("assignedTutor", "name phone skills")
    .sort({
      createdAt: 1,
    });

  if (!currentLearner) {
    throw new ApiError(404, "Learner not found");
  }

  const requests = await LearnerDetail.find({
    phone: currentLearner.phone,
  })
    .populate("assignedTutor", "name phone skills")
    .sort({
      createdAt: -1,
    });

  const dashboardOwner = currentLearner;

  const learnerIds = requests.map((item) => item._id);

  const sessions = await Session.find({
    learner: {
      $in: learnerIds,
    },
  })
    .populate("tutor", "name phone")
    .sort({
      createdAt: -1,
    });

  return res.status(200).json({
    success: true,

    dashboardOwner,

    requests,

    sessions,
  });
});

export const logout = asyncHandler(async (req, res) => {
 res.clearCookie("token", {
  httpOnly: true,

  secure:
    process.env.NODE_ENV ===
    "production",

  sameSite:
    process.env.NODE_ENV ===
    "production"
      ? "none"
      : "lax",

  path: "/",
});

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
