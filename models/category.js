const Joi = require('joi');
const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        minLenght: 5,
        maxLenght: 50
    }

})


const Category = mongoose.model('Catrgory', categorySchema);

function validateCategory(category) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(category, schema)
}


exports.Category = Category;
exports.validate = validateCategory;