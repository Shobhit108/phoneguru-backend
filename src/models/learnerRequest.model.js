import mongoose from "mongoose";

const learnerDetailSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    type: {
      type: String,
      default: "learner",
    },

    isSelfLearner: {
      type: Boolean,
      required: true,
    },

    requestedBy: {
      name: {
        type: String,
      },

      phone: {
        type: String,
      },
    },

    learningTopics: [
      {
        type: String,
      },
    ],

    preferredTime: {
      type: String,
      enum: ["morning", "noon", "evening"],
    },

    location: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },

  coordinates: {
    type: [Number],
    default: [0, 0],
  },

  city: String,
  area: String,
  pincode: String,
},
    otpVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "ONGOING", "COMPLETED"],
      default: "PENDING",
    },

    assignedTutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
    },
  },
  {
    timestamps: true,
  },
);
learnerDetailSchema.index({
  "location.coordinates": "2dsphere",
});
const LearnerDetail = mongoose.model("LearnerDetail", learnerDetailSchema);

export default LearnerDetail;
