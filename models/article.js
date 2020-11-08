let mongoose = require('mongoose');

// Article Schema
let articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: false
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: false
    },
    pic: {
        type: String,
        required: false
    },
    userImage:{
        type: String,
        required: false
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema);