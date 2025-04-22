// models/PromoCodeUsage.js
const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true },
  promoCodeId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promotion', 
    required: true },
  usedAt: { 
    type: Date, 
    default: Date.now }
});

usageSchema.index({ userId: 1, promoCodeId: 1 }, { unique: true });

module.exports = mongoose.model('PromoCodeUsage', usageSchema);
