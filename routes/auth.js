const {User} = require('../models/user')
const Joi = require ('joi')
const express = require('express');
const router = express.Router();
const _ = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config');




    router.post('/', async(req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).json({success: false, message:error.details[0].message});

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({success: false, message:'Invalid email '});

   
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({success: false, message:'Invalid password'});

    const token = user.generateAuthToken();
    res.json({success: true, token, _id: user._id})
   
    })




    function validate(req) {
    const schema = Joi.object( {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    
    });
    // return Joi.validate(req, schema);
    return schema.validate(req);
    }




    module.exports = router