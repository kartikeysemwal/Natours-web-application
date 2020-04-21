/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe('pk_test_wUC3SwQjEO79tZ6gVWiGOO2W00toUiDAtY');

export const bookTour = async (tourId) => {
  try {
    // 1. Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2. Create checkout form + credit card payment
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
