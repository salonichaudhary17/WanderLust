const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");


// ================= SHOW ALL / FILTERED LISTINGS =================

module.exports.index = wrapAsync(
    async (req, res) => {

        // Get category from URL query
        // Example:
        // /listings?category=Mountains

        const { category } = req.query;

        let allListings;


        // If a category is selected
        if (category) {

            allListings = await Listing.find({
                category: category
            });

        } else {

            // Otherwise show all listings
            allListings = await Listing.find({});

        }


        // Send both listings and category
        // to the EJS page

        res.render(
            "listings/index.ejs",
            {
                allListings,
                category
            }
        );

    }
);


// ================= NEW LISTING FORM =================

module.exports.renderNewForm =
    (req, res) => {

        res.render(
            "listings/new.ejs"
        );

    };


// ================= CREATE NEW LISTING =================

module.exports.createListing =
    wrapAsync(
        async (req, res) => {

            // Check uploaded file

            console.log(
                "Uploaded file:",
                req.file
            );


            // Create new listing

            const newListing =
                new Listing(
                    req.body.listing
                );


            // Set owner

            newListing.owner =
                req.user._id;


            // Save uploaded image

            if (req.file) {

                newListing.image = {

                    filename:
                        req.file.filename,

                    url:
                        req.file.path

                };

            }


            // Save listing

            await newListing.save();


            // Flash message

            req.flash(
                "success",
                "New listing created!"
            );


            // Redirect

            res.redirect(
                "/listings"
            );

        }
    );


// ================= EDIT LISTING FORM =================

module.exports.renderEditForm =
    wrapAsync(
        async (req, res) => {

            // Get listing ID

            const { id } =
                req.params;


            // Find listing

            const listing =
                await Listing.findById(id);


            // Check listing

            if (!listing) {

                throw new ExpressError(
                    404,
                    "Listing not found"
                );

            }


            // Render edit page

            res.render(
                "listings/edit.ejs",
                {
                    listing
                }
            );

        }
    );


// ================= UPDATE LISTING =================

module.exports.updateListing =
    wrapAsync(
        async (req, res) => {

            // Get listing ID

            const { id } =
                req.params;


            // Check submitted data

            if (!req.body.listing) {

                throw new ExpressError(
                    400,
                    "Send valid data for listing"
                );

            }


            // Find listing

            const listing =
                await Listing.findById(id);


            // Check listing exists

            if (!listing) {

                throw new ExpressError(
                    404,
                    "Listing not found"
                );

            }


            // Update listing fields

            listing.set(
                req.body.listing
            );


            // Update image if new image
            // was uploaded

            if (req.file) {

                console.log(
                    "New image uploaded:",
                    req.file
                );


                listing.image = {

                    filename:
                        req.file.filename,

                    url:
                        req.file.path

                };

            }


            // Save updated listing

            await listing.save();


            // Flash message

            req.flash(
                "success",
                "Listing updated successfully!"
            );


            // Redirect

            res.redirect(
                `/listings/${id}`
            );

        }
    );


// ================= DELETE LISTING =================

module.exports.destroyListing =
    wrapAsync(
        async (req, res) => {

            // Get listing ID

            const { id } =
                req.params;


            // Delete listing

            await Listing.findByIdAndDelete(
                id
            );


            // Flash message

            req.flash(
                "success",
                "Listing deleted successfully!"
            );


            // Redirect

            res.redirect(
                "/listings"
            );

        }
    );


// ================= SHOW SINGLE LISTING =================

module.exports.showListing =
    wrapAsync(
        async (req, res) => {

            // Get listing ID

            const { id } =
                req.params;


            // Find listing

            const listing =
                await Listing
                    .findById(id)
                    .populate("owner")
                    .populate({
                        path: "reviews",
                        populate: {
                            path: "author"
                        }
                    });


            // Check listing

            if (!listing) {

                throw new ExpressError(
                    404,
                    "Listing not found"
                );

            }


            // Render listing

            res.render(
                "listings/show.ejs",
                {
                    listing
                }
            );

        }
    );