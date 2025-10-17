// const {Product, validate} = require('../models/product');
// const {Category} = require('../models/category')
// const express = require('express');
// const router = express.Router()
// const auth = require('../middleware/auth');
// const authorize = require("../middleware/authorize");
// const distributor = require('../middleware/distributor');
// const superadmin = require('../middleware/superadmin');

// router.get('/', async (req, res) => {
//     const products = await Product.find().sort('name')
//     res.send(products)

// })

// router.post('/', [auth, authorize(["super_admin"])],  async (req, res) => {
//     const {error} = validate(req.body);
//     if (error)  return res.status(400).json(error.details[0].message)

//     const category = await Category.findById(req.body.categoryId)

//     if (!category) return res.status(404).json('Invalid category id');
    


//     let product = new Product({
//         name: req.body.name,
//         category: {
//             _id: category._id,
//             name: category.name,
//         },
//         image: req.body.image,
//         price: req.body.price,
//         description: req.body.description,
//         numberInStock: req.body.numberInStock,
//         benefits: req.body.benefits,
//         variety: req.body.variety,
//         ingredients: req.body.ingredients



//     })

//     product = await product.save()
//     res.send(product)

// })



// router.put('/:id', [auth, authorize(["super_admin"])], async (req, res) => {
//     const {error} = validate(req.body);
//     if (error) return res.status(400).json({ success: false, message: error.details[0].message });

//     const category = await Category.findById(req.body.categoryId)

//    if (!category) return res.status(404).json({ success: false, message: 'Invalid category id' });

//     const product = await Product.findByIdAndUpdate(req.params.id, {
//        name: req.body.name,
//         category: {
//             _id: category._id,
//             name: category.name,
//         },
//         image: req.body.image,
//         price: req.body.price,
//         description: req.body.description,
//         numberInStock: req.body.numberInStock,
//         benefits: req.body.benefits,
//         variety: req.body.variety,
//         ingredients: req.body.ingredients
//     }, {new: true})

//     if (!product) return res.status(400).send('The product with the given id not Found');

//     res.send(product)
// })

// router.delete('/:id', [auth, authorize(["super_admin"])], async (req, res) => {
//     const product = await Product.findByIdAndDelete(req.params.id)

//     if(!product) return res.status(400).send('The product with the given id not Found');

//     res.send(product)

// })


// router.get('/:id', async (req, res) => {
//     const product = await Product.findById(req.params.id)
    
//     if(!product) return res.status(400).send('The product with the given id not Found');

//     res.send(product)
// })


// module.exports = router

const express = require('express');
const router = express.Router();
const { Product, validate } = require('../models/product');
const { Category } = require('../models/category');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// ✅ GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name'); // populates category name only
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// ✅ CREATE product
router.post('/', [auth, authorize(["super_admin"])], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(404).json({ message: 'Invalid category ID' });

    const product = new Product({
      name: req.body.name,
      category: category._id,
      image: req.body.image,
      price: req.body.price,
      description: req.body.description,
      numberInStock: req.body.numberInStock,
      benefits: req.body.benefits,
      variety: req.body.variety,
      ingredients: req.body.ingredients
    });

    const result = await product.save();
    res.json(result);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// ✅ UPDATE product
router.put('/:id', [auth, authorize(["super_admin"])], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(404).json({ message: 'Invalid category ID' });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        category: category._id,
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        numberInStock: req.body.numberInStock,
        benefits: req.body.benefits,
        variety: req.body.variety,
        ingredients: req.body.ingredients
      },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// ✅ DELETE product
router.delete('/:id', [auth, authorize(["super_admin"])], async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

// ✅ GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

module.exports = router;
