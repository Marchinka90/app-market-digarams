import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique:true },
  password: { type: String, required: true, minlength: 4 },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
