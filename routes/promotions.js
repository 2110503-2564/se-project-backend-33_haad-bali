const express = require('express');
const {
  getPromotions,
  getPromotion,
  addPromotion,
  updatePromotion,
  deletePromotion,
} = require('../controllers/promotions');

const { protect, authorize } = require('../middleware/auth');

// Route to get all reviews or reviews under a specific campground
router
  .route('/')
  .get(getPromotions)
  .post(protect, authorize('admin', 'user'), addPromotion);

// Route to get, update, or delete a specific review by ID
router
  .route('/:id')
  .get(getPromotion)
  .put(protect, authorize('admin', 'user'), updatePromotion)
  .delete(protect, authorize('admin', 'user'), deletePromotion);

module.exports = router;
