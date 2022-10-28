const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./utils/database');

const app = express();


const adminRoutes = require('./routes/admin');
//const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/admin', adminRoutes);
//app.use(shopRoutes);

//app.use(errorController.get404);

sequelize
  .sync()
  .then(result => {
    // console.log(result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
