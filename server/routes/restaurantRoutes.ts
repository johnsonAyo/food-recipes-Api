import express from 'express';
const restaurantController = require('./../controllers/restaurantController');
const router = express.Router();

router.route('/').get(restaurantController.getRestaurantStats);

export default router;
                