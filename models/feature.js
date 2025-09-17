const Joi = require('joi');
const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        minLenght: 5,
        maxLenght: 50
    },

    image: {
        type: String,
        required : true,
    },

    price: {
        type: String,
        required : true
    },

    description: {
        type: String,
        required : true,
        minLenght: 10,
        maxLenght: 500
    },

    rating: {
        type: String,
        default: false
    },

    numberInStock:{
        type: Number,
        min: 0,
        max: 1000,
        required: true
    },


})

const Feature = mongoose.model('Feature', featureSchema);

function validateFeature(feature) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        image: Joi.string().required(),
        price: Joi.string().required(),
        description: Joi.string().min(10).max(500).required(),
        rating: Joi.string(),
        numberInStock: Joi.number().min(0).max(1000).required()
    }
    return Joi.validate(feature, schema)
}


exports.Feature = Feature;
exports.validate = validateFeature;
