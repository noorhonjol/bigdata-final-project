const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    retweets: {
        type: String,
        required: true
    }
});

const Tweet = mongoose.model('Tweet', tweetSchema, 'tweets');

module.exports = Tweet;
