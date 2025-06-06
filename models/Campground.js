const mongoose = require('mongoose');
const CampgroundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please add a name'],
        unique: true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        required: [true, 'Please add an address']
    },
    district:{
        type: String,
        required: [true, 'Please add a district']
    },
    province:{
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode:{
        type: String,
        required: [true, 'Please add a postalcode'], maxlength:[5, 'Postal Code can not be more than 5 digits']
    },
    tel:{
        type: String
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    breakfast:{
         type: Boolean,
         default:false
    },
    breakfastPrice: {
        type: Number,
        default: 0
    },
    //Reverse populate with virtuals
},{
    toJSON: {virtuals:true},
    toobject:{virtuals:true}
});
CampgroundSchema.virtual('bookings',{
    ref: 'Booking',
    localField: '_id',
    foreignField:'campground',
    justone:false
});
CampgroundSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'campground',
    justOne: false
});

module.exports=mongoose.model('Campground',CampgroundSchema);
