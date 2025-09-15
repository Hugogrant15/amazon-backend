const {User, validate} = require('../models/user')
const express = require('express');
const router = express.Router();
const _ = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const config = require('config');


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
    password: req.body.password
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    //save user
    await user.save();


    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user,['_id', 'name', 'email']))
   
    })








    module.exports = router