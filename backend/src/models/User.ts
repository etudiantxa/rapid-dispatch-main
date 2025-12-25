import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  password?: string;
  role: 'vendor' | 'courier';
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['vendor', 'courier'], required: true },
});

export default model<IUser>('User', userSchema);
