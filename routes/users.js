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

    router.post("/create-distributor", [auth, authorize(["super_admin"])], async (req, res) => {
  
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const location = await Location.findById(req.body.locationId)
  if (!location) return res.status(404).send('invalid location id');

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
     location: {
            _id: location._id,
            location: location.location
        },
    role: "distributor",
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});









    module.exports = router