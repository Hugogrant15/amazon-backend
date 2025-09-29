const Joi = require('joi');
const mongoose = require('mongoose');

const distributorLocationSchema = new mongoose.Schema({
  
    location: {
        type: String,
        required: true   
    },

})

const Location = mongoose.model('Location', distributorLocationSchema);

function validateLocation(location) {
    const schema = {
        location: Joi.string().required()
    }
    return Joi.validate(location, schema)
}


exports.Location = Location;
exports.validate = validateLocation;
exports.distributorLocationSchema = distributorLocationSchema