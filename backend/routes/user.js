const express = require('express');
const bcrypt = require("bcrypt"); 
const router = express.Router();
const User = require("../models/user"); // Capitalized for convention
const jwt = require("jsonwebtoken"); 

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const NewUser = new User({   // ✅ Create an instance of the model
        email: req.body.email,
        password: hash
      });

      return NewUser.save();       // ✅ Save the user instance
    })
    .then(result => {
      res.status(201).json({
        message: "User Created",
        result: result
      });
    })
    .catch(err => {
      console.error("Signup error:", err); // ✅ Log the error
      res.status(500).json({
        error: err.message || 'Unknown error occurred'
      });
    });
});

router.post("/login", (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(foundUser => {
        if (!foundUser) {
          return res.status(401).json({ message: "Auth failed" });
        }
  
        return bcrypt.compare(req.body.password, foundUser.password)
          .then(isMatch => {
            if (!isMatch) {
              return res.status(401).json({ message: "Auth failed" });
            }
  
            const token = jwt.sign(
              { email: foundUser.email, userId: foundUser._id },
              "A_very_long_string_for_our_secret",
              { expiresIn: "1h" }
            );
  
            res.status(200).json({
              token: token,  
              expiresIn: 3600  
            });
          });
      })
      .catch(err => {
        console.error("Login error:", err);
        res.status(401).json({ message: "Auth failed" });
      });
  });
  

module.exports = router;
