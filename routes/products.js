const {Product, validate} = require('../models/product')
const express = require('express');
const router = express.Router()
const auth = require('../middleware/auth');
const distributor = require('../middleware/distributor');
const superadmin = require('../middleware/superadmin');

router.get('/', async (req, res) => {
    const products = await Product.find().sort('name')
    res.send(products)

})

router.post('/', [auth, superadmin], async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)
    


    let product = new Product({
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        numberInStock: req.body.numberInStock
    })

    product = await product.save()
    res.send(product)

})



router.put('/:id', [auth, superadmin], async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)

    const product = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        numberInStock: req.body.numberInStock,
    }, {new: true})

    if (!product) return res.status(400).send('The product with the given id not Found');

    res.send(product)
})

router.delete('/:id', [auth, superadmin], async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)

    if(!product) return res.status(400).send('The product with the given id not Found');

    res.send(product)

})


router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    
    if(!product) return res.status(400).send('The product with the given id not Found');

    res.send(product)
})


module.exports = router
