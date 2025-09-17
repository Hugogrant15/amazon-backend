const {Feature, validate} = require('../models/feature')
const express = require('express');
const router = express.Router()
const auth = require('../middleware/auth');
const distributor = require('../middleware/distributor');
const superadmin = require('../middleware/superadmin');

router.get('/', async (req, res) => {
    const features = await Feature.find().sort('name')
    res.send(features)

})

router.post('/', [auth, superadmin], async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)
    


  let feature = new Feature ({
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        numberInStock: req.body.numberInStock
    })

    feature = await feature.save()
    res.send(feature)

})



router.put('/:id', [auth, superadmin], async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)

    const feature = await Feature.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        numberInStock: req.body.numberInStock,
    }, {new: true})

    if (!feature) return res.status(400).send('The product with the given id not Found');

    res.send(feature)
})

router.delete('/:id', [auth, superadmin], async (req, res) => {
    const feature = await Feature.findByIdAndDelete(req.params.id)

    if(!feature) return res.status(400).send('The product with the given id not Found');

    res.send(feature)

})


router.get('/:id', async (req, res) => {
    const feature = await Feature.findById(req.params.id)
    
    if(!feature) return res.status(400).send('The product with the given id not Found');

    res.send(feature)
})


module.exports = router
