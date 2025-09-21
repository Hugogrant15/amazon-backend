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

orderSchema.pre('save', function(next){
    this.totalAmount = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    this.updatedAt = new Date()
    next()
})

const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {
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
            Joi.object({
                productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                name: Joi.string().required(),
                image: Joi.string().required(),
                price: Joi.number().required(),
                quantity: Joi.number().min(1).required(),
                subTotal: Joi.number().required()
            })
             ).min(1).required(),

            totalAmount: Joi.number(),
            paymentStatus: Joi.string().valid('pending', 'paid', 'failed', 'refunded'),
            deliveryStatus: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
            paymentReference: Joi.string().optional(),
            paymentGateway: Joi.string().optional(),
            transactionId: Joi.string().optional(),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
    }
    return Joi.validate(order, schema)
}

exports.Order = Order;
exports.validate = validateOrder;