// const Joi = require('joi');
// const { required } = require('joi/lib/types/lazy');
// const mongoose = require('mongoose');

// // 🧹 Clean up any previous misnamed model
// try {
//   mongoose.deleteModel('Catergory');
// } catch (e) {
//   // ignore if it doesn't exist
// }


// const categorySchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required : true,
//         minLenght: 5,
//         maxLenght: 50
//     },  
//     image: {
//         type: String,
//         required: true
//     }

// })


// const Category = mongoose.model('Category', categorySchema);

// function validateCategory(category) {
//     const schema = {
//         name: Joi.string().min(5).max(50).required(),
//         image: Joi.string().required()
//     }
//     return Joi.validate(category, schema)
// }


// exports.Category = Category;
// exports.validate = validateCategory;
// exports.categorySchema = categorySchema;

const Joi = require('joi');
const mongoose = require('mongoose');

// 🧹 Clean up any old cached model
try {
  mongoose.deleteModel('Catrgory');
} catch (e) {
  // ignore if not found
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },
    image: {
      type: String,
      required: true
    }
  },
  { collection: 'categories' } // 👈 Force the correct collection name
);

// ✅ Force correct collection name and model name
const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    image: Joi.string().required()
  });

  return schema.validate(category);
}

exports.Category = Category;
exports.validate = validateCategory;
exports.categorySchema = categorySchema;
