const express=require('express');
const path = require('path');
const cartControllers=require('../controllers/cart.js');
const router=express.Router();



router.get('/open',(req,res)=>{
    res.sendFile(path.join(__dirname,'../../cart.html'));
});
router.get('/:UserId',cartControllers.getProducts);
router.post('/add',cartControllers.addProduct);
router.post('/remove',cartControllers.removeProduct);
router.post('/quantity',cartControllers.updateQuantity);

module.exports.router=router;