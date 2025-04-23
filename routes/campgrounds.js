const express = require('express');
const {getCampgrounds, getCampground, createCampground, updateCampground, deleteCampground} = require('../controllers/campgrounds');
//Include other resource routers
const bookingRouter=require('./bookings');
const reviews = require('./reviews');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Campground:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - district
 *         - province
 *         - postalcode
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated ID of the campground
 *         name:
 *           type: string
 *           description: Campground name
 *         address:
 *           type: string
 *           description: Street address of the campground
 *         district:
 *           type: string
 *           description: District where the campground is located
 *         province:
 *           type: string
 *           description: Province where the campground is located
 *         postalcode:
 *           type: string
 *           description: 5-digit postal code
 *         tel:
 *           type: string
 *           description: Contact phone number
 *         breakfast:
 *           type: boolean
 *           description: Indicates if breakfast is available
 */

/**
 * @swagger
 * tags:
 *   name: Campgrounds
 *   description: Campground management APIs
 */

/**
 * @swagger
 * /campgrounds:
 *   get:
 *     summary: Returns a list of campgrounds
 *     tags: [Campgrounds]
 *     responses:
 *       200:
 *         description: A list of campgrounds
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campground'
 */

/**
 * @swagger
 * /campgrounds/{id}:
 *   get:
 *     summary: Get a campground by ID
 *     tags: [Campgrounds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the campground
 *     responses:
 *       200:
 *         description: Campground data by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campground'
 *       404:
 *         description: Campground not found
 */

/**
 * @swagger
 * /campgrounds:
 *   post:
 *     summary: Create a new campground
 *     tags: [Campgrounds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campground'
 *     responses:
 *       201:
 *         description: Campground created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /campgrounds/{id}:
 *   put:
 *     summary: Update a campground by ID
 *     tags: [Campgrounds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the campground
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campground'
 *     responses:
 *       200:
 *         description: Campground updated successfully
 *       404:
 *         description: Campground not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /campgrounds/{id}:
 *   delete:
 *     summary: Delete a campground by ID
 *     tags: [Campgrounds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the campground
 *     responses:
 *       200:
 *         description: Campground deleted successfully
 *       404:
 *         description: Campground not found
 *       401:
 *         description: Unauthorized
 */

//Re-route into other resource routers
router.use('/:campgroundId/bookings/',bookingRouter);
//for reviews
router.use('/:campgroundId/reviews', reviews); 


router.route('/').get(getCampgrounds).post(protect, authorize('admin'), createCampground);
router.route('/:id').get(getCampground).put(protect, authorize('admin'), updateCampground).delete(protect, authorize('admin'), deleteCampground);
module.exports=router;