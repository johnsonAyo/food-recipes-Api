import joi from 'joi';

enum Meal_type {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Supper = 'supper',
  Snacks = 'snacks',
}
enum Difficulty_level {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

export const validateEntry = joi.object({
  title: joi.string().required(),
  meal_type: joi
    .string()
    .valid(
      Meal_type.Breakfast,
      Meal_type.Lunch,
      Meal_type.Supper,
      Meal_type.Snacks
    ),
  difficulty_level: joi
    .string()
    .valid(
      Difficulty_level.Beginner,
      Difficulty_level.Intermediate,
      Difficulty_level.Advanced
    ),
  ingredients: joi.array().required(),
  preparation: joi.string().required()
});

export const validateSignUp = joi.object({
  fullname: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

export const validateLogin = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});
