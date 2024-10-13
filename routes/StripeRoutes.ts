import express, { Request, Response } from 'express';
import { knex } from "../main";
import Stripe from 'stripe';
import dotenv from "dotenv";

dotenv.config();

export const stripeCheckout = express.Router()

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(STRIPE_SECRET_KEY!);

// const stripe = require('Stripe')(STRIPE_SECRET_KEY);

stripeCheckout.post('/create-checkout-session', async (req, res) => {
    try {
      const { orderIds, grandTotal } = req.body;
  
      console.log('orderIds:', orderIds); 
      console.log('grandTotal:', grandTotal); 

      // Create a new Checkout Session for the order
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'hkd',
              product_data: {
                name: 'Order',
              },
              unit_amount: Math.round(grandTotal * 100), // Stripe expects amounts in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:8080/orderHistory.html`,
        cancel_url: `http://localhost:8080/orderHistory.html`,
        metadata: {
          orderIds: JSON.stringify(orderIds),
        },
      });
  
      res.json({ id: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'An error occurred while creating the checkout session.' });
    }
  });

  stripeCheckout.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const event = req.body
    console.log('Webhook received:', event)
    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object
                const metadata = paymentIntent.metadata
                const orderId = metadata.order_ids
                const stripeId = paymentIntent.id
                const updateOrder = await knex('orders')
                .where({ id: orderId })
                .update({
                  state: 'Paid',
                  stripe_id: stripeId,
                  payment_type: 'Online'
                })
                console.log ("stripe:", orderId)
                console.log ("stripeId:",stripeId)
                break;
            case 'payment_method.attached':
                const paymentMethod = event.data.object;
                break;
            default:
                console.log(`Unhandled event type ${event.type}`)
        }
        res.json({ received: true })
    } catch (e) {
        res.status(400).json({ msg: e })
    }
})


// stripeCheckout.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
//   const sig = req.headers['stripe-signature'];

//   console.log("sig:", sig);

//   if (!sig) {
//     res.status(400).send('No Stripe signature found')
//     return;
//   }

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET!);
//     console.log("event:", event);
//   } catch {
//     // console.error(`Webhook Error: ${err.message}`);
//     res.status(400).send(`Webhook Error`);
//     return;
//   }

//   console.log('event:', event);
//   console.log('Webhook received:', event.type);

//   try {
//     switch (event.type) {
//       case 'payment_intent.succeeded':
//         const paymentIntent = event.data.object;
//         const session = await stripe.checkout.sessions.retrieve(paymentIntent.metadata.checkout_session_id);
        
//         if (!session.metadata || !session.metadata.orderIds) {
//           throw new Error('Session metadata or orderIds not found');
//         }
        
//         const orderIds = JSON.parse(session.metadata.orderIds);
        
//         for (const orderId of orderIds) {
//           await knex('orders')
//             .where({ id: orderId })
//             .update({
//               state: 'Completed',
//               stripe_id: paymentIntent.id,
//               payment_type: 'Online'
//             });
//           console.log(`Updated order: ${orderId} with Stripe ID: ${paymentIntent.id}`);
//         }
//         break;

//       case 'payment_method.attached':
//         const paymentMethod = event.data.object;
//         console.log('Payment method attached:', paymentMethod.id);
//         break;

//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }

//     res.json({ received: true });
//   } catch (error) {
//     // console.error('Webhook error:', error.message);
//     res.status(400).json({ error: `Webhook error` });
//     return;
//   }
// });