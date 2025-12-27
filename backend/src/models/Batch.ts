import { Schema, model, Document } from 'mongoose';

export interface IBatch extends Document {
  courier: Schema.Types.ObjectId;
  deliveries: Array<Schema.Types.ObjectId>;
  status: 'assigned' | 'completed';
}

const batchSchema = new Schema<IBatch>({
  courier: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  deliveries: [{ type: Schema.Types.ObjectId, ref: 'Delivery', required: true }],
  status: { type: String, enum: ['assigned', 'completed'], default: 'assigned' },
}, { timestamps: true });

export default model<IBatch>('Batch', batchSchema);
