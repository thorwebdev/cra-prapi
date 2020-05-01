import React, { useEffect, useState } from 'react';
import './App.css';

import { useShoppingCart } from 'use-shopping-cart'

import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';

const productData = [
  {
    name: 'Bananas',
    sku: 'sku_GBJ2Ep8246qeeT',
    price: 400,
    image: 'https://www.fillmurray.com/300/300',
    currency: 'USD',
  },
  {
    name: 'Tangerines',
    sku: 'sku_GBJ2WWfMaGNC2Z',
    price: 100,
    image: 'https://www.fillmurray.com/300/300',
    currency: 'USD',
  },
]

function App() {
  const { totalPrice, redirectToCheckout, cartCount, addItem, cartDetails, cartItems } = useShoppingCart()

  const [paymentRequest, setPaymentRequest] = useState(null);

  const stripe = useStripe();

  useEffect(() => {
    if (stripe && paymentRequest === null) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Demo total',
          amount: cartItems.reduce((acc, { price }) => acc + price, 0),
          pending: true
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      // Check the availability of the Payment Request API first.
      pr.canMakePayment().then(result => {
        console.log({ result })
        if (result) {
          pr.on('paymentmethod', ev => {
            console.log({ ev })
            // POST TO FUNCTION
            ev.complete('success');
          })
          setPaymentRequest(pr);
        }
      });
    } else if (paymentRequest) {
      paymentRequest.update({
        total: {
          label: 'Demo total',
          amount: cartItems.reduce((acc, { price }) => acc + price, 0),
        },
      });
    }
  }, [stripe, paymentRequest, cartItems]);

  return (
    <div>
      {/* Renders the products */}
      {productData.map((product) => (
        <button key={product.sku} onClick={() => addItem(product)}>{`Add ${product.name}`}</button>
      ))}
      {/* This is where we'll render our cart */}
      <p>Number of Items: {cartCount}</p>
      <p>Total: {totalPrice()}</p>

      {paymentRequest ? <PaymentRequestButtonElement options={{ paymentRequest }} /> : ''}
      {/* Redirects the user to Stripe */}
      <button onClick={() => redirectToCheckout()}>Checkout</button>

      <pre>{JSON.stringify(cartDetails, null, 2)}</pre>
      <pre>{JSON.stringify(cartItems, null, 2)}</pre>
    </div>
  );
}

export default App;
