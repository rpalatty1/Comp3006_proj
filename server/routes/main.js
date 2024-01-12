const express = require('express');
const router = express.Router();

//Routes
router.get('', (req, res) => {
    const locals = {
        title: "Train booker",
        description: "A simple train booking system."
    }
    res.render('index', { locals });
});

router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;