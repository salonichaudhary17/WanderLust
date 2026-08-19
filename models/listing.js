const mongoose = require("mongoose");


// Listing Schema
const listingSchema = new mongoose.Schema({

    // Listing title
    title: {
        type: String,
        required: true,
        trim: true
    },


    // Listing description
    description: {
        type: String,
        required: true,
        trim: true
    },


    // Listing image
    //
    // Cloudinary stores:
    // filename
    // url
    image: {
        filename: {
            type: String
        },

        url: {
            type: String
        }
    },


    // Listing price
    price: {
        type: Number,
        required: true,
        min: 0
    },


    // Listing location
    location: {
        type: String,
        required: true,
        trim: true
    },


    // Listing country
    country: {
        type: String,
        required: true,
        trim: true
    },


    // Listing category
    //
    // Examples:
    // Trending
    // Rooms
    // Iconic Cities
    // Mountains
    // Castles
    // Amazing Pools
    // Camping
    // Farms
    // Arctic
    category: {
        type: String,
        default: "Trending",
        trim: true
    },


    // Listing owner
    //
    // Stores the User ObjectId
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },


    // Reviews belonging to this listing
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],


    // GeoJSON location
    //
    // MongoDB format:
    //
    // {
    //     type: "Point",
    //     coordinates: [longitude, latitude]
    // }
    geometry: {

        type: {
            type: String,
            enum: ["Point"]
        },

        coordinates: {
            type: [Number]
        }

    }

}, {
    timestamps: true
});


// Create Listing model
const Listing = mongoose.model(
    "Listing",
    listingSchema
);


// Export Listing model
module.exports = Listing;