const express=require('express');
const path = require('path');
const authControllers=require('../controllers/auth.js');

const router=express.Router();

router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'../../login.html'));
});
router.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'../../register.html'));
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../',home.html));
});


router.post('/register',authControllers.createUser);
router.post('/login',authControllers.loginUser);
module.exports.router= router;