const mongoose = require('mongoose')
const express = require('express')
const app = express()
const product = require('./routes/products');
const customer = require('./routes/customers');
const feature = require('./routes/features');
const cart = require('./routes/carts')
const user = require('./routes/users')
const auth = require('./routes/auth')
const config = require('config')
const cors = require("cors");


if (!config.get("jwtPrivateKey")) {
console.error('FATAL ERROR: jwtPrivateKey is not defined.');
process.exit(1);
}





mongoose.connect('mongodb://localhost/amazondatabase')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.log('Could not connect to MongoDB...', err))


app.use(express.json())
app.use(cors());
//  app.use(cors({ origin: "http://127.0.0.1:5501" }));

app.use('/amazon/document/api/products', product)
app.use('/amazon/document/api/customers', customer)
app.use('/amazon/document/api/features', feature)
app.use('/amazon/document/api/register', user)
app.use('/amazon/document/api/login', auth)
app.use('/amazon/document/api/carts', cart)




const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
