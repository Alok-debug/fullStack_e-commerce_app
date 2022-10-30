const Product = require('../models/product');

const items_perPage = 4;

exports.getProducts = async (req, res, next) => {
  const page = req.query.page;
  const offset = (page - 1) * items_perPage;
  //console.log('getProducts is callaed',offset);
  const products = await Product.findAll({offset:offset, limit:items_perPage});
  res.status(200).json(products);
};

exports.getCart = async (req, res, next) => {
  const cart = await req.user.getCart();
  // console.log(cart);
  const cartProducts = await cart.getProducts();
  res.status(200).json(cartProducts);
};

exports.postCart = (req, res, next) => {
  if (!req.params.productId) {
    return res.status(400).json({ success: false, message: "Product Id is missing in req params" });
  }
  const prodId = req.params.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};


exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.status(200).json({
        success: true,
        message: "deleted successfully"
      })
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
            })
          );
        })
        .catch(err => console.log(err))
    })
    .then(results => {
      console.log(results);
      return fetchedCart.setProducts(null);
    })
    .then(emptyCartData => {
      res.status(200).json(emptyCartData);
    })
    .catch(err => console.log(err))
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
    .then(orders => { 
      res.status(200).json(orders);
    })
    .catch(err => console.log(err));
}