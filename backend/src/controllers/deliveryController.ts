import { Request, Response } from 'express';
import Delivery from '../models/Delivery';
import { sendSms } from '../services/smsService';

const generateOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const createDelivery = async (req: Request, res: Response) => {
  const {
    origin,
    destination,
    clientName,
    clientPhone,
    deliveryAddress,
    packageDescription,
    itemCount,
    estimatedValue,
    specialInstructions,
  } = req.body;
  const vendor = req.user?.userId;

  try {
    const otp = generateOtp();

    const delivery = new Delivery({
      vendor,
      origin,
      destination,
      otp,
      clientName,
      clientPhone,
      deliveryAddress,
      packageDescription,
      itemCount,
      estimatedValue,
      specialInstructions,
    });

    const smsMessage = `Votre code de confirmation pour la livraison TIAK-TIAK est : ${otp}`;
    await sendSms(clientPhone, smsMessage);

    await delivery.save();

    res.status(201).json(delivery);
  } catch (error) {
    console.error('Error creating delivery:', error);
    if (error instanceof Error && error.message.includes('SMS')) {
      return res.status(500).json({ message: 'Delivery created, but failed to send OTP SMS.' });
    }
    res.status(500).json({ message: 'Something went wrong while creating the delivery.' });
  }
};

export const getDeliveries = async (req: Request, res: Response) => {
  const vendor = req.user?.userId;

  try {
    const deliveries = await Delivery.find({ 
      vendor: vendor as any });
    res.status(200).json(deliveries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
