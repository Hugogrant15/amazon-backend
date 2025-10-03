// destructuring
const {Category, validate} = require('../models/category')
const express = require('express');
const router = express.Router()
const auth = require('../middleware/auth');
const authorize = require("../middleware/authorize");
const distributor = require('../middleware/distributor');
const superadmin = require('../middleware/superadmin');



router.get('/', async (req, res) => {
    const categories = await Category.find().sort('name')
    res.send(categories)

})

router.post('/', [auth, authorize(["super_admin"])], async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)
    
    let category = new Category({
        name: req.body.name,
        image: req.body.image
    })
    
    category = await category.save()
    res.send(category)
})



router.put('/:id', [auth, authorize(["super_admin"])], async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)

    const category = await Category.findByIdAndUpdate(req.params.id, {name: req.body.name, image: req.body.image}, {new: true})

    if (!category) return res.status(400).send('The category with the given id not Found');

    res.send(category)
})



router.delete('/:id', [auth, authorize(["super_admin"])], async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id)

    if(!category) return res.status(400).send('The category with the given id not Found');

    res.send(category)

})


router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)
    
    if(!category) return res.status(400).send('The category with the given id not Found');

    res.send(category)
})






module.exports = router
