const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Import passport-local-mongoose
const passportLocalMongoose = require("passport-local-mongoose");

// Create user schema
const userSchema = new Schema({
    // Store user's email
    email: {
        type: String,
        required: true
    }
});

// Add passport-local-mongoose to the schema
userSchema.plugin(
    passportLocalMongoose.default || passportLocalMongoose
);

// Create User model
const User = mongoose.model(
    "User",
    userSchema
);

module.exports = User;