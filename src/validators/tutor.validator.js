import Joi from "joi";

export const tutorSchema =
  Joi.object({
    name: Joi.string()
      .trim()
      .required(),

    phone: Joi.string()
      .pattern(
        /^[0-9]{10}$/
      )
      .required(),

    skills:
      Joi.array().items(
        Joi.string()
      ),

    languages:
      Joi.array().items(
        Joi.string()
      ),

    location: Joi.object({
      type: Joi.string()
        .valid("Point")
        .default("Point"),

      coordinates:
        Joi.array()
          .items(
            Joi.number()
          )
          .length(2),

      city:
        Joi.string()
          .allow(""),

      area:
        Joi.string()
          .allow(""),
    }),

    profileImage:
      Joi.string().allow(
        ""
      ),

    experience:
      Joi.number().min(
        0
      ),
  });