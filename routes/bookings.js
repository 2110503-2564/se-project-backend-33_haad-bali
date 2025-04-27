const express = require('express');
const { getBookings, 
    getBooking, 
    addBooking, 
    updateBooking, 
    deleteBooking } = require('../controllers/bookings');

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - CheckInDate
 *         - CheckOutDate
 *         - user
 *         - campground
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated ID of the booking
 *         CheckInDate:
 *           type: string
 *           format: date
 *           description: Check-in date
 *         CheckOutDate:
 *           type: string
 *           format: date
 *           description: Check-out date
 *         duration:
 *           type: string
 *           description: The calculated duration in days (e.g., "2 days")
 *         breakfast:
 *           type: boolean
 *           default: false
 *           description: Whether breakfast is included
 *         pricePerNight:
 *           type: number
 *           description: Price per night from the campground at booking time
 *         breakfastPrice:
 *           type: number
 *           description: Breakfast price per day
 *         totalPrice:
 *           type: number
 *           description: Total price for the entire stay (including breakfast if selected)
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - confirmed
 *             - checked-in
 *             - checked-out
 *             - cancelled
 *           default: pending
 *           description: Current booking status
 *         user:
 *           type: string
 *           format: uuid
 *           description: ID of the user who made the booking
 *         campground:
 *           type: string
 *           format: uuid
 *           description: ID of the associated campground
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the booking was created
 */

/**
* @swagger
* tags:
*   name: Bookings
*   description: The bookings managing API
*/

/**
* @swagger
* /bookings:
*   get:
*     summary: Returns the list of all the bookings
*     tags: [Bookings]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The list of the bookings
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Booking'
*/

/**
* @swagger
* /bookings/{id}:
*   get:
*     summary: Get a booking by ID
*     tags: [Bookings]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Booking ID
*     responses:
*       200:
*         description: Booking details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Booking'
*       404:
*         description: Booking not found
*/

/**
* @swagger
* /bookings/{campgroundId}:
*   post:
*     summary: Create a new booking under a campground
*     tags: [Bookings]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: campgroundId
*         schema:
*           type: string
*         required: true
*         description: The campground ID
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Booking'
*     responses:
*       201:
*         description: Booking created successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Booking'
*       500:
*         description: Server error
*/

/**
* @swagger
* /bookings/{id}:
*   put:
*     summary: Update a booking by ID
*     tags: [Bookings]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Booking ID
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Booking'
*     responses:
*       200:
*         description: Booking updated successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Booking'
*       404:
*         description: Booking not found
*/

/**
* @swagger
* /bookings/{id}:
*   delete:
*     summary: Delete a booking by ID
*     tags: [Bookings]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Booking ID
*     responses:
*       200:
*         description: Booking deleted successfully
*       404:
*         description: Booking not found
*/
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

// Route for getting all bookings under a specific campground
router.route('/').get(protect,authorize('admin', 'user'), getBookings);

// Route for adding a booking under a specific campground
router.route('/:campgroundId')
    .post(protect, authorize('admin', 'user'), addBooking);

// Route for getting, updating, and deleting a specific booking by ID
router.route('/:id')
    .get(protect,authorize('admin', 'user'), getBooking)
    .put(protect, authorize('admin', 'user'), updateBooking)
    .delete(protect, authorize('admin', 'user'), deleteBooking);

module.exports = router;
