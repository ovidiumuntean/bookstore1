const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Administrator = require('../models/administrator');
const bcrypt = require('bcryptjs');
const config = require('../config/database');


// Register
router.post('/register', function(req, res, next) {
    console.log(req.body);

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) throw err;
            req.body.password = hash;

            Administrator.create(req.body)
                .then(user => {
                    if(!user){
                        res.json({success: false, msg: 'Error in creation!'});
                    } else {
                        res.json({success: true, msg: 'Admin registered'});
                        next();
                    }
                }).catch (next);
        });
    });
});

// Authenticate
router.post('/authenticate', function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    console.log('Email: ', email + password);
    Administrator.findOne({
        where: {email: req.body.email}
    }).then(user => {
        if(!user){
            res.json({success: false, msg: 'Admin not found'});
        } else{
            //console.log(user);
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    const token = jwt.sign({data: user}, config.secret, {
                        expiresIn: 604800 // 1 week
                    });
                    res.json({
                        success: true,
                        token: 'JWT '+token,
                        user: {
                            email: user.email,
                            permission: user.permission
                        }
                    })
                } else {
                    return res.json({success: false, msg: 'Wrong password'});
                }
            });
        }
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    console.log('Administrator Profile!');
    res.json({admin: req.user});
});

module.exports = router;