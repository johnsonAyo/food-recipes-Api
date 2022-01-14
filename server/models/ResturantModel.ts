import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  address: {
    building: {
      type: String,
      required: [true, 'An address must have a name building number'],
    },
    cord: [{ type: Number }],
    street: { type: String },
    zipcode: { type: String, required: [true, 'A recipe must have a name'] },
  },
});
//    {"address": {"building": "705", "coord": [-73.9653967, 40.6064339], "street": "Kings Highway", "zipcode": "11223"}, "borough": "Brooklyn", "cuisine": "Jewish/Kosher", "grades": [{"date": {"$date": 1415577600000}, "grade": "A", "score": 11}, {"date": {"$date": 1381363200000}, "grade": "A", "score": 13}, {"date": {"$date": 1349308800000}, "grade": "A", "score": 7}, {"date": {"$date": 1337558400000}, "grade": "A", "score": 9}, {"date": {"$date": 1325203200000}, "grade": "B", "score": 19}], "name": "Seuda Foods", "restaurant_id": "40360045"},

const Restaurant = mongoose.model('Resturant', restaurantSchema);

module.exports = Recipe;
