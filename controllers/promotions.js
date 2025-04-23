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

// @desc    apply promotion
// @route   POST /api/v1/promotions/apply
// @access  Private (admin, user)
exports.applyPromotion = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Promo code is required' });
    }

    const promo = await Promotion.findOne({ promotionCode: code });

    if (!promo) {
      return res.status(404).json({ success: false, message: 'Invalid promo code' });
    }

    const now = new Date();

    if (now > promo.expiredDate) {
      return res.status(400).json({ success: false, message: 'Promo code has expired' });
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ success: false, message: 'Promo code usage limit reached' });
    }

    if (promo.minSpend && cartTotal < promo.minSpend) {
      return res.status(400).json({
        success: false,
        message: `Minimum spend of $${promo.minSpend} is required to use this code`,
      });
    }

    promo.usedCount += 1;
    await promo.save();

    return res.status(200).json({
      success: true,
      message: 'Promo code applied successfully',
      data: {
        discountPercentage: promo.discountPercentage,
        code: promo.promotionCode,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
