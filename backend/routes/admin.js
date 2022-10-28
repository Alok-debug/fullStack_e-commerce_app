const express = require("express");

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);//verified

// /admin/products => GET
router.get('/products', adminController.getProducts);//verified

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct); //verified

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.delete('/delete-product/:productId', adminController.postDeleteProduct); //verified

module.exports = router;
