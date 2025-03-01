import express from "express";
const router = express.Router();
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY!);

export default router;
