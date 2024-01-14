const express = require('express');
const router = express.Router();
const Post = require('../models/Post')

//Routes
//GET method in home
router.get('', async (req, res) => {
    try{
        const locals = {
            title:"Train Booker",
            description:"A simple train booking system",
        }

        let perPage = 5;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: {rating: -1} } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();


        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);


        
        res.render('index', { 
            locals, 
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });

    }   catch(error){
        console.log(error);
    }
});

//GET route by passing ID
/**
 * GET /
 * Post :id
 */

router.get('/post/:id', async (req, res) => {
    try{
        const locals = {
            title:"Train Booker",
            description:"A simple train booking system",
        }

        let slug = req.params.id;

        const data = await Post.findById({_id: slug});
        res.render('post', {locals, data});
    }catch(error) {
        console.log(error);
    }
});

//post serach terms
router.post('/search', async (req, res) => {
    try{
        const locals = {
            title: "Search",
            description:"A simple train booking system."
        }

        let searchTerm = req.body.searchTerm;

        console.log(searchTerm)

        //const data = await Post.find();
        res.send(searchTerm);
    } catch(error) {
        console.log(error);
    }
    
})


router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;

//used to test 
/*function insertPostData(){
Post.insertMany([
    {
        startLocation: "Basingstoke",
        endLocation: "Plymouth",
        trainTime:"1550",
        platformNumber:"5",
        carriageNumber:"2",
        extraNotes:"bike booking"
    },
    {
        startLocation: "Plymouth",
        endLocation: "Reading",
        trainTime:"1225",
        platformNumber:"3",
        carriageNumber:"7",
        extraNotes:""
    },
    {
        startLocation: "Exeter",
        endLocation: "London",
        trainTime:"1830",
        platformNumber:"1",
        carriageNumber:"4",
        extraNotes:"luggage"
    },
    {
        startLocation: "exeter central",
        endLocation: "plymouth city centre",
        trainTime:"1120",
        platformNumber:"4",
        carriageNumber:"5",
        extraNotes:"baby on board"
    }
])
}
insertPostData();*/


