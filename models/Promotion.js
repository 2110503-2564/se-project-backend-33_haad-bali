const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({

     promotionCode: {
        type: String,
        required: [true,'Please provide an code for promotion'] ,
        minlength: 1,
        maxlength: [10, 'Promo code can not be longer than 10 characters']
    },
    discountPercentage: {
        type: Number,
        required: [true,'Please provide a percentage of discount'] ,
        min: 1,
        max: 100
    },
    expiredDate: {
        type: Date,
        required: [true,'Please provide an expired date']
    },
    minSpend: {
        type: Number
    },
    usedCount: {
        type: Number ,
        default : 0
    }

});

module.exports = mongoose.model('Promotion', PromotionSchema);

