const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Book = require('../models/book');
const Sequelize = require('sequelize');
const fs = require('fs');

// Register
router.post('/add', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    if(req.user.permission === "admin" || req.user.permission === "admin_user") {
        console.log("Form Data " + req.body.title);
        console.log("Files Lenght: " + req.files.length);
        req.body.image = fs.readFileSync(req.files[0].path);
        Book.create(req.body).then(book => {
            if (!book) {
                res.json({success: false, msg: 'Error in creation!'});
            } else {
                res.json({success: true, msg: 'Book created!'});
            }
        });
    } else {
        res.json({success: false, msg: 'Not Authorized!'});
    }
});

router.get('/get_books', passport.authenticate('jwt', {session: false}), (req, res, next) => {
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

router.delete('/delete', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    if(req.user.permission === "admin" || req.user.permission === "admin_user") {
        Book.destroy({
            where: {
                id: req.body.bookId
            }
        }).then(affectedRows => {
            if(affectedRows){
                res.json({success: true, msg: 'Book deleted!'});
            }
        }).catch(error => {
            res.json({false: true, msg: 'Error in deletion!'});
        });
    } else {
        res.json({false: true, msg: 'Not Authorized!'});
    }
});

module.exports = router;