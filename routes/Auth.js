// routes/auth.js
const express= require('express');
const {register, login ,getMe ,logout,updateUser,deleteUser,getAllUsers}=require('../controllers/auth');

const router=express.Router();

const {protect,authorize}= require('../middleware/auth');

router.post('/register', register);
router.post('/login',login);
router.get('/me',protect,getMe);
router.get('/logout',logout);
router.put('/update', protect, updateUser);
router.delete('/delete/:id', protect, authorize('admin', 'user'), deleteUser);
router.get('/users',protect, authorize('admin'),getAllUsers);

module.exports=router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - name
 *         - telephone
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: Unique username
 *         name:
 *           type: string
 *           description: Full name of the user
 *         telephone:
 *           type: string
 *           description: Telephone number
 *         email:
 *           type: string
 *           description: User email
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: Role of the user
 *         password:
 *           type: string
 *           description: User password (min 6 characters)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when user was created
 *       example:
 *         id: 60a7c0f5b9c3b34a9c8b4567
 *         username: johndoe
 *         name: John Doe
 *         telephone: 0812345678
 *         email: johndoe@example.com
 *         role: user
 *         password: password123
 *         createdAt: 2023-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The authentication managing API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The logged-in user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user and clear cookie
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */

/**
 * @swagger
 * /auth/update:
 *   put:
 *     summary: Update current logged-in user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /auth/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID (admin or owner)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
