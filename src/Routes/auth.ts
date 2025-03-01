import express from "express";
import User from "../models/User";
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'
const router = express.Router();
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY!).toString(),
  });
  try {
    await newUser.save();
    console.log(newUser);
    res.status(201).send(newUser);
  } catch (e) {
    console.log(e);
  }
})
router.post('/login',async (req,res)=>{
    const {username,password} =req.body
    try{
    const user=await User.findOne({username:username})
    if(user!=null && user.password && CryptoJS.AES.decrypt(user.password,process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)===password){
        const {password,...others}=user.toObject()
        const accessToken=jwt.sign({
            id:user._id,isAdmin:user.isAdmin
        },process.env.JWT_SECRET_KEY!,{expiresIn:'3d'})
        res.status(200).send({...others,accessToken})
    }
    else{
        res.status(401).send("Wrong Credentials")
    }
    }
    catch(e){
        res.status(500).send(e)
    }
})
export default router
