const mongoose = require('mongoose');
const Campground = require('./Campground'); // import Campground model

const BookingSchema = new mongoose.Schema({
    CheckInDate: {
        type: Date,
        required: true
    },
    CheckOutDate: {
        type: Date,
        required: true
    },
    duration: {
        type: String
    },
    breakfast: {
        type: Boolean,
        default: false
    },
    pricePerNight: {   
        type: Number,
        required: false
    },
    breakfastPrice: {
        type: Number,
        required: false
    },
    totalPrice: {
        type: Number
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "checked-in", "checked-out", "cancelled"],
        default: "pending"
    },
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate days
const calculateDuration = (checkIn, checkOut) => {
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    return `${days} day${days > 1 ? 's' : ''}`;
};

// Calculate total price
const calculateTotalPrice = (pricePerNight, breakfastPrice, breakfastIncluded, checkIn, checkOut) => {
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const breakfastCost = breakfastIncluded ? (breakfastPrice || 0) : 0;
    return (pricePerNight + breakfastCost) * days;
};

// Pre-save
BookingSchema.pre('save', async function (next) {
    if (this.CheckInDate && this.CheckOutDate) {
        this.duration = calculateDuration(this.CheckInDate, this.CheckOutDate);
    }

    if (this.campground) {
        const campground = await Campground.findById(this.campground);
        if (!campground) {
            return next(new Error('Campground not found'));
        }

        // Fetch and set pricePerNight and breakfastPrice from campground
        this.pricePerNight = campground.pricePerNight;
        this.breakfastPrice = campground.breakfastPrice || 0;

        this.totalPrice = calculateTotalPrice(
            this.pricePerNight,
            this.breakfastPrice,
            this.breakfast,
            this.CheckInDate,
            this.CheckOutDate
        );
    }

    next();
});

// Pre-findOneAndUpdate
BookingSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    const booking = await this.model.findOne(this.getQuery());

    const checkIn = update.CheckInDate || booking.CheckInDate;
    const checkOut = update.CheckOutDate || booking.CheckOutDate;
    const campgroundId = update.campground || booking.campground;
    const breakfast = update.breakfast != null ? update.breakfast : booking.breakfast;

    if (checkIn && checkOut) {
        this.set({ duration: calculateDuration(checkIn, checkOut) });
    }

    if (campgroundId) {
        const campground = await mongoose.model('Campground').findById(campgroundId);
        if (!campground) {
            return next(new Error('Campground not found'));
        }

        // Update pricePerNight and breakfastPrice
        this.set({ pricePerNight: campground.pricePerNight });
        this.set({ breakfastPrice: campground.breakfastPrice || 0 });

        this.set({ totalPrice: calculateTotalPrice(
            campground.pricePerNight,
            campground.breakfastPrice || 0,
            breakfast,
            checkIn,
            checkOut
        )});
    }

    next();
});

module.exports = mongoose.model('Booking', BookingSchema);
