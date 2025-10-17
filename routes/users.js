const {User, validate} = require('../models/user')
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
    
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    //save user
    await user.save();


    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user,['_id', 'name', 'email']))
   
    })

    
   

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

// UPDATE DISTRIBUTOR
router.put("/update-distributor/:id", [auth, authorize(["super_admin"])], async (req, res) => {
  // Validate input with Joi
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Find the user
  let user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("User not found.");

  // Update fields
  user.name = req.body.name;
  user.email = req.body.email;
  user.phoneNumber = req.body.phoneNumber;
  user.country = req.body.country;
  user.state = req.body.state;
  user.city = req.body.city;

  // Hash password if provided
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

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

// DELETE DISTRIBUTOR
router.delete("/delete-distributor/:id", [auth, authorize(["super_admin"])], async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send("User not found.");

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


// :white_tick: Update user's last seen
router.post("/update-last-seen", async (req, res) => {
  try {
    const { email, lastSeen } = req.body;
    if (!email || !lastSeen) {
      return res.status(400).json({ error: "Missing email or lastSeen" });
    }
    // Update inside user collection
    await User.updateOne(
      { email },
      { $set: { lastSeen } },
      { upsert: false }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating last seen:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// :white_tick: Fetch last seen for multiple users
router.post("/get-last-seen", async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({ error: "Invalid emails list" });
    }
    const users = await User.find({ email: { $in: emails } }, { email: 1, lastSeen: 1 });
    const result = {};
    users.forEach(u => {
      result[u.email] = u.lastSeen || 0;
    });
    res.json(result);
  } catch (err) {
    console.error("Error fetching last seen:", err);
    res.status(500).json({ error: "Server error" });
  }
});










    module.exports = router