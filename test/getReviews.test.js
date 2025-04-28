const { getReviews } = require('../src/getReviews');
const Review = require('../models/Review');

jest.mock('../models/Review');

describe('getReviews', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  it('should return all reviews when no campgroundId is provided', async () => {
    const mockReviews = [
      { _id: '1', content: 'Great!', campground: {}, user: {} },
      { _id: '2', content: 'Awesome!', campground: {}, user: {} }
    ];

    const mockPopulate = jest.fn().mockResolvedValue(mockReviews);
    Review.find.mockReturnValue({ populate: mockPopulate });

    await getReviews(req, res, next);

    expect(Review.find).toHaveBeenCalledWith();
    expect(mockPopulate).toHaveBeenCalledWith('campground user');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: mockReviews.length,
      data: mockReviews
    });
  });

  it('should return reviews for a specific campground when campgroundId is provided', async () => {
    req.params.campgroundId = 'abc123';
    const mockReviews = [
      { _id: '1', content: 'Nice view', campground: 'abc123', user: {} }
    ];

    const mockPopulate = jest.fn().mockResolvedValue(mockReviews);
    Review.find.mockReturnValue({ populate: mockPopulate });

    await getReviews(req, res, next);

    expect(Review.find).toHaveBeenCalledWith({ campground: 'abc123' });
    expect(mockPopulate).toHaveBeenCalledWith('user');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: mockReviews.length,
      data: mockReviews
    });
  });

  it('should handle errors and return 400 status', async () => {
    Review.find.mockImplementation(() => {
      throw new Error('DB error');
    });

    await getReviews(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error fetching reviews'
    });
  });
});

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

