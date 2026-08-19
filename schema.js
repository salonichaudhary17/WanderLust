const Joi = require("joi");

// Joi schema used to validate listing data
module.exports.listingSchema = Joi.object({
    listing: Joi.object({

        // Listing title
        title: Joi.string()
            .required(),

        // Listing description
        description: Joi.string()
            .required(),

        // Listing price
        price: Joi.number()
            .min(0)
            .required(),

        // Listing location
        location: Joi.string()
            .required(),

        // Listing country
        country: Joi.string()
            .required(),

        // Listing category
        // Optional so that old listings without
        // a category can still be edited.
        category: Joi.string()
            .allow("")
            .optional(),

        // Image information
        image: Joi.object({
            filename: Joi.string()
                .allow(""),

            url: Joi.string()
                .allow("")
        }).optional(),

        // GeoJSON location
        geometry: Joi.object({
            type: Joi.string()
                .valid("Point"),

            coordinates: Joi.array()
                .items(Joi.number())
                .length(2)
        }).optional()

    }).required()
});