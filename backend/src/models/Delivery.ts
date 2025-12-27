import { Schema, model, Document } from 'mongoose';

export interface IDelivery extends Document {
  vendor: Schema.Types.ObjectId;
  courier?: Schema.Types.ObjectId;
  origin: string;
  destination: string;
  status: 'pending' | 'in_progress' | 'delivered';
  otp: string;
  clientName: string;
  clientPhone: string;
  deliveryAddress: string;
  packageDescription: string;
  itemCount: number;
  estimatedValue: string;
  specialInstructions: string;
}

const deliverySchema = new Schema<IDelivery>({
  vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courier: { type: Schema.Types.ObjectId, ref: 'User' },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'delivered'], default: 'pending' },
  otp: { type: String, required: true },
  clientName: { type: String, required: true },
  clientPhone: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  packageDescription: { type: String },
  itemCount: { type: Number, default: 1 },
  estimatedValue: { type: String },
  specialInstructions: { type: String },
}, { timestamps: true });

export default model<IDelivery>('Delivery', deliverySchema);
