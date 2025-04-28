const Review = require("../models/Review");
const Campground = require("../models/Campground");

// @desc    Get all reviews or reviews for a specific campground
// @route   GET /api/v1/reviews
// @route   GET /api/v1/campgrounds/:campgroundId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    let query;

    if (req.params.campgroundId) {
      query = Review.find({ campground: req.params.campgroundId }).populate("user");
    } else {
      query = Review.find().populate("campground user");
    }

    const reviews = await query;

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: "Error fetching reviews" });
  }
};