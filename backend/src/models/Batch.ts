import mongoose, { Schema, Document } from 'mongoose';
import { IDelivery } from './Delivery';
import { IUser } from './User';

export interface IBatch extends Document {
  courier: IUser['_id'];
  deliveries: IDelivery['_id'][];
  status: 'assigned' | 'in-progress' | 'completed';
}

const BatchSchema: Schema = new Schema({
  courier: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  deliveries: [{ type: Schema.Types.ObjectId, ref: 'Delivery', required: true }],
  status: { type: String, required: true, enum: ['assigned', 'in-progress', 'completed'], default: 'assigned' },
});

export default mongoose.model<IBatch>('Batch', BatchSchema);
