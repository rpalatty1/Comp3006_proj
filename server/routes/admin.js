const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

//check login - authorization
const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;
  
    if(!token) {
      return res.status(401).json( { message: 'Unauthorized'} );
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch(error) {
      res.status(401).json( { message: 'Unauthorized'} );
    }
  }


//GET request - admin login
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

//POST request - admin login authentication
router.post('/admin', async (req, res) =>{
    try{
       const {username, password} = req.body;

       const user = await User.findOne({username});

       if (!user){
        return res.status(401).json({message:'Invalid credentials'});
       }

       const isPasswordValid = await bcrypt.compare(password, user.password);
       if (!isPasswordValid){
        return res.status(401).json({message:'Invalid credentials'});
       }

       const token = jwt.sign({userID:user._id}, jwtSecret);
       res.cookie('token', token, {httpOnly: true});

       res.redirect('/dashboard');


    } catch (error) {
        console.log(error);
    }
    
});

//GET request - display admin dashboard
router.get('/dashboard', authMiddleware, async (req, res) =>{
    try{
        const locals = {
            title:'Dashboard',
            description:'A simple train booking system'
        }

        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        });
    }catch (error){
        console.log(error);

    }
    }
    //res.render('admin/dashboard');
);

//GET request - authentication and redirection before adding new post
router.get('/add-post', authMiddleware, async (req, res) =>{
    try{
        const locals = {
            title:'Add post',
            description:'A simple train booking system'
        }

        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
                });
    }catch (error){
        console.log(error);

    }}
);

//POST request - allows admin to create new post
router.post('/add-post', authMiddleware, async (req, res) => {
    
    try {
        console.log(req.body);

        try{
            const newPost = new Post({
                startLocation: req.body.Start,
                endLocation: req.body.Destination,
                trainTime: req.body.Departure,
                platformNumber: req.body.Platform,
                carriageNumber: req.body.Carriage,
                extraNotes: req.body.Notes
            });

            await Post.create(newPost);
            res.redirect('/dashboard');
        }catch(error){
            console.log(error);
        }
         
    }catch(error){
        console.log(error)
    }
});

//GET request - authentication and redirection to edit page
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const data = await Post.findOne({_id: req.params.id});

        res.render('admin/edit-post', {
            data,
            layout: adminLayout
        })
    } catch(error){
        console.log(error);
    }
});

//PUT request - allows admin to edit/update existing posts
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
  
      await Post.findByIdAndUpdate(req.params.id, {
        startLocation: req.body.Start,
        endLocation: req.body.Destination,
        trainTime: req.body.Departure,
        platformNumber: req.body.Platform,
        carriageNumber: req.body.Carriage,
        extraNotes: req.body.Notes,
        updatedAt: Date.now()
      });
  
      res.redirect(`/edit-post/${req.params.id}`);
  
    } catch (error) {
      console.log(error);
    }
  
  });

//DELETE request - allows admin to delete existing posts (redirection to dashboard)

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
        await Post.deleteOne( { _id: req.params.id});
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
});
  
//GET request - allows admin to log out 
router.get('/logout', (req, res) =>{
    res.clearCookie('token');
    //res.json({message: 'You have successfully logged out.'});
    res.redirect('/admin');
});


//POST request - used for registering new members (NOT displayed on frontend)
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