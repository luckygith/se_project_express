const { Joi, celebrate } = require("celebrate");
const { object, custom } = require("joi");
const validator = require("validator");

// validation for URL as built in url() is not strict

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};
// In Joi, HELPERS provide additional customization and flexibility when
// defining validation rules. They are often used inside .message(), .custom(),
// or advanced validation methods.

// validation functions for spec input bodies

const validateClothingItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The 'imageUrl' field must be filled',
      "string.uri" : 'The 'imageUrl' field must be a valid url',
    }),
  }),
});





const validateUserInfoBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().url().custom(validateURL).messages({
      "string.empty": 'The 'imageUrl' field must be filled',
      "string.uri" : 'The 'imageUrl' field must be a valid url',
    }),
    email: Joi.string().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email field must be a valid email',
    }),

    password: Joi.string().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateUserLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email field must be a valid email',
    }),

    password: Joi.string().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateUserItemId = celebrate({
  body: Joi.object().keys({
    id: Joi.length(24).hex(), // length is explicitly 24 / only hexadecimal characters (0-9, a-f) are allowed
  }),
});


  "string.min": "The minimum length of the 'name' field is 2 characters"
      "string.max" : "The maximum length of the 'name' field is 30"