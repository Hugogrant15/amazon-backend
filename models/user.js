
// const Joi = require("joi");
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const config = require("config");
// const { distributorLocationSchema } = require("./distributorLocation");

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 50,
//   },
//   email: {
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 255,
//     unique: true,
//   },
//   phoneNumber: {
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 11,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 1024,
//   },
//   role: {
//     type: String,
//     enum: ["super_admin", "distributor", "customer"],
//     default: "customer", // default role
//   },
//   // location: {
//   //       type: distributorLocationSchema,
//   //       required: false,
//   //   },

//   location: {
//     type: String,
//     required: true,
//   },
// });

// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign(
//     { _id: this._id, role: this.role }, // store role in token
//     config.get("jwtPrivateKey")
//   );
//   return token;
// };

// const User = mongoose.model("User", userSchema);

// function validateUser(user) {
//   const schema = {
//     name: Joi.string().min(5).max(50).required(),
//     email: Joi.string().min(5).max(255).required().email(),
//     phoneNumber: Joi.string().min(5).max(11).required(),
//     password: Joi.string().min(5).max(1024).required(),
//     locationId: Joi.string(),
//     location: Joi.object({   // for CSC API
//       country: Joi.string().optional(),
//       state: Joi.string().optional(),
//       city: Joi.string().optional()
//     }).optional(),
//      confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
//     role: Joi.string().valid("super_admin", "distributor", "customer"),
//   };
//   return Joi.validate(user, schema);
// }

//  function validateLogin(req) {
//     const schema = Joi.object( {
//     email: Joi.string().min(5).max(255).required().email(),
//     password: Joi.string().min(5).max(255).required(),
    
//     });
//     // return Joi.validate(req, schema);
//     return schema.validate(req);
//     }

// exports.User = User;
// exports.validate = validateUser;
// exports.validateLogin = validateLogin;

const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

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
  // location: {
  //   type: String,
  //   required: true,
  // },
country: {
    type: String,
    required: false
  },
  state: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  lastSeen: {
    type: Number,
    default: Date.now()
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role, country: this.country, state: this.state, city: this.city }, // store role in token
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

// ✅ Joi Validation
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    phoneNumber: Joi.string().min(5).max(11).required(),
    password: Joi.string().min(5).max(1024).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    role: Joi.string().valid("super_admin", "distributor", "customer"),
    // location: Joi.string().optional(), // when using CSC
    // locationId: Joi.string().optional(), // when using DB location
    country: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    lastSeen: Joi.number()
  });

  return schema.validate(user);
}

function validateLogin(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}

exports.User = User;
exports.validate = validateUser;
exports.validateLogin = validateLogin;
