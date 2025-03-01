import express from "express";
import {verifyTokenAndAdmin, verifyTokenAndAuthorization} from "../utilities/verifyToken";
import User from "../models/User";
const router = express.Router();
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY!
    ).toString();
  }
  try {
    const updatedUser =await User.findByIdAndUpdate(req.params.id, {
      $set:req.body
    },{new:true});
    res.status(200).send(updatedUser);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.delete('/:id',verifyTokenAndAuthorization,async (req,res)=>{
    try {
        const deletedUser =await User.findByIdAndDelete(req.params.id) 
        res.status(200).send(deletedUser);
      } catch (e) {
        res.status(500).send(e);
      }
})
router.get('/:id',verifyTokenAndAdmin,async (req,res)=>{
    try {
        const user =await User.findById(req.params.id) 
        const {password,...others}=user!.toObject()
        res.status(200).send(others);
      } catch (e) {
        res.status(500).send(e);
      }
})
router.get('/',verifyTokenAndAdmin,async (req,res)=>{
    const query=req.query.new
    try {
        
        const users =query?await User.find().sort({createdAt:-1}).limit(5): await User.find() 
        res.status(200).send(users);
      } catch (e) {
        res.status(500).send(e);
      }
})
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });
export default router;
