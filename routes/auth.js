const {User, validate, validateLogin} = require('../models/user')
const Joi = require ('joi')
const express = require('express');
const router = express.Router();
const _ = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config');




    router.post('/', async(req, res) => {
    const { error } = validateLogin(req.body); 
    if (error) return res.status(400).json({success: false, message:error.details[0].message});

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({success: false, message:'Invalid email '});

   
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({success: false, message:'Invalid password'});

    const token = user.generateAuthToken();
    res.json({success: true, token, _id: user._id, isDistributor: user.isDistributor})
   
    })

    // distributor login 
        router.post("/distributor", async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password.");

    if (user.role !== "distributor") {
        return res.status(403).send("Access denied. Not a distributor account.");
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();
    res.send({ token, role: user.role, name: user.name, city: user.city });
    });




   




    module.exports = router