const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

//Merge params is basically done to get the parameter of tourId which is a parameter of tour router
//But with the use of the mergeParams we can use it here

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckOutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
