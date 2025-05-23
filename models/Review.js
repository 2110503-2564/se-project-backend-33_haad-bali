const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
     user: {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: true 
     },
     campground: {
         type: mongoose.Schema.ObjectId,
         ref: 'Campground',
         required: true
     },
    text: {
        type: String,
        minlength: 0,
        maxlength: [500, 'Review text cannot be more than 500 characters']
    },
    star: {
        type: Number,
        required: [true, 'Please provide a star rating'],
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



module.exports = mongoose.model('Review', ReviewSchema);
