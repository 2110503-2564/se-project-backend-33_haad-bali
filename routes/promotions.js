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

/**
* @swagger
* components:
*   schemas:
*     Promotion:
*       type: object
*       required:
*         - promotionCode
*         - discountPercentage
*         - expiredDate
*       properties:
*         id:
*           type: string
*           format: uuid
*           description: The auto-generated ID of the promotion
*         promotionCode:
*           type: string
*           description: The unique code for the promotion
*         discountPercentage:
*           type: number
*           format: float
*           description: The percentage of discount applied by the promotion
*         expiredDate:
*           type: string
*           format: date
*           description: The expiration date of the promotion
*         minSpend:
*           type: number
*           description: The minimum spend required to use the promotion (optional)
*         usedCount:
*           type: number
*           description: The number of times the promotion has been used
*         maxUses:
*           type: number
*           description: The maximum number of times the promotion can be used
*         createdAt:
*           type: string
*           format: date-time
*           description: Date when the promotion was created
*/

/**
* @swagger
* tags:
*   name: Promotions
*   description: API for managing promotions
*/

/**
* @swagger
* /promotions:
*   get:
*     summary: Returns the list of all promotions
*     tags: [Promotions]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The list of promotions
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Promotion'
*/

/**
* @swagger
* /promotions/{id}:
*   get:
*     summary: Get a promotion by ID
*     tags: [Promotions]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Promotion ID
*     responses:
*       200:
*         description: Promotion details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Promotion'
*       404:
*         description: Promotion not found
*/

/**
* @swagger
* /promotions:
*   post:
*     summary: Create a new promotion
*     tags: [Promotions]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Promotion'
*     responses:
*       201:
*         description: Promotion created successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Promotion'
*       400:
*         description: Invalid request body or data
*       500:
*         description: Server error
*/

/**
* @swagger
* /promotions/{id}:
*   put:
*     summary: Update a promotion by ID
*     tags: [Promotions]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Promotion ID
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Promotion'
*     responses:
*       200:
*         description: Promotion updated successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Promotion'
*       404:
*         description: Promotion not found
*       500:
*         description: Server error
*/

/**
* @swagger
* /promotions/{id}:
*   delete:
*     summary: Delete a promotion by ID
*     tags: [Promotions]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Promotion ID
*     responses:
*       200:
*         description: Promotion deleted successfully
*       404:
*         description: Promotion not found
*       500:
*         description: Server error
*/

/**
* @swagger
* /promotions/apply:
*   post:
*     summary: Apply a promotion code to a cart total
*     tags: [Promotions]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               code:
*                 type: string
*                 description: The promo code to apply
*               cartTotal:
*                 type: number
*                 format: float
*                 description: The total amount of the cart
*     responses:
*       200:
*         description: Promo code applied successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 discountPercentage:
*                   type: number
*                   description: The discount percentage applied
*                 code:
*                   type: string
*                   description: The promo code applied
*       400:
*         description: Invalid promo code or failed validation
*       404:
*         description: Promo code not found or expired
*       500:
*         description: Server error
*/
