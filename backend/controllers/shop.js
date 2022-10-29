const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  const products = await Product.findAll();
  res.status(200).json(products);
};

