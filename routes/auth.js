// * importing express
const express = require("express");

// * to perform validation
const { body, validationResult } = require("express-validator");

// * to perform encryption
const bcrypt = require("bcryptjs");

// * to generate and provide token (for authentication)
const jwt = require("jsonwebtoken");

// * secret to generate token
const JWT_SECRET = "chiragJaniSecret01";

// * importing schema to use
const User = require("../models/User");
const getUser = require("../middleware/getUser");

// * to use router and create routes
const router = express.Router();

// ! login user
router.post(
  "/login/user",
  [
    body("email", "Email not valid").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  async (req, res) => {
    try {
      let success = false;

      // * checking for errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
      }

      // * getting user from email
      let user = await User.findOne({ email: req.body.email });

      // * authenticating
      if (!user) {
        return res.status(400).json({ success, error: "User does not exist" });
      }

      // * comparing passwords to login
      const passCompare = await bcrypt.compare(
        req.body.password,
        user.password
      );

      // * if passwords not match
      if (!passCompare) {
        return res
          .status(400)
          .json({ success, error: "Password Doesn't Match" });
      } else {
        // * creating token and sending
        const data = {
          user: {
            id: user.id,
          },
        };

        // * signing token
        let authToken = jwt.sign(data, JWT_SECRET);

        // * setting success true
        success = true;

        // * sending response
        return res.json({ success, user, authToken });
      }
    } catch (error) {
      return res.status(500).json({ success, error: error.message });
    }
  }
);

// ! signup user
router.post(
  "/signup/user",
  [
    body("name", "Enter Name").exists(),
    body("email", "Enter email with min 5 characters").isEmail(),
    body("password", "Enter Password").exists(),
    body("dob", "Enter Date").exists(),
  ],
  async (req, res) => {
    try {
      let success = false;

      // * checking for errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success,
          error: errors.array(),
        });
      }

      // * finding user from email
      let user = await User.findOne({ email: req.body.email });

      // * if user does not exist
      if (user) {
        return res
          .status(400)
          .json({ success, error: "User with the same email exists" });
      }

      // * generating salt
      const salt = await bcrypt.genSalt(10);

      // * encrypting password
      let securePass = await bcrypt.hash(req.body.password, salt);

      // * creating user
      user = await User.create({
        email: req.body.email,
        password: securePass,
        dob: req.body.dob,
        name: req.body.name,
      });

      // * creating token and sending
      const data = {
        user: {
          id: user.id,
        },
      };

      // * signing token
      let authToken = jwt.sign(data, JWT_SECRET);

      // * setting success
      success = true;

      // * returning response
      return res.json({ success, user, authToken });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// ! update user
router.put("/update/user/:id", getUser, async (req, res) => {
  try {
    let success = false;

    // * checking for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success,
        error: errors.array(),
      });
    }

    // * getting values by destructering
    let { name, email, password, dob } = req.body;

    // * updated user object
    let updatedUser = {};

    // * setting fields if entered
    if (name) updatedUser.name = name;
    if (email) updatedUser.email = email;
    if (password) {
      // * generating salt
      const salt = await bcrypt.genSalt(10);

      // * encrypting password
      let securePass = await bcrypt.hash(password, salt);
      updatedUser.password = securePass;
    }
    if (dob) updatedUser.dob = dob;

    // * finding user by id
    let user = await User.findById(req.params.id);

    // * if user does not exist
    if (!user)
      return res.status(404).json({ success, error: "User not found" });

    // * if it does
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedUser },
      { new: true }
    );

    // * updating success
    success = true;

    // * returning response
    return res.json({ success, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

// ! delete user - only admin should
router.delete("/delete/user/:id", getUser, async (req, res) => {
  try {
    let success = false;

    // * finding user by id and deleting
    let user = await User.findByIdAndDelete(req.params.id);

    // * updating success
    success = true;

    // * returning response
    return res.json({ success, message: "User Deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
