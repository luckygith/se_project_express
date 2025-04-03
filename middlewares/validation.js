const { Joi, celebrate } = require("celebrate");
const { object } = require("joi");
const validator = require("validator");

const validateClothingItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().url(),
  }),
});

const validateUserInfoBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().url(),
    email: Joi.string().email(),
    password: Joi.string(),
  }),
});

const validateUserLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string();
  }),
});

const validateUserItemId = celebrate({
  body: Joi.object().keys({
    id: Joi.length(24).hex(), // length is explicitly 24 / only hexadecimal characters (0-9, a-f) are allowed
  })
})

