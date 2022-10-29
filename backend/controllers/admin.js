const Product = require('../models/product');

exports.getAddProduct = async (req, res, next) => {
  const products = await Product.findAll();
  res.status(200).json(products);
};

exports.postAddProduct = async(req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.getEditProduct = async(req, res, next) => {
  // const editMode = req.query.edit;
  // if (!editMode) {
  //   return res.json({
  //     success: false,
  //     message: "edit query is not passed"
  //   });
  // }
  const prodId = req.params.productId;
  const product = await Product.findByPk(prodId);
  if (!product) {
    return res.json({
      success: false,
      message: "edit query is not passed"
    });
  }
  res.status(200).json(product); 
};

exports.updateEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
  Product.findByPk(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.status(200).json(result)
    })
    .catch(err => console.log(err));
};

exports.getProducts = async(req, res, next) => {
  const products = await Product.findAll();
  res.status(200).json(products);
};

exports.postDeleteProduct = async(req, res, next) => {
  const prodId = req.params.productId;
  const product = await Product.findByPk(prodId);
  product.destroy();
  res.status(200).json({
    success: true,
    message: "products deleted successfully"
  });
};
