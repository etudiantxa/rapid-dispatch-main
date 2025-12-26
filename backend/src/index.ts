import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import deliveryRoutes from './routes/deliveries';
import batchRoutes from './routes/batches';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/batches', batchRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/batches', batchRoutes);
// Options de connexion MongoDB
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000, // 30s timeout
  retryWrites: true,
};

// Connexion à MongoDB
mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    // Démarrer le serveur seulement après connexion réussie
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB:', err.message);
    process.exit(1);
  });

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});