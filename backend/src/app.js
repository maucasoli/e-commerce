import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRouter from './routes/auth.routes.js';
import usersRouter from './routes/users.routes.js';
import panierRouter from './routes/panier.routes.js';
import commandesRouter from './routes/commandes.routes.js';
import ouvragesRouter from './routes/ouvrages.routes.js';
import categoriesRouter from './routes/categories.routes.js';
import listesRouter from './routes/listes.routes.js';

dotenv.config();

const app = express();

// 🛡️ Sécurité
app.use(helmet());

// 🌐 CORS
app.use(cors());

// 📝 JSON parser
app.use(express.json());

// 🪵 Logger
app.use(morgan('dev'));

// 📌 Routes API
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/panier', panierRouter);
app.use('/api/commandes', commandesRouter);
app.use('/api/ouvrages', ouvragesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/listes', listesRouter);

// ⚠️ 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// 🛑 Middleware d’erreurs
app.use((err, req, res, next) => {
  console.error('🔥 Erreur serveur:', err);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

export default app;
