// // const {Order, validate} = require('../models/order')
// // const axios = require("axios");
// // const {Product} = require('../models/product')
// // const {Customer} = require('../models/customer')
// // const express = require('express');
// // const router = express.Router()
// // require('dotenv').config();


// const { Order, validate } = require('../models/order');
// const { Customer } = require('../models/customer');
// const axios = require("axios");
// const express = require('express');
// const router = express.Router();
// require('dotenv').config();



// router.post('/create', async (req, res) => {
//   try {
//     const { error } = validate(req.body);
//     if (error) return res.status(400).json({ success: false, message: error.details[0].message });
//     const order = new Order(req.body);
//     await order.save();
//     const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
//     if (!PAYSTACK_SECRET_KEY) return res.status(500).json({ success: false, message: "Paystack key missing" });
//     const response = await axios.post(
//       'https://api.paystack.co/transaction/initialize',
//       {
//         email: order.customerSnapshot.email,
//         amount: order.totalAmount * 100, // Kobo
//         metadata: { orderId: order._id.toString() },
//         callback_url: 'http://127.0.0.1:5501/paymentcallback.html' // Update with your actual callback URL
//       },
//       { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' } }
//     );
//     order.paymentReference = response.data.data.reference;
//     await order.save();
//     res.json({
//       success: true,
//       orderId: order._id,
//       authorizationUrl: response.data.data.authorization_url,
//       reference: response.data.data.reference
//     });
//     } catch (err) {
//   console.error("Paystack Init Error:", err.response?.data || err.message);

//   // Send real error message back to frontend for debugging
//   res.status(500).json({
//     success: false,
//     message: err.response?.data?.message || err.message || "Failed to initialize payment",
//     details: err.response?.data || null
//   });
// }
// //   } catch (err) {
// //     console.error("Paystack Init Error:", err.response?.data || err.message);
// //     res.status(500).json({ success: false, message: "Failed to initialize payment" });
// //   }
// });

// router.post("/confirm", async (req, res) => {
//   try {
//     const { reference } = req.body;
//     if (!reference) return res.status(400).json({ success: false, message: "No reference provided" });
//     // :white_tick: Verify with Paystack
//     const response = await axios.get(
//       `https://api.paystack.co/transaction/verify/${reference}`,
//       {
//         headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
//       }
//     );
//     const data = response.data.data;
//     // :white_tick: Try to find order by Paystack reference
//     let order = await Order.findOne({ paymentReference: reference });
//     // Fallback: sometimes Paystack metadata contains orderId
//     if (!order && data.metadata?.orderId) {
//       order = await Order.findById(data.metadata.orderId);
//     }
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }
//     if (data.status === "success") {
//       order.paymentStatus = "paid";
//       order.transactionId = data.id;
//       await order.save();
//       return res.json({ success: true, order });
//     } else {
//       return res.status(400).json({ success: false, message: "Payment failed" });
//     }
//   } catch (err) {
//     console.error("Paystack Verify Error:", err.response?.data || err.message);
//     res.status(500).json({ success: false, message: "Error verifying payment" });
//   }
// });

// router.post("/webhook", express.json({ type: "application/json" }), async (req, res) => {
//   try {
//     const event = req.body;
//     if (event.event === "charge.success") {
//       const reference = event.data.reference;
//       await Order.findOneAndUpdate(
//         { paymentReference: reference },
//         { paymentStatus: "paid", transactionId: event.data.id }
//       );
//     }
//     // Must respond with 200
//     res.sendStatus(200);
//   } catch (err) {
//     console.error("Webhook Error:", err.message);
//     res.sendStatus(500);
//   }
// });


// router.get("/confirm", async (req, res) => {
//   try {
//     const { reference } = req.query;
//     if (!reference) return res.status(400).json({ success: false, message: "No reference provided" });

//     const response = await axios.get(
//       `https://api.paystack.co/transaction/verify/${reference}`,
//       { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
//     );

//     const data = response.data.data;
//     let order = await Order.findOne({ paymentReference: reference });
//     if (!order && data.metadata?.orderId) {
//       order = await Order.findById(data.metadata.orderId);
//     }
//     if (!order) return res.status(404).json({ success: false, message: "Order not found" });

//     if (data.status === "success") {
//       order.paymentStatus = "paid";
//       order.transactionId = data.id;
//       await order.save();
//       return res.json({ success: true, order });
//     } else {
//       return res.status(400).json({ success: false, message: "Payment failed" });
//     }
//   } catch (err) {
//     console.error("Paystack Verify Error:", err.response?.data || err.message);
//     res.status(500).json({ success: false, message: "Error verifying payment" });
//   }
// });




// router.get('/', async (req, res) => {
//   const orders = await Order.find().sort('name')
//   res.send(orders)
// });


// // update delevely status of order
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { deliveryStatus } = req.body;
//     const order = await Order.findByIdAndUpdate(
//       id,
//       { deliveryStatus },
//       { new: true }
//     );
//     if (!order) return res.status(404).json({ message: 'Order not found' });
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });





// module.exports = router;

const express = require("express");
const axios = require("axios");
const router = express.Router();
const { Order, validate } = require("../models/order");
require('dotenv').config();
router.post('/create', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const order = new Order(req.body);
    await order.save();
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!PAYSTACK_SECRET_KEY) return res.status(500).json({ success: false, message: "Paystack key missing" });
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: order.customerSnapshot.email,
        amount: order.totalAmount * 100, // Kobo
        metadata: { orderId: order._id.toString() },
        callback_url: 'http://127.0.0.1:5501/payment-confirmation.html'
      },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' } }
    );
    order.paymentReference = response.data.data.reference;
    await order.save();
    res.json({
      success: true,
      orderId: order._id,
      authorizationUrl: response.data.data.authorization_url,
      reference: response.data.data.reference
    });
  } catch (err) {
    console.error("Paystack Init Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to initialize payment" });
  }
});
router.post("/confirm", async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ success: false, message: "No reference provided" });
    // :white_tick: Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );
    const data = response.data.data;
    // :white_tick: Try to find order by Paystack reference
    let order = await Order.findOne({ paymentReference: reference });
    // Fallback: sometimes Paystack metadata contains orderId
    if (!order && data.metadata?.orderId) {
      order = await Order.findById(data.metadata.orderId);
    }
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (data.status === "success") {
      order.paymentStatus = "paid";
      order.transactionId = data.id;
      await order.save();
      return res.json({ success: true, order });
    } else {
      return res.status(400).json({ success: false, message: "Payment failed" });
    }
  } catch (err) {
    console.error("Paystack Verify Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Error verifying payment" });
  }
});
router.post("/webhook", express.json({ type: "application/json" }), async (req, res) => {
  try {
    const event = req.body;
    if (event.event === "charge.success") {
      const reference = event.data.reference;
      await Order.findOneAndUpdate(
        { paymentReference: reference },
        { paymentStatus: "paid", transactionId: event.data.id }
      );
    }
    // Must respond with 200
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    res.sendStatus(500);
  }
});
router.get('/', async (req, res) => {
  const orders = await Order.find().sort('name')
  res.send(orders)
});
// Example using Express
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      { deliveryStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
module.exports = router;