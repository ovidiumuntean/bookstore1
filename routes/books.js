const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Book = require('../models/book');
const Sequelize = require('sequelize');
const fs = require('fs');
const Order = require('../models/order');
const LineItem = require('../models/line_item');
const sequelize = require('../config/db');

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
        res.json({false: false, msg: 'Not Authorized!'});
    }
});

router.post('/updateStock', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    if(req.user.permission === "admin" || req.user.permission === "admin_user") {
        console.log(req.body.newQuantity);
        Book.update({
            qty_in_stock: req.body.newQuantity,
        }, {
            where: {
                id: req.body.bookId
            }
        }).then(book => {
            if (!book) {
                res.json({success: false, msg: 'Error in creation!'});
            } else {
                res.json({success: true, msg: 'Book updated successfully!'});
            }
        });
    } else {
        res.json({false: false, msg: 'Not Authorized!'});
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
            res.json({success: true, books: books});
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

router.get('/search', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    const Op = Sequelize.Op;
    console.log(Object.keys(req.query)[0]);
    var title = Object.keys(req.query)[0];
    Book.findAll({
        where: {
            qty_in_stock: {
                [Op.gt]: 0
            },
            [title]: {
                [Op.like]: '%' + req.query.searchValue + '%'
            }
        }
    }).then( books => {
        if(books.length > 0){
            res.json({success: true, books: books});
        } else {
            res.json({false: true, msg: 'No Books found in the store!'});
        }
    })
});

router.get('/bookById', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    const Op = Sequelize.Op;
    console.log(Object.keys(req.query)[0]);
    var title = Object.keys(req.query)[0];
    Book.findById(req.query.bookId).then(book => {
        if(book){
            res.json({success: true, book: book});
        } else {
            res.json({false: true, msg: 'No Books found in the store!'});
        }
    }).catch(error => {
        res.json({false: true, msg: error.message});
    });

});

router.post('/placeOrder', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    if(req.user) {

       console.log(req.body.items[0].bookId);
        Order.create({
            customerId: req.user.id,
            paymentType: req.paymentType
        }).then( order => {
            if(order){
                console.log(order.id);
                var lineItems = req.body.items;
                for(var i = 0; i < lineItems.length; i++){
                    lineItems[i].orderId = order.id;
                }
                console.log(lineItems[0].orderId);
                LineItem.bulkCreate(lineItems).then( items => {
                    if(items.length > 0){
                        var success = true;
                        var msg = "Order placed successfully!";
                        var sql = "UPDATE books SET qty_in_stock = qty_in_stock - :quantity WHERE id = :bookId";
                        for(var j = 0; j < items.length; j++){
                            sequelize.query(sql, {
                                replacements: items[j],
                                type: sequelize.QueryTypes.UPDATE
                            }).spread((affectedCount, affectedRows) => {
                                console.log(affectedCount + affectedRows);
                            }).catch( error => {
                                success = false;
                                msg = error.message;
                            })
                        }
                        res.json({success: success, msg: msg});
                    } else {
                        res.json({false: true, msg: "Error in line items creation!"});
                    }
                }).catch(error => {
                    res.json({false: true, msg: error.message});
                });
            }
        }).catch(error => {
            res.json({false: true, msg: error.message});
        });
    } else {
        res.json({false: false, msg: 'Not Authorized!'});
    }
});

module.exports = router;