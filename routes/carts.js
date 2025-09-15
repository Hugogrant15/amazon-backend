const {Cart, validate} = require('../models/cart')
const {Product} = require('../models/product')
const {Customer} = require('../models/customer')
const express = require('express');
const router = express.Router()


// POST /cart - create a new cart
// router.post("/cart", async (req, res) => {
//     try {
//         const { customerId, products } = validate(req.body);
//         products = [{ productId, quantity }]
//         // Find customer
//         const customer = await Customer.findById(req.body.customerId);
//         console.log(customer)
//         if (!customer) {
//         return res.status(404).json({ message: "Customer not found" });
//         }
//         // Build customer snapshot
//         const customerSnapshot = {
//             firstName: customer.firstName,
//             lastName: customer.lastName,
//             email: customer.email,
//             phone: customer.phone,
//             state: customer.state,
//             city: customer.city
//         };
//         // Process products
//         let items = [];
//         for (let p of products) {
//         const product = await Product.findById(p.productId);
//         if (!product) continue;
//         items.push({
//         productId: product._id,
//         name: product.name,
//         image: product.image,
//         price: product.price,
//         quantity: p.quantity,
//         subtotal: product.price * p.quantity,
//         });
//         }
//         if (items.length === 0) {
//         return res.status(400).json({ message: "No valid products in cart" });
//         }
//         // Create cart
//         const cart = new Cart({
//         customerId,
//         customerSnapshot,
//         items,
//         totalAmount,
//         createdAt,
//         updatedAt
//         });
//         await cart.save();
//         res.status(201).json({
//         message: "Cart created successfully",
//         cart,
//         });
//     } catch (error) {
//     console.error("Error creating cart:", error);
//     res.status(500).json({ message: "Server error" });
//     }
// });

router.post("/", async (req, res) => {
  try {
    const { error, value } = validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { customerId, items } = value;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const customerSnapshot = {
      firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        state: customer.state,
        city: customer.city,
        address: customer.address
    };
    let cartItems = [];
    for (let p of items) {
      const product = await Product.findById(p.productId);
      if (!product) continue;
      cartItems.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: p.quantity,
        subtotal: product.price * p.quantity,
      });
    }
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "No valid products in cart" });
    }
    const cart = new Cart({
      customerId,
      customerSnapshot,
      items: cartItems,
    });
    await cart.save();
    res.status(201).json({
      message: "Cart created successfully",
      cart,
    });
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});





module.exports = router