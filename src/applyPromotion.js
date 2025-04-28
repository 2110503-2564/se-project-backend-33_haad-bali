const Promotion = require('../models/Promotion');

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
