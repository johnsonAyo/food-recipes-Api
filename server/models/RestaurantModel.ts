import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  address: {
    type: Object,
  },
  borough: { type: String },
  cuisine: { type: String },
  grades: { type: Object },
  name: { type: String },
  restaurant_id: { type: String },
});

const Restaurant = mongoose.model('restaurant', restaurantSchema, 'restaurant');

export default Restaurant;
