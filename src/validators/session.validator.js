import Joi from "joi";

export const scheduleSessionSchema = Joi.object({

  sessionId: Joi.string().required(),

  scheduledDate: Joi.date().required(),

  scheduledTime: Joi.string().required(),

});

export const updateSessionStatusSchema = Joi.object({

  sessionId: Joi.string().required(),

  status: Joi.string()
    .valid(
      "PENDING",
      "ACCEPTED",
      "SCHEDULED",
      "ONGOING",
      "COMPLETED",
      "CANCELLED"
    )
    .required(),

});