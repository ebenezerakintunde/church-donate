import mongoose, { Schema, Document, Model } from "mongoose";
import { AdminStatus } from "@/types/admin";

export interface IAdmin extends Document {
  _id: string;
  email: string;
  password?: string;
  name: string;
  status: AdminStatus;
  inviteToken?: string;
  inviteTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: false,
      validate: {
        validator: function (v: string) {
          // Only validate length if password is provided
          if (!v) return true;
          return v.length >= 8;
        },
        message: "Password must be at least 8 characters",
      },
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(AdminStatus),
      default: AdminStatus.PENDING,
    },
    inviteToken: {
      type: String,
      required: false,
    },
    inviteTokenExpiry: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const Admin =
  (mongoose.models.Admin as Model<IAdmin>) ||
  mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
export { AdminStatus };
