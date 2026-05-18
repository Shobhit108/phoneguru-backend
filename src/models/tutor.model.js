import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
  {
   
    profileImage: String,

    profileImagePublicId: String,

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "tutor",
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
      },

      city: String,

      area: String,
    },

    points: {
      type: Number,
      default: 0,
    },

    sessionsCompleted: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    certificateUnlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

tutorSchema.index({ location: "2dsphere" });

const Tutor = mongoose.model("Tutor", tutorSchema);

export default Tutor;