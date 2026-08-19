const express = require("express");
const router = express.Router();

const passport = require("passport");

const {
    renderSignupForm,
    signup,
    renderLoginForm,
    login,
    logout
} = require("../controllers/user.js");

// Show signup page
router.get(
    "/signup",
    renderSignupForm
);

// Register user
router.post(
    "/signup",
    signup
);

// Show login page
router.get(
    "/login",
    renderLoginForm
);

// Login user
router.post(
    "/login",
    passport.authenticate(
        "local",
        {
            failureRedirect: "/login",
            failureFlash: true
        }
    ),
    login
);

// Logout user
router.get(
    "/logout",
    logout
);

module.exports = router;