const { applyPromotion } = require('../src/applyPromotion');
const Promotion = require('../models/Promotion');

jest.mock('../models/Promotion');

describe('applyPromotion', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 400 if no promo code is provided', async () => {
    await applyPromotion(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Promo code is required' });
  });

  it('should return 404 if promo code not found', async () => {
    req.body.code = 'DISCOUNT10';
    Promotion.findOne.mockResolvedValue(null);

    await applyPromotion(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid promo code' });
  });

  it('should return 400 if promo code is expired', async () => {
    req.body = { code: 'DISCOUNT10', cartTotal: 100 };
    const expiredPromo = {
      expiredDate: new Date(Date.now() - 1000),
    };
    Promotion.findOne.mockResolvedValue(expiredPromo);

    await applyPromotion(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Promo code has expired' });
  });

  it('should return 400 if promo usage limit reached', async () => {
    req.body = { code: 'LIMITED', cartTotal: 100 };
    const limitedPromo = {
      expiredDate: new Date(Date.now() + 1000),
      maxUses: 5,
      usedCount: 5,
    };
    Promotion.findOne.mockResolvedValue(limitedPromo);

    await applyPromotion(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Promo code usage limit reached' });
  });

  it('should return 400 if cartTotal is below minSpend', async () => {
    req.body = { code: 'SPEND50', cartTotal: 20 };
    const promo = {
      expiredDate: new Date(Date.now() + 1000),
      maxUses: 5,
      usedCount: 2,
      minSpend: 50,
    };
    Promotion.findOne.mockResolvedValue(promo);

    await applyPromotion(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Minimum spend of $50 is required to use this code',
    });
  });

  it('should apply valid promo code successfully', async () => {
    req.body = { code: 'SAVE10', cartTotal: 100 };
    const promo = {
      promotionCode: 'SAVE10',
      expiredDate: new Date(Date.now() + 1000),
      maxUses: 10,
      usedCount: 2,
      minSpend: 50,
      discountPercentage: 10,
      save: jest.fn().mockResolvedValue(),
    };
    Promotion.findOne.mockResolvedValue(promo);

    await applyPromotion(req, res, next);

    expect(promo.usedCount).toBe(3);
    expect(promo.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Promo code applied successfully',
      data: {
        discountPercentage: 10,
        code: 'SAVE10',
      },
    });
  });

  it('should return 500 on server error', async () => {
    req.body = { code: 'CRASH', cartTotal: 100 };
    Promotion.findOne.mockRejectedValue(new Error('DB crash'));

    await applyPromotion(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Server error' });
  });
});

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});
