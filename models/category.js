const Joi = require('joi');
const { required } = require('joi/lib/types/lazy');
const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        minLenght: 5,
        maxLenght: 50
    },  
    image: {
        type: String,
        required: true
    }

})


const Category = mongoose.model('Catrgory', categorySchema);

function validateCategory(category) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        image: Joi.string().required()
    }
    return Joi.validate(category, schema)
}


exports.Category = Category;
exports.validate = validateCategory;
exports.categorySchema = categorySchema;