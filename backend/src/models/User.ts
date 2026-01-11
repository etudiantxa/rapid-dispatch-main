import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  password?: string;
  role: 'vendor' | 'courier';
  vehicleType?: 'Scooter' | 'Moto' | 'Voiture';
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createPasswordResetToken: () => string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['vendor', 'courier'], required: true },
  vehicleType: { type: String, enum: ['Scooter', 'Moto', 'Voiture'] },
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true,
});

// Pre-save middleware to hash password
userSchema.pre<IUser>('save', async function (next: import('mongoose').PreSaveMiddlewareFunction<IUser>) {
  // Only run this function if password was actually modified
  if (!this.isModified('password') || !this.password) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// Method to generate password reset token
userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token expires in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


export default model<IUser>('User', userSchema);
