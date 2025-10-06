const {User, validate} = require('../models/user')
const {Location} = require('../models/distributorLocation');
const express = require('express');
const router = express.Router();
const _ = require('lodash')
const bcrypt = require('bcrypt')
const authorize = require("../middleware/authorize");
const auth = require("../middleware/auth");




    //   // PROMOTE USER TO DISTRIBUTOR (Admin Only)
    //         router.put('/:id/make-distributor', async (req, res) => {
    //         const user = await User.findByIdAndUpdate(
    //             req.params.id,
    //             { isDistributor: true },
    //             { new: true }
    //         );

    //         if (!user) return res.status(404).send('User not found.');

    //         res.send(_.pick(user, ['_id', 'name', 'email', 'isDistributor']));
    //         });

    //         // / Make a user superadmin (only if existing superadmin does this)
    //         router.put('/:id/make-superadmin', async (req, res) => {
    //         const user = await User.findByIdAndUpdate(
    //             req.params.id,
    //             { $set: { isSuperAdmin: true } },
    //             { new: true }
    //         );

    //         if (!user) return res.status(404).send('User not found');
    //         res.send(user);
    //         });

    //  router.post('/', async(req, res) => {
    // const { error } = validate(req.body); 
    // if (error) return res.status(400).send(error.details[0].message);

    // let user = await User.findOne({ email: req.body.email });
    // if (user) return res.status(400).send('User already registered.');

    router.post('/', async(req, res) => {
        // joi validation
    const { error } = validate(req.body); 
    if (error) return res.status(400).json(error.details[0].message);

    //check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({message:'User already registered.'});

    //create new user
    user = new User({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    //  isDistributor:  false
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    //save user
    await user.save();


    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user,['_id', 'name', 'email']))
   
    })

    
    // route to cretae distributor

//     router.post("/create-distributor", [auth, authorize(["super_admin"])], async (req, res) => {
  
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const location = await Location.findById(req.body.locationId)
//   if (!location) return res.status(404).send('invalid location id');

//   let user = await User.findOne({ email: req.body.email });
//   if (user) return res.status(400).send("User already registered.");

//   user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     phoneNumber: req.body.phoneNumber,
//     password: req.body.password,
//      location: {
//             _id: location._id,
//             location: location.location
//         },
//     role: "distributor",
//   });

//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);

//   await user.save();

//   res.send({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     location: user.location, 
//     role: user.role,
//   });
// });

// ✅ Create Distributor
router.post("/create-distributor", [auth, authorize(["super_admin"])], async (req, res) => {
  // Validate input with Joi
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user already exists
  let existing = await User.findOne({ email: req.body.email });
  if (existing) return res.status(400).send("User already registered.");

  
  // ✅ Create user
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    role: "distributor",
    country: req.body.country,
    state: req.body.state,
    city: req.body.city,
  });

  // ✅ Hash password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // Save user
  await user.save();

  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    country: user.country,
    state: user.state,
    city: user.city,
  });
});



// ✅ Get All Users (Super Admin only)
router.get("/all-users", [auth, authorize(["super_admin"])], async (req, res) => {
  try {
    // Fetch all users, but exclude password and __v
    const users = await User.find({}, "name email phoneNumber role country state city").sort({ name: 1 });

    res.json(users);
  } catch (err) {
    console.error("Error fetching all users:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET all distributors and customers
// router.get("/all-users", auth, authorize(["super_admin"]), async (req, res) => {
//   try {
//     // Fetch users where role is distributor or customer
//     const users = await User.find({ role: { $in: ["distributor", "customer"] } }).sort({ name: 1 });
//     res.json(users);
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// router.put("/update-distributor/:id", [auth, authorize(["super_admin"])], async (req, res) => {
//   try {
//     const distributor = await User.findById(req.params.id);
//     if (!distributor) return res.status(404).json({ error: "Distributor not found" });

//     const { name, email, phoneNumber, role, locationId } = req.body;

//     // Update fields
//     if (name) distributor.name = name;
//     if (email) distributor.email = email;
//     if (phoneNumber) distributor.phoneNumber = phoneNumber;
//     if (role) distributor.role = role;

//     // Update location if provided
//     if (locationId) {
//       const location = await Location.findById(locationId);
//       if (!location) return res.status(404).json({ error: "Invalid location" });
//       distributor.location = { location: location.location };
//     }

//     await distributor.save();
//     res.json(distributor);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Delete Distributor
// router.delete("/delete-distributor/:id", [auth, authorize(["super_admin"])], async (req, res) => {
//   try {
//     const distributor = await User.findByIdAndDelete(req.params.id);
//     if (!distributor) return res.status(404).json({ error: "Distributor not found" });
//     res.json({ message: "Distributor deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });








    module.exports = router