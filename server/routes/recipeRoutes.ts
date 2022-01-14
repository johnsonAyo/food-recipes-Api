import express  from 'express';
import{deleteRecipe,updateRecipe,createRecipe,getAllRecipe, getRecipe} from './../controllers/recipeController';
const authController = require('./../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);
      
router
  .route('/')
  .get(getAllRecipe)
  .post(createRecipe);

router
  .route('/:id')
  .get(getRecipe)
  .patch(updateRecipe)
  .delete(deleteRecipe);


export default  router;
