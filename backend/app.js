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
const PORT = process.env.PORT || 3000;

// 🛡️ Sécurité de base
app.use(helmet());

// 🌐 Autoriser le front-end à faire des requêtes
app.use(cors());

// 📝 Pour lire le JSON dans le body
app.use(express.json());

// 🪵 Logger les requêtes HTTP (pratique en dev)
app.use(morgan('dev'));

// 📌 Routes API
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/panier', panierRouter);
app.use('/api/commandes', commandesRouter);
app.use('/api/ouvrages', ouvragesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/listes', listesRouter);

// ⚠️ 404 - Route non trouvée
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// 🛑 Middleware de gestion d’erreurs global
app.use((err, req, res, next) => {
  console.error('🔥 Erreur serveur:', err);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

// 🚀 Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
