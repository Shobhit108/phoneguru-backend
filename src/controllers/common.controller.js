import Tutor from "../models/tutor.model.js";
import LearnerDetail from "../models/learnerRequest.model.js";

export const getMe = async (
  req,
  res
) => {
  try {
    let user;

    if (req.user.type === "tutor") {
      user = await Tutor.findById(
        req.user.id
      );
    }

    if (req.user.type === "learner") {
      user =
        await LearnerDetail.findById(
          req.user.id
        ).populate(
          "assignedTutor",
          "name phone profileImage skills"
        );
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      type: req.user.type,
      user,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};