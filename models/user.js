const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        minLenght: 5,
        maxLenght:255
    },
    email: {
        type: String,
        unique: true,
        minLenght: 5,
        maxLenght: 255,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        minLenght: 5,
        maxLenght: 11
    },
    password: {
        type: String,
        required: true,
        minLenght: 5,
        maxLenght: 1024
    },

    isDistributor: Boolean,
    isSuperAdmin: Boolean

})

userSchema.methods.generateAuthToken = function() {
const token = jwt.sign({ _id: this._id, isDistributor: this.isDistributor, isSuperAdmin: this.isSuperAdmin }, config.get('jwtPrivateKey'));
return token;
}


const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        phoneNumber: Joi.string().min(5).max(11).required(),
        password: Joi.string().min(5).max(1024).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
  });

    return schema.validate(user)
};

// function validateUser(user) {
//     const schema = {
//         name: Joi.string().min(5).max(255).required(),
//         email: Joi.string().min(5).max(255).required().email(),
//         phoneNumber: Joi.string().min(5).max(11).required(),
//         password: Joi.string().min(5).max(1024).required()

//     }
//     return Joi.validate(user, schema)
// }

        

exports.User = User;
exports.validate = validateUser;