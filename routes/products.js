const {Product, validate} = require('../models/product');
const {Category} = require('../models/category')
const express = require('express');
const router = express.Router()
const auth = require('../middleware/auth');
const distributor = require('../middleware/distributor');
const superadmin = require('../middleware/superadmin');

router.get('/', async (req, res) => {
    const products = await Product.find().sort('name')
    res.send(products)

})

router.post('/', [auth, superadmin],  async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)

    const category = await Category.findById(req.body.categoryId)

    if (!category) return res.status(404).send('Invalid category id');
    


    let product = new Product({
        name: req.body.name,
        category: {
            _id: category._id,
            name: category.name,
        },
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        numberInStock: req.body.numberInStock,
        benefits: req.body.benefits,
        variety: req.body.variety,
        ingredients: req.body.ingredients



    })

    product = await product.save()
    res.send(product)

})



router.put('/:id', [auth, superadmin], async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)

    const category = await Category.findById(req.body.categoryId)

    if (!category) return res.status(404).send('Invalid category id');

    const product = await Product.findByIdAndUpdate(req.params.id, {
       name: req.body.name,
        category: {
            _id: category._id,
            name: category.name,
        },
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        numberInStock: req.body.numberInStock,
        benefits: req.body.benefits,
        variety: req.body.variety,
        ingredients: req.body.ingredients
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
