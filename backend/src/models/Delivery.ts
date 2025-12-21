import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IDelivery extends Document {
  vendor: IUser['_id'];
  origin: string;
  destination: string;
  status: 'pending' | 'in-progress' | 'delivered';
  otp: string;
}

const DeliverySchema: Schema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, required: true, enum: ['pending', 'in-progress', 'delivered'], default: 'pending' },
  otp: { type: String, required: true },
});

export default mongoose.model<IDelivery>('Delivery', DeliverySchema);
