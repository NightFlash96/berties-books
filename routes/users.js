// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
});

router.post('/registered', function (req, res, next) {
    // Hash
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // Store hashedPassword in your database.
        let username = req.body.username;
        let firstname = req.body.first;
        let lastname = req.body.last;
        let email = req.body.email;
        let sqlquery = "INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
        // execute sql query to insert user data
        db.query(sqlquery, [username, firstname, lastname, email, hashedPassword], (err, result) => {
            if (err) {
                next(err)
            }
            else {
                result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
                result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                res.send(result)
            }
        })
    })
}); 

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM users"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        else {
            // remove the password from the json object before rendering
            result.forEach(user => {
                delete user.hashedPassword;
            });
            console.log(result);
            res.render("listusers.ejs", {users: result})
        }
    });
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
});

router.post('/loggedin', function (req, res, next) {
    let sqlquery = "SELECT hashedPassword FROM users WHERE username= ? OR email= ?";
    // execute sql query
    db.query(sqlquery, [req.body.username, req.body.username], (err, result) => {
        if (err) {
            next(err)
        }
        else if (result.length === 0) {
            res.send('Username or email not found.')
            console.log(result);
        }
        else {
            bcrypt.compare(req.body.password, result[0].hashedPassword, function(err, result) {
                if (err) {
                    next (err)
                }
                else if (result == true) {
                    res.send('You are now logged in!')
                }
                else {
                    res.send('Login failed')
                }
            });    
        }
    });
});

// Export the router object so index.js can access it
module.exports = router;
