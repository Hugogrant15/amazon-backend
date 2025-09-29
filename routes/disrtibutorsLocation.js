const {Location, validate} = require('../models/distributorLocation')
const express = require('express');
const router = express.Router()
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');


router.get('/', async (req, res) => {
    const Locations = await Location.find().sort('location')
    res.send(Locations)

})

router.post('/', [auth, authorize(["super_admin"])], async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)
    
    let location = new Location({
        location: req.body.location
    })
    
    location = await location.save()
    res.send(location)
})



router.put('/:id', [auth, authorize(["super_admin"])], async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)

    const location = await Location.findByIdAndUpdate(req.params.id, {location: req.body.location}, {new: true})

    if (!location) return res.status(400).send('The location with the given id not Found');

    res.send(location)
})



router.delete('/:id', [auth, authorize(["super_admin"])], async (req, res) => {
    const location = await Location.findByIdAndDelete(req.params.id)

    if(!location) return res.status(400).send('The location with the given id not Found');

    res.send(location)

})


router.get('/:id', async (req, res) => {
    const location = await Location.findById(req.params.id)
    
    if(!location) return res.status(400).send('The location with the given id not Found');

    res.send(location)
})






module.exports = router