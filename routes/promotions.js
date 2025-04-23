const express = require('express');
const {
  getPromotions,
  getPromotion,
  addPromotion,
  updatePromotion,
  deletePromotion,
  applyPromotion,
} = require('../controllers/promotions');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET all promotions / POST a new promotion
router
  .route('/')
  .get(getPromotions)
  .post(protect, authorize('admin', 'user'), addPromotion);

// GET / PUT / DELETE a promotion by ID
router
  .route('/:id')
  .get(getPromotion)
  .put(protect, authorize('admin', 'user'), updatePromotion)
  .delete(protect, authorize('admin', 'user'), deletePromotion);

// apply promotion
router
  .route('/apply')
  .post(protect, authorize('admin', 'user'), applyPromotion);

module.exports = router;
