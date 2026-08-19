const express = require("express");

const router =
    express.Router();

const multer =
    require("multer");


// Multer configuration

const upload =
    multer({
        dest: "uploads/"
    });


const {
    isLoggedIn,
    isOwner
} = require("../middleware.js");


const {
    index,
    renderNewForm,
    createListing,
    renderEditForm,
    updateListing,
    destroyListing,
    showListing
} = require("../controllers/listing.js");


const {
    listingSchema
} = require("../schema.js");


const ExpressError =
    require("../utils/ExpressError.js");


// Validate listing data

const validateListing =
    (req, res, next) => {

        const { error } =
            listingSchema.validate(
                req.body
            );


        if (error) {

            const errMsg =
                error.details
                    .map(
                        el => el.message
                    )
                    .join(", ");


            throw new ExpressError(
                400,
                errMsg
            );

        }


        next();

    };


// ================= LISTINGS =================


// Get all listings

router.get(
    "/",
    index
);


// Create listing

router.post(
    "/",
    isLoggedIn,

    // Receive image
    upload.single("image"),

    // Validate form
    validateListing,

    // Create listing
    createListing
);


// New listing form

router.get(
    "/new",
    isLoggedIn,
    renderNewForm
);


// ================= SINGLE LISTING =================


// Show listing

router.get(
    "/:id",
    showListing
);


// Edit form

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    renderEditForm
);


// Update listing

router.put(
    "/:id",
    isLoggedIn,
    isOwner,

    // Receive new image
    upload.single("image"),

    // Validate form
    validateListing,

    // Update listing
    updateListing
);


// Delete listing

router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    destroyListing
);


module.exports = router;