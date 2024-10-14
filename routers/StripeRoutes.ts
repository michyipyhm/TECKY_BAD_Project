import express, { Request, Response } from "express";
import { knex } from "../main";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export const stripeCheckout = express.Router();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(STRIPE_SECRET_KEY!);

// const stripe = require('Stripe')(STRIPE_SECRET_KEY);

stripeCheckout.post("/create-checkout-session", async (req, res) => {
  try {
    const { orderIds, grandTotal } = req.body;
    console.log("===================================");
    console.log("req.body",req.body)
    // console.log("orderIds:", orderIds);
    // console.log("grandTotal:", grandTotal);

    // Create a new Checkout Session for the order
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "hkd",
            product_data: {
              name: "Order",
            },
            unit_amount: Math.round(grandTotal * 100), // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          order_id: orderIds.toString(),
        },
      },
      mode: "payment",
      success_url: `http://localhost:8080/orderHistory.html`,
      cancel_url: `http://localhost:8080/orderHistory.html`,
      metadata: {
        orderIds: JSON.stringify(orderIds),
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      error: "An error occurred while creating the checkout session.",
    });
  }
});

stripeCheckout.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    const event = req.body;
    console.log("Webhook received:", event);
    try {
      switch (event.type) {
        case "payment_intent.succeeded":
         

        const paymentIntent = event.data.object;
          const metadata = paymentIntent.metadata;
          const orderId = metadata.order_id;
          const stripeId = paymentIntent.id;
          // Split the orderId string into an array of IDs
          const orderIds: number[] = orderId
            .split(",")
            .map((id: any) => parseInt(id.trim(), 10));

          // Remove duplicates (if any)
          const uniqueOrderIds = [...new Set(orderIds)];
          
          console.log("uniqueOrderIds:", uniqueOrderIds);


          for (let i = 0; i < uniqueOrderIds.length; i++) {
            let finalOrderID: number = uniqueOrderIds[i];
            await knex("orders")
              .where("id", finalOrderID)
              .update({
                state: "Completed",
                stripe_id: stripeId,
                payment_type: "Credit Card",
              });
          }

          break;
        case "payment_method.attached":
          const paymentMethod = event.data.object;
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      res.json({ received: true });
    } catch (e) {
      res.status(400).json({ msg: e });
    }
  }
);
