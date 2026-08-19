const express = require("express");

// Get :id from the parent route
const router = express.Router({
    mergeParams: true
});

const {
    isLoggedIn,
    isReviewAuthor
} = require("../middleware.js");

const {
    createReview,
    destroyReview
} = require("../controllers/review.js");

// Create a review
router.post(
    "/",
    isLoggedIn,
    createReview
);

// Delete a review
// Only the review author can delete it
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    destroyReview
);

module.exports = router;