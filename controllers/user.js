const User = require("../models/user.js");
const passport = require("passport");

// Show signup page
module.exports.renderSignupForm = (req, res) => {

    // Render signup EJS page
    res.render("users/signup.ejs");
};

// Register a new user
module.exports.signup = async (req, res, next) => {

    try {

        // Get data from signup form
        const {
            username,
            email,
            password
        } = req.body;

        // Create a new user
        const newUser = new User({
            username: username,
            email: email
        });

        // Register the user
        // passport-local-mongoose hashes the password
        const registeredUser =
            await User.register(
                newUser,
                password
            );

        // Automatically log in the user
        req.login(
            registeredUser,
            (err) => {

                // Pass login errors to error middleware
                if (err) {
                    return next(err);
                }

                // Show success message
                req.flash(
                    "success",
                    "Welcome to Wanderlust!"
                );

                // Redirect to listings
                res.redirect("/listings");
            }
        );

    } catch (e) {

        // Show registration error
        req.flash(
            "error",
            e.message
        );

        // Go back to signup
        res.redirect("/signup");
    }
};

// Show login page
module.exports.renderLoginForm = (req, res) => {

    // Render login EJS page
    res.render("users/login.ejs");
};

// Login user
module.exports.login = (req, res) => {

    // Passport has already authenticated the user
    req.flash(
        "success",
        "Welcome back to Wanderlust!"
    );

    // Redirect after successful login
    res.redirect("/listings");
};

// Logout user
module.exports.logout = (req, res, next) => {

    // Passport removes the user from the session
    req.logout((err) => {

        // Handle logout error
        if (err) {
            return next(err);
        }

        // Show logout message
        req.flash(
            "success",
            "You have been logged out."
        );

        // Redirect to listings
        res.redirect("/listings");
    });
};