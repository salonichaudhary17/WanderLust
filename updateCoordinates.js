// updateCoordinates.js

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.log("MongoDB connection error:", err);
    });


// Geocode a location using OpenStreetMap Nominatim

const geocode = async (location, country) => {

    // Combine location and country
    const query = country
        ? `${location}, ${country}`
        : location;

    // Create Nominatim URL
    const url =
        "https://nominatim.openstreetmap.org/search?" +
        new URLSearchParams({
            q: query,
            format: "jsonv2",
            limit: "1"
        });

    // Send request
    const response = await fetch(url, {

        headers: {
            "User-Agent":
                "WanderLust/1.0 (student project)"
        }

    });

    // Check response
    if (!response.ok) {

        throw new Error(
            `Nominatim error: ${response.status}`
        );

    }

    // Convert response to JSON
    const data = await response.json();

    // Location not found
    if (!data || data.length === 0) {

        return null;

    }

    // Get first result
    const result = data[0];

    // Convert coordinates to numbers
    const latitude =
        parseFloat(result.lat);

    const longitude =
        parseFloat(result.lon);

    return {
        latitude,
        longitude
    };
};


// Update all old listings

const updateListings = async () => {

    try {

        // Find listings that don't have geometry
        const listings =
            await Listing.find({
                $or: [
                    {
                        geometry: {
                            $exists: false
                        }
                    },
                    {
                        "geometry.coordinates": {
                            $exists: false
                        }
                    }
                ]
            });

        console.log(
            `Found ${listings.length} listings without coordinates.`
        );


        // Process one listing at a time

        for (const listing of listings) {

            console.log(
                `\nGeocoding: ${listing.location}, ${listing.country}`
            );

            try {

                // Get coordinates
                const coordinates =
                    await geocode(
                        listing.location,
                        listing.country
                    );


                // Location couldn't be found
                if (!coordinates) {

                    console.log(
                        `❌ Could not find: ${listing.location}`
                    );

                    continue;

                }


                // Save GeoJSON coordinates

                listing.geometry = {

                    type: "Point",

                    coordinates: [
                        coordinates.longitude,
                        coordinates.latitude
                    ]

                };


                // Save listing
                await listing.save();


                console.log(
                    `✅ ${listing.title}`
                );

                console.log(
                    `   Longitude: ${coordinates.longitude}`
                );

                console.log(
                    `   Latitude: ${coordinates.latitude}`
                );


                // Wait 1 second before next request
                //
                // This is important because the public
                // Nominatim service has a 1 request/second
                // usage policy.

                await new Promise(
                    resolve =>
                        setTimeout(resolve, 1000)
                );

            } catch (error) {

                console.log(
                    `❌ Error for ${listing.title}:`,
                    error.message
                );

            }

        }


        console.log(
            "\nFinished updating listings."
        );


    } catch (error) {

        console.log(
            "Error:",
            error
        );

    } finally {

        // Close MongoDB connection
        await mongoose.connection.close();

        console.log(
            "MongoDB connection closed."
        );

    }

};


// Start migration

updateListings();