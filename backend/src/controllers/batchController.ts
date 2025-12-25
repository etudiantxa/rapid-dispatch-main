import { Request, Response } from 'express';
import Batch from '../models/Batch';
import Delivery from '../models/Delivery';

// This controller is simplified for now.
// In a real application, you'd have more complex logic for batch creation.

export const getCourierBatches = async (req: Request, res: Response) => {
  const courierId = req.user?.userId;
  try {
    const batches = await Batch.find({ courier: courierId }).populate('deliveries');
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch batches.' });
  }
};

export const validateOtp = async (req: Request, res: Response) => {
  const { deliveryId, otp } = req.body;
  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found.' });
    }
    if (delivery.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
    delivery.status = 'delivered';
    await delivery.save();
    res.status(200).json({ message: 'Delivery confirmed!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to validate OTP.' });
  }
};
