const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// database format
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: '/images/profilePic.jpeg'
    }
});

// passport local mongoose
userSchema.plugin(passportLocalMongoose);

// create user
const User = mongoose.model('User', userSchema);

module.exports = User;