const express = require('express');
const bcrypt = require("bcrypt"); 
const router = express.Router();
const User = require("../models/user"); // Capitalized for convention
const jwt = require("jsonwebtoken"); 
const checkAuth = require("../middleware/check-auth");

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
        message: "Invalid Authentication Credentials!"  
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
              expiresIn: 3600,
              userId: foundUser._id     // ✅ corrected
            });
          });
      })
      .catch(err => {
        console.error("Login error:", err);
        res.status(401).json({ message: "Invalid Authentication Credentials!" });
      });
  });

  router.post("/change-password", checkAuth, (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  User.findById(req.userData.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      return bcrypt.compare(currentPassword, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(403).json({ message: "Current password is incorrect." });
          }

          return bcrypt.hash(newPassword, 10).then(hashedPassword => {
            user.password = hashedPassword;
            return user.save();
          });
        });
    })
    .then(() => res.status(200).json({ message: "Password updated successfully." }))
    .catch(err => {
      console.error("Password change error:", err);
      res.status(500).json({ message: "Failed to change password." });
    });
});
  

module.exports = router;
