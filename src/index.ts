import express from 'express'
const app=express()
import mongoose from "mongoose"
import dotenv from 'dotenv'
import authRouter from './Routes/auth'
import productsRouter from './Routes/product'
import cartsRouter from './Routes/cart'
import ordersRouter from './Routes/order'
import usersRouter from './Routes/user'
import cors from "cors"

dotenv.config()
if (process.env.MONGO_URL)
    mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected")).catch(e=>console.log(e))
app.use(cors())
app.use(express.json())
app.use('/auth',authRouter)
app.use('/users',usersRouter)
app.use('/products',productsRouter)
app.use('/carts',cartsRouter)
app.use('/orders',ordersRouter)
app.listen(process.env.PORT,()=>console.log("server has started"))