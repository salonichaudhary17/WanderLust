const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

// Check whether the user is logged in
const isLoggedIn = (req, res, next) => {

    // Passport checks whether a user is authenticated
    if (!req.isAuthenticated()) {

        // Remember the page the user wanted to visit
        req.session.redirectUrl =
            req.originalUrl;

        // Show an error message
        req.flash(
            "error",
            "You must be logged in!"
        );

        // Send user to login page
        return res.redirect("/login");
    }

    // User is logged in
    next();
};

// Check whether the logged-in user owns the listing
const isOwner = async (req, res, next) => {

    const { id } = req.params;

    const listing =
        await Listing.findById(id);

    if (!listing) {

        req.flash(
            "error",
            "Listing not found!"
        );

        return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {

        req.flash(
            "error",
            "You don't have permission to do that!"
        );

        return res.redirect(
            `/listings/${id}`
        );
    }

    next();
};

// Check whether the logged-in user wrote the review
const isReviewAuthor = async (
    req,
    res,
    next
) => {

    const {
        id,
        reviewId
    } = req.params;

    const review =
        await Review.findById(reviewId);

    if (!review) {

        req.flash(
            "error",
            "Review not found!"
        );

        return res.redirect(
            `/listings/${id}`
        );
    }

    if (!review.author.equals(req.user._id)) {

        req.flash(
            "error",
            "You don't have permission to delete this review!"
        );

        return res.redirect(
            `/listings/${id}`
        );
    }

    next();
};

module.exports = {
    isLoggedIn,
    isOwner,
    isReviewAuthor
};