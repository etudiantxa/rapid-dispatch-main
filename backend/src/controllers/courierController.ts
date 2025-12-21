import { Request, Response } from 'express';
import Batch from '../models/Batch';
import Delivery from '../models/Delivery';

export const getAssignedBatches = async (req: Request, res: Response) => {
  const courier = (req.user as any).userId;

  try {
    const batches = await Batch.find({ courier }).populate('deliveries');
    res.status(200).json(batches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const validateOtp = async (req: Request, res: Response) => {
  const { deliveryId, otp } = req.body;

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if (delivery.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    delivery.status = 'delivered';
    await delivery.save();

    res.status(200).json({ message: 'Delivery completed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
