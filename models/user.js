// const Joi = require('joi');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const config = require('config');

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required : true,
//         minLenght: 5,
//         maxLenght:255
//     },
//     email: {
//         type: String,
//         unique: true,
//         minLenght: 5,
//         maxLenght: 255,
//         required: true
//     },
//     phoneNumber: {
//         type: String,
//         required: true,
//         minLenght: 5,
//         maxLenght: 11
//     },
//     password: {
//         type: String,
//         required: true,
//         minLenght: 5,
//         maxLenght: 1024
//     },

//     // isDistributor: Boolean,
//     // isSuperAdmin: Boolean

//      isDistributor: {
//     type: Boolean,
//     // default: false
//     },
//     isSuperAdmin: {
//         type: Boolean,
//         // default: false
//   }

// })

// userSchema.methods.generateAuthToken = function() {
// const token = jwt.sign({ _id: this._id, isDistributor: this.isDistributor, isSuperAdmin: this.isSuperAdmin }, config.get('jwtPrivateKey'));
// return token;
// }


// const User = mongoose.model('User', userSchema);

// function validateUser(user) {
//     const schema = Joi.object({
//         name: Joi.string().min(5).max(255).required(),
//         email: Joi.string().min(5).max(255).required().email(),
//         phoneNumber: Joi.string().min(5).max(11).required(),
//         password: Joi.string().min(5).max(1024).required(),
//         confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
//         // isDistributor: Joi.forbidden(),
//         //  isSuperAdmin: Joi.forbidden()
        
//   });

//     return schema.validate(user)
// };

// // function validateUser(user) {
// //     const schema = {
// //         name: Joi.string().min(5).max(255).required(),
// //         email: Joi.string().min(5).max(255).required().email(),
// //         phoneNumber: Joi.string().min(5).max(11).required(),
// //         password: Joi.string().min(5).max(1024).required()

// //     }
// //     return Joi.validate(user, schema)
// // }

        

// exports.User = User;
// exports.validate = validateUser;


const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const { distributorLocationSchema } = require("./distributorLocation");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 11,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  role: {
    type: String,
    enum: ["super_admin", "distributor", "customer"],
    default: "customer", // default role
  },
  location: {
        type: distributorLocationSchema,
        required: false,
    },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role }, // store role in token
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    phoneNumber: Joi.string().min(5).max(11).required(),
    password: Joi.string().min(5).max(1024).required(),
    locationId: Joi.string(),
     confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().valid("super_admin", "distributor", "customer"),
  };
  return Joi.validate(user, schema);
}

 function validateLogin(req) {
    const schema = Joi.object( {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    
    });
    // return Joi.validate(req, schema);
    return schema.validate(req);
    }

exports.User = User;
exports.validate = validateUser;
exports.validateLogin = validateLogin;