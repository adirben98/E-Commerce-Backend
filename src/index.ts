import express from 'express'
const app=express()
import mongoose from "mongoose"
import dotenv from 'dotenv'
import authRouter from './Routes/auth'
dotenv.config()
if (process.env.MONGO_URL)
    mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected")).catch(e=>console.log(e))
app.use(express.json())
app.use('/auth',authRouter)
app.listen(process.env.PORT,()=>console.log("server has started"))