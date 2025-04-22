const Promotion = require('../models/Promotion');

// @desc    Get all promotions
// @route   GET /api/v1/promotions
// @access  Public
exports.getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.status(200).json({
      success: true,
      count: promotions.length,
      data: promotions,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single promotion
// @route   GET /api/v1/promotions/:id
// @access  Public
exports.getPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, error: 'Promotion not found' });
    }
    res.status(200).json({ success: true, data: promotion });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Add a new promotion
// @route   POST /api/v1/promotions
// @access  Private (admin, user)
exports.addPromotion = async (req, res) => {
    try {
      const promotion = await Promotion.create(req.body);
      res.status(201).json({ success: true, data: promotion });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

// @desc    Update promotion
// @route   PUT /api/v1/promotions/:id
// @access  Private (admin, user)
exports.updatePromotion = async (req, res) => {
  try {
    let promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, error: 'Promotion not found' });
    }

    promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: promotion });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete promotion
// @route   DELETE /api/v1/promotions/:id
// @access  Private (admin, user)
exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, error: 'Promotion not found' });
    }

    await promotion.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
