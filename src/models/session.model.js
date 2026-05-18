import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearnerDetail",
      required: true,
    },

    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
    },

    scheduledDate: {
      type: Date,
    },

    scheduledTime: {
      type: String,
    },

    completionOtp: {
      type: String,
    },

   status: {
  type: String,

  enum: [
    "ACCEPTED",
    "SCHEDULED",
    "ONGOING",
    "COMPLETED",
    "CANCELLED",
  ],

  default:
    "ACCEPTED",
},
    notes: {
      type: String,
    },

    completedAt: {
      type: Date,
    },
    rating: {
  type: Number,
},

feedback: {
  type: String,
},
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;