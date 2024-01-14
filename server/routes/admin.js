const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';

//GET admin login page

router.get('/admin', async (req, res) =>{
    try{
        const locals = {
            title: "Admin",
            description: "A simple train booking system."
        }

        res.render('admin/index', {locals, layout: adminLayout});
    } catch (error) {
        console.log(error);
    }
    
});

//POST admin check login
router.post('/admin', async (req, res) =>{
    try{
        const {username, passowrd} = req.body;
        console.log(req.body);
        res.redirect('/admin');

    } catch (error) {
        console.log(error);
    }
    
});

//admin - register
router.post('/register', async (req, res) => {
    try{

        const { username, password} = req.body;
        const hashedPassowrd = await bcrypt.hash(password, 10);

        try{
            const user = await User.create({ username, password: hashedPassowrd });
            res.status(201).json({message: 'User Created', user });
        }catch(error){

        }

    }catch(error){
        if(error.code === 11000){
            res.status(409).json({message: 'Username in use'});
        }
        res.status(500).json({messgae: 'Internal Server Error'});

    }

});



module.exports = router;