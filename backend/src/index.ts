import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import deliveryRoutes from './routes/deliveries';
import batchRoutes from './routes/batches';

dotenv.config();

// Vérifications des variables d'environnement
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined.');
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/batches', batchRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

// Options de connexion MongoDB
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000, // 30s timeout
  retryWrites: true,
};

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    // Démarrer le serveur seulement après connexion réussie
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB:', err.message);
    process.exit(1);
  });

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
