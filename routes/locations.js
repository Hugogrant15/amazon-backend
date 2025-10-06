// routes/locations.js
const express = require("express");
const router = express.Router();
const { Location, validate } = require("../models/distributorLocation");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// ✅ GET all locations
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find().sort("location");
    res.send(locations);
  } catch (err) {
    res.status(500).send("Server error while fetching locations");
  }
});

// ✅ POST new location (super_admin only)
router.post("/", [auth, authorize(["super_admin"])], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let location = new Location({ location: req.body.location });

  try {
    location = await location.save();
    res.send(location);
  } catch (err) {
    res.status(500).send("Server error while saving location");
  }
});

module.exports = router;
