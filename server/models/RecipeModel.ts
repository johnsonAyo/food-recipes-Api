import mongoose from 'mongoose';
// import User from '../models/UserModel';

const recipeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },

    title: {
      type: String,
      required: [true, 'A recipe must have a name'],
      trim: true,
      unique:false
    },
    meal_type: {
      type: String,
      required: [true, 'A recipe must have a meal type'],
      enum: {
        values: ['breakfast', 'lunch', 'supper', 'snacks'],
        message: 'Meal type is either: breakfast, lunch, supper,snacks',
      },
    },
    difficulty_level: {
      type: String,
      required: [true, 'A recipe must have a difficulty level'],
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: 'Difficulty is either: beginner, intermediate, advanced',
      },
    },
    ingredients: {
      type: [Object],
      required: [true, 'A recipe must have a list of ingredients'],
    },
    preparation: {
      type: String,
      required: [true, 'A recipe must have a preparation description'],
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
