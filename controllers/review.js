const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");

// Create a new review
module.exports.createReview = wrapAsync(async (req, res) => {

    // Get listing ID from the URL
    const { id } = req.params;

    // Find the listing
    const listing = await Listing.findById(id);

    // Check whether listing exists
    if (!listing) {
        throw new ExpressError(
            404,
            "Listing not found"
        );
    }

    // Create review using form data
    const review = new Review(
        req.body.review
    );

    // Store logged-in user as review author
    review.author = req.user._id;

    // Save review to MongoDB
    await review.save();

    // Add review ID to the listing
    listing.reviews.push(review._id);

    // Save updated listing
    await listing.save();

    // Show success message
    req.flash(
        "success",
        "Review added successfully!"
    );

    // Go back to listing page
    res.redirect(`/listings/${id}`);
});

// Delete a review
module.exports.destroyReview = wrapAsync(async (req, res) => {

    // Get listing ID and review ID
    const {
        id,
        reviewId
    } = req.params;

    // Remove review reference from listing
    await Listing.findByIdAndUpdate(
        id,
        {
            $pull: {
                reviews: reviewId
            }
        }
    );

    // Delete review from Review collection
    await Review.findByIdAndDelete(
        reviewId
    );

    // Show success message
    req.flash(
        "success",
        "Review deleted successfully!"
    );

    // Go back to listing
    res.redirect(`/listings/${id}`);
});