const Joi = require('joi');
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    name: String,
    Image: String,
    price: Number,
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    subTotal: Number
})

const cartSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    customerSnapshot: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        state: String,
        city: String,
        address: String
    },
    items: [
        cartItemSchema
    ], 
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})


cartSchema.pre('save', function(next){
    this.totalAmount = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    next()
})

const Cart = mongoose.model('Cart', cartSchema);

function validateCart(cart) {
    const schema = {
        customerId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        customerSnapshot: Joi.object().keys({
            firstName: Joi.string().min(5).max(50).required(),
            lastName: Joi.string().min(5).max(50).required(),
            email: Joi.string().min(5).max(50).required().email(),
            phone: Joi.string().min(5).max(11).required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            address: Joi.string().required()
        }),
        items: Joi.array().items(
            Joi.object().keys({
            productId:Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            name: Joi.string().required(),
            image: Joi.string().required(),
            price: Joi.number().required(),
            quantity: Joi.number().min(1).required(),
            subTotal: Joi.number().required()
        })
      ).min(1).required(),

      totalAmount: Joi.number(),
      createdAt: Joi.date(),
      updatedAt: Joi.date()
    }
     return Joi.validate(cart, schema) 
}

exports.Cart = Cart;
exports.validate = validateCart;

