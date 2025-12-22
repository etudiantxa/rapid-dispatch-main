import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IDelivery extends Document {
  vendor: IUser['_id'];
  origin: string;
  destination: string; // Quartier
  status: 'pending' | 'in-progress' | 'delivered';
  otp: string;
  clientName: string;
  clientPhone: string;
  deliveryAddress: string;
  packageDescription?: string;
  itemCount: number;
  estimatedValue?: number;
  specialInstructions?: string;
}

const DeliverySchema: Schema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true }, // Quartier
  status: { type: String, required: true, enum: ['pending', 'in-progress', 'delivered'], default: 'pending' },
  otp: { type: String, required: true },
  clientName: { type: String, required: true },
  clientPhone: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  packageDescription: { type: String },
  itemCount: { type: Number, required: true, default: 1 },
  estimatedValue: { type: Number },
  specialInstructions: { type: String },
});

export default mongoose.model<IDelivery>('Delivery', DeliverySchema);
