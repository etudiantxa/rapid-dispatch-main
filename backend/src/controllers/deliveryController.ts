import { Request, Response } from 'express';
import Delivery from '../models/Delivery';
import { IUser } from '../models/User';

export const createDelivery = async (req: Request, res: Response) => {
  const { origin, destination, otp } = req.body;
  const vendor = (req.user as any).userId;

  try {
    const delivery = new Delivery({
      vendor,
      origin,
      destination,
      otp,
    });

    await delivery.save();
    res.status(201).json(delivery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getDeliveries = async (req: Request, res: Response) => {
  const vendor = (req.user as any).userId;

  try {
    const deliveries = await Delivery.find({ vendor });
    res.status(200).json(deliveries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
