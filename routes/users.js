const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

// User Model
const User = require('../models/User')

// Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Register Page
router.get('/register', (req, res) => {
    res.render('register');
});

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    console.log("in register");
    // check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields.' })
    }

    // Check password match
    if (password != password2){
        errors.push({ msg: 'Password do not match' })
    }

    // Check pswd length
    if (password.length < 6) {
        errors.push({ msg: 'Password is not long enougth. At least 6 characters' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email }) // Check if user already exist
        .then(user => {
            if (user) {
                // User Exist
                errors.push({ msg: "email is already register "});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        // Set password to hash
                        newUser.password = hash;

                        newUser.save()
                        .then(user => {
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }))
            }
        });
    }

})

module.exports = router;