const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');


const app = express();

app.use(cors());

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/admin', adminRoutes);
app.use(shopRoutes);

//app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
  //.sync({force:true}) <------Forced to over write the previous tables
  .sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Alok', email: 'aalokmaurya@gmail.com' });
    }
    return user;
  })
  .then(user => {
    //console.log(user);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
