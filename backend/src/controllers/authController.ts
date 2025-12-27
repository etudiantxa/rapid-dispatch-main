import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { sendEmail } from '../services/email.service';

export const register = async (req: Request, res: Response) => {
  const { name, phone, email, password, role, vehicleType } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, phone, email, password, role, vehicleType });
    await user.save();

    // Do not select password in the response
    const userResponse = user.toObject();
    delete userResponse.password;

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password!);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Do not select password in the response
    const userResponse = user.toObject();
    delete userResponse.password;

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    res.status(200).json({ token, user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getMe = async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user?.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };


export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User with that email does not exist.' });
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        const message = `Forgot your password? Click the link to reset it: ${resetURL}\nIf you didn't forget your password, please ignore this email!`;

        try {
            await sendEmail({
                to: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                text: message,
            });

            res.status(200).json({ status: 'success', message: 'Token sent to email!' });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            res.status(500).json({ message: 'There was an error sending the email. Try again later!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired.' });
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, {
          expiresIn: '24h',
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({ token, user: userResponse, message: 'Password successfully reset.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
