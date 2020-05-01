import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js';
import { CartProvider } from 'use-shopping-cart'

// Remember to add your public Stripe key
const stripePromise = loadStripe("pk_test_mfWVCJGYkHG8iJPY1IyKOgqn00KN4Nlwwx")

ReactDOM.render(
  <CartProvider
    stripe={stripePromise}
    successUrl="https://stripe.com"
    cancelUrl="https://twitter.com/dayhaysoos"
    currency="USD"
    allowedCountries={['US', 'GB', 'CA']}
    billingAddressCollection={true}
  >
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </CartProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
