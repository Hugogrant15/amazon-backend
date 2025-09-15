const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    // profilePicture: {
    //     type: String, 
    //     default: "",
    //     required: true
    // },
    firstName: {
        type: String,
        required : true,
        minLenght: 5,
        maxLenght: 50,
        trim:true
    },
    lastName: {
        type: String,
        required : true,
        minLenght: 5,
        maxLenght: 50,
        trim: true
    },

    email: {
        type: String,
        unique:true,
        lowercase: true,
        required : true,
        minLenght: 5,
        maxLenght: 50
    },

    phone: {
        type: String,
        required: true,
        minLenght: 5,
        maxLenght: 11
        
    },
   
    dateOfBirth: {
        type: String,
        required : true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"], default: "Other" 
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
    },
    
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    }

})

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = {
        profilePicture: Joi.string().uri().allow("", null).required(),
        firstName: Joi.string().trim().min(5).max(50).required(),
        lastName:Joi.string().trim().min(5).max(50).required(),
        email: Joi.string().email().lowercase().min(5).max(50).required(),
        phone: Joi.string().min(5).max(11).required(),
        dateOfBirth: Joi.string().required(),
        gender: Joi.string().valid("Male", "Female", "Other").default("Other"),
        country: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        address: Joi.string().required()
    }
    return Joi.validate(customer, schema)
}

exports.Customer = Customer;
exports.validate = validateCustomer;
