import Recipe from '../models/RecipeModel';
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from './handlerFactory';

const updateRecipe = updateOne(Recipe);
const deleteRecipe = deleteOne(Recipe);
const getAllRecipe = getAll(Recipe);
const getRecipe = getOne(Recipe, "");
const createRecipe = createOne(Recipe);


export {getAllRecipe,createRecipe,updateRecipe,deleteRecipe,getRecipe}