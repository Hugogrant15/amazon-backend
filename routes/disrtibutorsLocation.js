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


// getting orders based on user location and role

// router.get("/by-location", auth, async (req, res) => {
//   try {
//     // just reuse same logic as `/`
//     let orders;

//     if (req.user.role === "super_admin") {
//       orders = await Order.find().sort("name");
//     } else if (req.user.role === "distributor") {
//       if (!req.user.location || !req.user.location.city) {
//         return res.status(400).json({ error: "Distributor has no city set" });
//       }
//       orders = await Order.find({
//         "customerSnapshot.city": req.user.location.city,
//       }).sort("name");
//     } else if (req.user.role === "customer") {
//       orders = await Order.find({
//         "customerSnapshot.email": req.user.email,
//       }).sort("name");
//     } else {
//       return res.status(403).json({ error: "Access denied" });
//     }

//     res.send(orders);
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// test geting orders based on user location and role
// / ✅ Get Orders (role-aware)
router.get("/", auth, async (req, res) => {
  try {
    let orders;

    if (req.user.role === "super_admin") {
      // 🔑 Super admin sees all orders
      orders = await Order.find().sort("name");

    } else if (req.user.role === "distributor") {
      // 🔑 Distributor sees only orders in their city
      if (!req.user.city) {
        return res.status(400).json({ error: "Distributor has no city set" });
      }

      orders = await Order.find({
        "customerSnapshot.city": req.user.city,
      }).sort("name");

    } else if (req.user.role === "customer") {
      // 🔑 Customer sees only their own orders
      orders = await Order.find({
        "customerSnapshot.email": req.user.email,
      }).sort("name");

    } else {
      return res.status(403).json({ error: "Access denied" });
    }

    res.send(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Server error" });
  }
});









module.exports = router