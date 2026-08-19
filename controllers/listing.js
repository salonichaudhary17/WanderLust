const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");


// Show all listings

module.exports.index = wrapAsync(
    async (req, res) => {

        // Get category from query string
        const { category } = req.query;


        let allListings;


        // If category is selected
        if (category) {

            allListings =
                await Listing.find({
                    category: category
                });

        } else {

            // Otherwise show all listings
            allListings =
                await Listing.find({});

        }


        // Render index page

        res.render(
            "listings/index.ejs",
            {
                allListings
            }
        );

    }
);



// Show new listing form

module.exports.renderNewForm =
    (req, res) => {

        res.render(
            "listings/new.ejs"
        );

    };



// Create new listing

module.exports.createListing =
    wrapAsync(
        async (req, res) => {

            // Show uploaded file in terminal
            console.log(
                "Uploaded file:",
                req.file
            );


            // Create listing
            const newListing =
                new Listing(
                    req.body.listing
                );


            // Set owner
            newListing.owner =
                req.user._id;


            // Check uploaded image

            if (req.file) {

                // Save Cloudinary image
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



// Show edit form

module.exports.renderEditForm =
    wrapAsync(
        async (req, res) => {

            // Get ID
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



// Update listing

module.exports.updateListing =
    wrapAsync(
        async (req, res) => {

            // Get ID

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


            // Update normal fields

            listing.set(
                req.body.listing
            );


            // Check for new image

            if (req.file) {

                console.log(
                    "New image uploaded:",
                    req.file
                );


                // Replace image

                listing.image = {

                    filename:
                        req.file.filename,

                    url:
                        req.file.path

                };

            }


            // Save

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



// Delete listing

module.exports.destroyListing =
    wrapAsync(
        async (req, res) => {

            // Get ID

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



// Show one listing

module.exports.showListing =
    wrapAsync(
        async (req, res) => {

            // Get ID

            const { id } =
                req.params;


            // Find listing
            //
            // Populate owner
            // Populate review authors

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