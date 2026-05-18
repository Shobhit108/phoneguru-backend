import Joi from "joi";

export const learnerSchema =
  Joi.object({
    name: Joi.string().required(),

    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .allow("", null),

    isSelfLearner:
      Joi.boolean().required(),

    requestedBy:
      Joi.object({
        name: Joi.string()
          .allow("", null),

        phone: Joi.string()
          .pattern(
            /^[0-9]{10}$/
          )
          .allow("", null),
      }).optional(),

    learningTopics:
      Joi.array()
        .items(Joi.string())
        .min(1)
        .required(),

    preferredTime:
      Joi.string()
        .valid(
          "morning",
          "noon",
          "evening"
        )
        .required(),

    location:
      Joi.object({
        type: Joi.string()
          .valid("Point")
          .default("Point"),

        coordinates:
          Joi.array()
            .items(Joi.number())
            .length(2)
            .optional(),

        city: Joi.string()
          .allow("", null),

        area: Joi.string()
          .allow("", null),

        pincode:
          Joi.string()
            .allow("", null),
      }).required(),

    otpVerified:
      Joi.boolean().optional(),
  })

  .custom((value, helpers) => {

    // Someone Else
    if (
      !value.isSelfLearner &&
      !value.phone
    ) {
      return helpers.message(
        "Phone number is required"
      );
    }

    return value;
  });