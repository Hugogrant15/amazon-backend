const Joi = require('joi');
const mongoose = require('mongoose');
const {categorySchema} = require('./category')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        minLenght: 5,
        maxLenght: 50
    },
    category: {
    type: categorySchema,
    required: true
  },

    image:{
        type: [String],
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
        min: 1,
        max: 1000,
        required: true
    },

    benefits: {
        type: String,
        required: true
    },

    variety: {
        type: [String],
        required: true
    },

    ingredients: {
        type:[String],
        required: true
    }



})

const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        categoryId:Joi.string().required(),
        image: Joi.array().required(),
        price: Joi.string().required(),
        description: Joi.string().min(10).max(500).required(),
        rating: Joi.string(),
        numberInStock: Joi.number().min(1).max(1000).required(),
        ingredients: Joi.array().required(),
        variety: Joi.array().required(),
        benefits:Joi.string().required()

    }
    return Joi.validate(product, schema)
}


exports.Product = Product;
exports.validate = validateProduct;
