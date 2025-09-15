const {Customer, validate} = require('../models/customer')
const express = require('express');
const router = express.Router()

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name')
    res.send(customers)

})

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)
    
    let customer = new Customer({
        // profilePicture:req.body.profilePicture,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email:req.body.email,
        phone:req.body.phone,
        dateOfBirth: req.body.dateOfBirth,
        gender:req.body.gender,
        country:req.body.country,
        state: req.body.state,
        city: req.body.city,
        address: req.body.address

    })
    
    customer = await customer.save()
    res.send(customer)
})


router.put('/:id', async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        // profilePicture:req.body.profilePicture,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email:req.body.email,
        phone:req.body.phone,
        dateOfBirth: req.body.dateOfBirth,
        gender:req.body.gender,
        country:req.body.country,
        state: req.body.state,
        city: req.body.city,
        address: req.body.address
    }, {new: true})

    if (!customer) return res.status(400).send('The customer with the given id not Found');

    res.send(customer)
})

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)

    if(!customer) return res.status(400).send('The customer with the given id not Found');

    res.send(customer)

})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    
    if(!customer) return res.status(400).send('The customer with the given id not Found');

    res.send(customer)
})



module.exports = router
