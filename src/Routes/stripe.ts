import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv"
dotenv.config()

const router = express.Router();

type Product={
    "_id":string;
    "title": string;
    "desc": string;
    "img": string;
    "categories": string[];
    "size": string;       
    "color": string;      
    "price": number;
    "inStock": boolean; 
    "createdAt":Date;
    "amount":number;
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! );

router.post("/payment", async (req, res) => {
    const {products}=req.body
    console.log(products)
try{

    const lineItems=products.map((p:Product)=>({
        price_data:{
            currency:"usd",
            product_data:{
                name:p.title,
                images:[p.img]
            },
            unit_amount:p.price*100
        },
        quantity:p.amount
    }))
    
    const session=await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:"http://localhost:5173/success",
        cancel_url:"http://localhost:5173/cancel"
    })
    res.status(200).send({id:session.id})
}catch(e){
    console.log(e)
    res.status(500).send(e)
}


//   try {
//     const { amount } = req.body;
//     console.log(amount)
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//     });
//     console.log(paymentIntent)

//     res.send({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     res.status(500).send({ error: error });
//   }
});

export default router;
