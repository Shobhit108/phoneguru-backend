import Session from "../models/session.model.js";
import LearnerDetail from "../models/learnerRequest.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Tutor from "../models/tutor.model.js";
export const acceptRequest = asyncHandler(async (req, res) => {
  const { learnerId } = req.body;

  const tutorId = req.user.id;

  const learner = await LearnerDetail.findById(learnerId);

  if (!learner) {
    throw new ApiError(404, "Learner not found");
  }

  if (learner.status !== "PENDING") {
    throw new ApiError(400, "Request already accepted");
  }

  learner.status = "ACCEPTED";

  learner.assignedTutor = tutorId;

  await learner.save();

  const session = await Session.create({
    learner: learnerId,
    tutor: tutorId,
    status: "ACCEPTED",
  });

  return res.status(201).json({
    success: true,
    message: "Request accepted successfully",
    session,
  });
});

export const scheduleSession = asyncHandler(async (req, res) => {
  const { sessionId, scheduledDate, scheduledTime } = req.body;

  const currentSession = await Session.findById(sessionId);

  if (!currentSession) {
    throw new ApiError(404, "Session not found");
  }

  const existingSession = await Session.findOne({
    tutor: currentSession.tutor,

    scheduledDate,
    scheduledTime,

    status: {
      $nin: ["CANCELLED", "COMPLETED"],
    },

    _id: {
      $ne: sessionId,
    },
  });

  if (existingSession) {
    throw new ApiError(400, "Tutor already has another session at this time");
  }

  const session = await Session.findByIdAndUpdate(
    sessionId,
    {
      scheduledDate,
      scheduledTime,
      status: "SCHEDULED",
    },
    {
      returnDocument:"after"
    },
  );

  return res.status(200).json({
    success: true,
    message: "Session scheduled successfully",
    session,
  });
});

export const updateSessionStatus = asyncHandler(async (req, res) => {
  const { sessionId, status } = req.body;

  const session = await Session.findById(sessionId);

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  session.status = status;

  await session.save();

  if (status === "ONGOING") {
    await LearnerDetail.findByIdAndUpdate(session.learner, {
      status: "ONGOING",
    });
  }

  if (status === "COMPLETED") {
    await LearnerDetail.findByIdAndUpdate(session.learner, {
      status: "ACCEPTED",
    });
  }

  if (status === "CANCELLED") {
    await LearnerDetail.findByIdAndUpdate(session.learner, {
      status: "PENDING",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Session status updated successfully",
    session,
  });
});

export const getAllSessions = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const sessions = await Session.find()

    .skip(skip)

    .limit(limit)

    .populate("learner", "name phone learningTopics")

    .populate("tutor", "name phone skills");
  const totalSessions = await Session.countDocuments();

  return res.status(200).json({
    success: true,

    currentPage: page,

    totalPages: Math.ceil(totalSessions / limit),

    totalSessions,

    sessions,
  });
});

export const getUpcomingSessions = asyncHandler(async (req, res) => {
  const tutorId = req.user.id;

  const today = new Date();

  const sessions = await Session.find({
    tutor: tutorId,

    $or: [
      // accepted but not scheduled
      {
        status: "ACCEPTED",
      },

      // scheduled future sessions
      {
        scheduledDate: {
          $gte: today,
        },

        status: "SCHEDULED",
      },
    ],
  })
    .populate("learner")
    .sort({
      createdAt: -1,
    });

  return res.status(200).json({
    success: true,
    sessions,
  });
});
export const getTodaySessions = asyncHandler(async (req, res) => {
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

const sessions =
  await Session.find({
    tutor:
      tutorId,

    scheduledDate:
      {
        $gte:
          startOfDay,

        $lt:
          endOfDay,
      },

    status: {
      $in: [
        "SCHEDULED",
        "ONGOING",
      ],
    },
  })
    .populate(
      "learner"
    )
    .sort({
      scheduledTime:
        1,
    });

  return res.status(200).json({
    success: true,
    sessions,
  });
});

export const getSessionHistory = asyncHandler(async (req, res) => {
  const tutorId = req.user.id;

  const sessions = await Session.find({
    tutor: tutorId,
    status: "COMPLETED",
  })
    .populate("learner")
    .sort({ scheduledDate: -1 });

  return res.status(200).json({
    success: true,
    sessions,
  });
});

export const rateTutor = asyncHandler(async (req, res) => {
  const { sessionId, rating, feedback } = req.body;

  const session = await Session.findById(sessionId);

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  if (session.status !== "COMPLETED") {
    throw new ApiError(400, "Only COMPLETED sessions can be rated");
  }

  if (session.rating) {
    throw new ApiError(400, "Session already rated");
  }

  session.rating = rating;

  session.feedback = feedback;

  await session.save();

  await LearnerDetail.findByIdAndUpdate(
  session.learner,
  {
    status:
      "COMPLETED",
  }
);

  const tutor = await Tutor.findById(session.tutor);

  const previousTotal = tutor.rating * tutor.totalRatings;

  tutor.totalRatings += 1;

  tutor.rating = (previousTotal + rating) / tutor.totalRatings;

  tutor.points += 10;

  if (rating === 5) {
    tutor.points += 5;
  }

  if (tutor.points >= 100) {
    tutor.certificateUnlocked = true;
  }

  await tutor.save();

  return res.status(200).json({
    success: true,
    message: "Tutor rated successfully",
  });
});
