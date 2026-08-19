// utils/geocode.js

// Geocode a location using OpenStreetMap Nominatim
//
// Example:
// location = "New York"
// country = "United States"
//
// The function returns:
// {
//     longitude: -74.006,
//     latitude: 40.7128
// }

const geocode = async (location, country) => {

    // Make sure location exists
    if (!location) {
        throw new Error("Location is required for geocoding.");
    }

    // Combine location and country
    // This makes results more accurate.
    //
    // Example:
    // "New York, United States"
    // "Delhi, India"

    const query = country
        ? `${location}, ${country}`
        : location;


    // Build Nominatim URL

    const url =
        "https://nominatim.openstreetmap.org/search?" +
        new URLSearchParams({
            q: query,
            format: "jsonv2",
            limit: "1"
        });


    // Send request to Nominatim
    //
    // IMPORTANT:
    // Nominatim requires a valid User-Agent
    // identifying your application.

    const response = await fetch(url, {

        headers: {
            "User-Agent":
                "WanderLust/1.0 (student project)"
        }

    });


    // Check whether request was successful

    if (!response.ok) {

        throw new Error(
            `Geocoding failed with status ${response.status}`
        );

    }


    // Convert response to JSON

    const data = await response.json();


    // Check whether location was found

    if (!data || data.length === 0) {

        throw new Error(
            `Could not find location: ${query}`
        );

    }


    // First result is the best match
    const result = data[0];


    // Nominatim returns latitude and longitude
    // as strings.

    const latitude =
        parseFloat(result.lat);

    const longitude =
        parseFloat(result.lon);


    // Make sure coordinates are valid

    if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
    ) {

        throw new Error(
            "Invalid coordinates returned by geocoder."
        );

    }


    // Return coordinates

    return {
        longitude,
        latitude
    };

};


// Export function

module.exports = geocode;