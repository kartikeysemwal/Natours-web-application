const express = require('express');
const viewsController = require('../controllers/viewsContoller');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingsCheckout,
  authController.isLogedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', authController.isLogedIn, viewsController.getTour);
router.get('/login', authController.isLogedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLogedIn, viewsController.getSignUpForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
