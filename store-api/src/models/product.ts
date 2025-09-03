import mongoose, { Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  featured?: boolean; //optional
  rating?: number; //optional
  createdAt?: Date; //optional
  company: "ikea" | "liddy" | "caressa" | "marcos"; //restrict to enum values
}
const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: [true, "product name must be provided"],
  },
  price: {
    type: Number,
    required: [true, "product price must be provided"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: '{VALUE} is not supported'
    },
  },
});

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema)
export default Product;
