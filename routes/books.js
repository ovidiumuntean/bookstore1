const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Book = require('../models/book');
const Sequelize = require('sequelize');

// Register
router.post('/create', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    if(req.user.permission === "admin" || req.user.permission === "admin_user") {
        console.log(req.body);
        Book.create(req.body).then(job => {
            if (!job) {
                res.json({success: false, msg: 'Error in creation!'});
            } else {
                res.json({success: true, msg: 'Book created!'});
            }
        });
    } else {
        res.json({success: false, msg: 'Not Authorized!'});
    }
});

router.get('/books', (req, res, next) => {
    const Op = Sequelize.Op;
    Book.findAll({
        where: {
            qty_in_stock: {
                [Op.gt]: 0
            }
        }
    }).then( books => {
        if(books.length > 0){
            res.json({succes: true, books: books});
        } else {
            res.json({success: true, msg: 'No Books available in the store!'});
        }
    })
});

module.exports = router;