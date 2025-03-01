import mongoose from "mongoose";
export interface User{
    _id:string;
    username:string;
    email:string;
    password:string;
    isAdmin:boolean;
}
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default mongoose.model("User", UserSchema);
