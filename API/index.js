const express = require('express');
const path = require('path');
const authRoutes=require('./routes/auth.js');
const cartRoutes=require('./routes/cart.js');
const { start } = require('repl');
const app = express();


app.use(express.json());

app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req, res) => {
  
  res.sendFile(path.join(__dirname, '../', 'home.html'));
});
app.use('/API/auth',authRoutes.router);
app.use('/API/cart',cartRoutes.router);

app.listen(8800, () => {
  console.log('Server is running on http://localhost:8800');
});
