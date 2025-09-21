const Joi = require('joi');
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  
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

const orderSchema =  new mongoose.Schema({
     customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
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
        orderItemSchema
    ], 

    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },

    paymentStatus: {
        type: String,
        enum:['pending', 'failed', 'paid', 'refunded'],
        default: 'pending',
        deliverySatus: {
            type: String,
            enum:['pending', 'processing', 'delivered', 'shipped', 'cancelled'],

        },
        paymentRefrence: {
            type: String,
            required: false,
        },
        paymentGateway: {
            type: String,
            default: 'paystack'
        },
        transactionId: {
            type: String
        },
         createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }

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