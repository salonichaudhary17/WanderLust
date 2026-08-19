require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const session = require("express-session");
const {MongoStore} = require('connect-mongo')
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const User = require("./models/user.js");

const userRouter = require("./routes/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");

const ExpressError = require("./utils/ExpressError.js");


// MongoDB Atlas connection URL
// This comes from the ATLASDB_URL variable in .env
const MONGO_URL = process.env.ATLASDB_URL;


// Check whether MongoDB URL is loaded
if (!MONGO_URL) {
    console.log("ERROR: ATLASDB_URL is not found in .env");
    process.exit(1);
}


// Set EJS views folder
app.set("views", path.join(__dirname, "views"));

// Set EJS as template engine
app.set("view engine", "ejs");

// Use ejs-mate for layouts
app.engine("ejs", ejsMate);


// Parse form data
app.use(
    express.urlencoded({
        extended: true
    })
);

const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24 * 3600
});

// Session configuration
const sessionOptions = {
    store: store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
        expires: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 3
        ),
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
};

// Enable sessions
app.use(
    session(sessionOptions)
);


// Enable flash messages
app.use(
    flash()
);


// Initialize Passport
app.use(
    passport.initialize()
);


// Enable Passport sessions
app.use(
    passport.session()
);


// Configure Passport Local Strategy
passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);


// Store user information in session
passport.serializeUser(
    User.serializeUser()
);


// Retrieve user from session
passport.deserializeUser(
    User.deserializeUser()
);


// Make current user and flash messages
// available inside EJS files
app.use(
    (req, res, next) => {

        res.locals.currUser = req.user;

        res.locals.successMsg =
            req.flash("success");

        res.locals.errorMsg =
            req.flash("error");

        next();
    }
);


// Allow PUT and DELETE requests
// from HTML forms
app.use(
    methodOverride("_method")
);


// Serve static files from public folder
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// Serve uploaded images
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// User routes
app.use(
    "/",
    userRouter
);


// Listing routes
app.use(
    "/listings",
    listingRouter
);


// Review routes
app.use(
    "/listings/:id/reviews",
    reviewRouter
);


// Connect to MongoDB Atlas
mongoose
    .connect(MONGO_URL)

    .then(() => {

        console.log(
            "Connected to MongoDB Atlas!"
        );

        // Show which MongoDB server
        // we are connected to
        console.log(
            "Database host:",
            mongoose.connection.host
        );

        // Show database name
        console.log(
            "Database name:",
            mongoose.connection.name
        );

    })

    .catch((err) => {

        console.log(
            "MongoDB connection error:"
        );

        console.log(err);

    });


// Home route
app.get(
    "/",
    (req, res) => {

        res.send(
            "Hi, I am root"
        );

    }
);

// Health check route for Render
app.get("/healthz", (req, res) => {
    res.status(200).send("OK");
});

// Handle 404 errors
app.all(
    "/{*splat}",
    (req, res, next) => {

        next(
            new ExpressError(
                404,
                "Page not found"
            )
        );

    }
);


// Error handling middleware
app.use(
    (err, req, res, next) => {

        const {
            statusCode = 500,
            message = "Something went wrong!"
        } = err;

        res
            .status(statusCode)
            .render(
                "error.ejs",
                {
                    err
                }
            );

    }
);


// Start server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});