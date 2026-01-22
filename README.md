# LivreGourmand

## 📖 Description

**LivreGourmand** est une plateforme de commerce électronique spécialisée dans la vente de livres de cuisine. Elle offre une expérience complète aux internautes pour rechercher, consulter et acheter des ouvrages culinaires, avec des fonctionnalités avancées de gestion de panier, commandes, avis et listes de cadeaux.

![Home page](https://github.com/GuyotJean/LivreGourmand/blob/main/docs/home.png "Home page")

### Fonctionnalités principales

- 🔍 **Recherche avancée** : Recherche par titre, auteur, ISBN, catégorie et prix
- 🛒 **Gestion du panier** : Ajout, modification et suppression d'articles
- 💳 **Paiement sécurisé** : Intégration Stripe pour les paiements en ligne (CAD)
- ⭐ **Système d'avis** : Les clients peuvent laisser des avis et des notes sur les livres achetés
- 📋 **Listes de cadeaux** : Création et gestion de listes de souhaits partageables
- 💬 **Chatbot intelligent** : Assistant virtuel alimenté par IA (Ollama) pour répondre aux questions des clients
- 👥 **Gestion des utilisateurs** : Système d'authentification avec rôles (client, éditeur, gestionnaire, administrateur)
- 📦 **Back-office** : Interface de gestion pour les éditeurs, gestionnaires et administrateurs

## 🛠️ Technologies utilisées

### Frontend
- **React 18.2.0** - Bibliothèque JavaScript pour l'interface utilisateur
- **React Router DOM 6.14.1** - Routage côté client
- **Axios 1.5.0** - Client HTTP pour les requêtes API
- **Bootstrap 5.3.2** - Framework CSS pour le design responsive
- **Vite 5.2.0** - Outil de build et serveur de développement
- **Stripe React** - Intégration Stripe pour les paiements

### Backend
- **Node.js** - Environnement d'exécution JavaScript
- **Express 5.1.0** - Framework web pour Node.js
- **MySQL2 3.15.2** - Driver MySQL pour Node.js
- **JWT (jsonwebtoken 9.0.2)** - Authentification par tokens
- **Bcrypt 6.0.0** - Hachage des mots de passe
- **Stripe 20.0.0** - API de paiement
- **Express Validator 7.3.1** - Validation des données
- **Helmet 8.1.0** - Sécurisation des en-têtes HTTP
- **Morgan 1.10.1** - Logger HTTP
- **CORS 2.8.5** - Gestion des requêtes cross-origin
- **Ollama** - Serveur LLM local pour le chatbot IA
- **node-fetch** - Client HTTP pour les requêtes au LLM

### Base de données
- **MySQL** - Système de gestion de base de données relationnelle

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure)
- **npm** (version 9 ou supérieure)
- **MySQL** (version 8.0 ou supérieure)
- **Git**
- **Ollama** (pour le chatbot IA) - [Installation](#-installation-dollama-optionnel)

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/maucasoli/e-commerce.git
cd e-commerce
```

### 2. Configuration de la base de données

1. Créez une base de données MySQL :

```sql
CREATE DATABASE livre_gourmand CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Importez le schéma de la base de données :

```bash
cd backend
mysql -u votre_utilisateur -p livre_gourmand < livre_gourmand.sql
```

### 3. Configuration du backend

1. Naviguez vers le dossier backend :

```bash
cd backend
```

2. Installez les dépendances :

```bash
npm install
```

3. Créez un fichier `.env` à la racine du dossier `backend` (vous pouvez copier `.env.example`) :

```env
# Base de données
DB_HOST=localhost
DB_USER=votre_utilisateur_mysql
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=livre_gourmand

# JWT
JWT_SECRET=votre_secret_jwt_super_securise

# Stripe
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret

# LLM (Ollama) - Optionnel, pour le chatbot
LLM_API_URL=http://localhost:11434/api/generate

# Serveur
PORT=3000
NODE_ENV=development
```

### 4. Configuration du frontend

1. Naviguez vers le dossier frontend :

```bash
cd frontend
```

2. Installez les dépendances :

```bash
npm install
```

3. Créez un fichier `.env` à la racine du dossier `frontend` (vous pouvez copier `.env.example`) :

```env
# API Backend
VITE_API_BASE_URL=http://localhost:3000/api

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_stripe
```

### 5. Installation d'Ollama (Optionnel)

Le chatbot utilise Ollama pour fournir des réponses intelligentes. Cette étape est optionnelle - sans Ollama, le chatbot ne fonctionnera pas, mais le reste de l'application fonctionnera normalement.

#### Installation d'Ollama

1. **Téléchargez et installez Ollama** :
   - **Windows** : Téléchargez depuis [ollama.com/download](https://ollama.com/download)
   - **macOS** : `brew install ollama` ou téléchargez depuis [ollama.com/download](https://ollama.com/download)
   - **Linux** : `curl -fsSL https://ollama.com/install.sh | sh`

2. **Démarrez le serveur Ollama** :
   ```bash
   ollama serve
   ```

3. **Téléchargez le modèle gpt-oss** :
   Dans un nouveau terminal :
   ```bash
   ollama pull gpt-oss
   ```

4. **Vérifiez l'installation** :
   ```bash
   ollama list
   ```
   Vous devriez voir `gpt-oss` dans la liste des modèles.

> **Note** : Le serveur Ollama doit être en cours d'exécution pour que le chatbot fonctionne. Par défaut, il écoute sur `http://localhost:11434`.

## ▶️ Démarrage

### Démarrer le serveur backend

```bash
cd backend
npm run dev
```

Le serveur backend sera accessible sur `http://localhost:3000`

### Démarrer le serveur frontend

Dans un nouveau terminal :

```bash
cd frontend
npm run dev
```

Le serveur frontend sera accessible sur `http://localhost:5173` (ou le port indiqué par Vite)

## 📁 Structure du projet

```
LivreGourmand/
├── backend/                          # API Node.js/Express
│   ├── src/
│   │   ├── controllers/             # Contrôleurs pour chaque ressource
│   │   ├── middlewares/             # Middlewares d'authentification et autorisation
│   │   ├── routes/                  # Définition des routes API
│   │   ├── validators/              # Validation des données
│   │   ├── db.js                    # Configuration de la base de données
│   │   ├── app.js                   # Configuration Express
│   │   └── server.js                # Point d'entrée du serveur
│   ├── docs/                        # Documentation (diagrammes E-R, UML, etc.)
│   ├── livre_gourmand.sql           # Schéma de la base de données avec seeds
│   ├── LivreGourmand.postman_collection.json  # Collection Postman pour tester l'API
│   ├── .env.example                 # Exemple de configuration
│   └── package.json
│
├── frontend/                        # Application React
│   ├── src/
│   │   ├── api/                     # Configuration Axios
│   │   ├── components/              # Composants réutilisables (ChatBox, etc.)
│   │   ├── context/                 # Context API (Auth, Cart)
│   │   ├── pages/                   # Pages de l'application
│   │   ├── services/                # Services API (chatService, etc.)
│   │   ├── App.jsx                  # Composant principal
│   │   └── main.jsx                 # Point d'entrée
│   ├── public/                      # Assets statiques (images, favicon)
│   ├── .env.example                 # Exemple de configuration
│   ├── index.html                   # Point d'entrée HTML
│   └── package.json
│
├── .gitignore                       # Fichiers à ignorer par Git
└── README.md                        # Documentation du projet
```

## 🔐 Rôles et permissions

L'application gère différents rôles avec des permissions spécifiques :

- **Client** : Recherche, consultation, achat, avis, listes de cadeaux
- **Éditeur** : Gestion de ses propres ouvrages
- **Gestionnaire** : Gestion du catalogue, stock, commandes
- **Administrateur** : Accès complet à toutes les fonctionnalités

## 📝 Scripts disponibles

### Backend

- `npm run dev` - Démarre le serveur en mode développement avec nodemon
- `npm start` - Démarre le serveur en mode production

### Frontend

- `npm run dev` - Démarre le serveur de développement Vite
- `npm run build` - Compile l'application pour la production
- `npm run preview` - Prévisualise la version de production

## 🌐 API Endpoints

Les principales routes de l'API sont :

- `/api/auth` - Authentification (login, register)
- `/api/ouvrages` - Gestion des ouvrages
- `/api/panier` - Gestion du panier
- `/api/commandes` - Gestion des commandes
- `/api/payment` - Paiements Stripe
- `/api/listes` - Listes de cadeaux
- `/api/users` - Gestion des utilisateurs
- `/api/chat` - Chatbot IA (Ollama)

Pour plus de détails, consultez la collection Postman fournie dans `backend/LivreGourmand.postman_collection.json`.

## 🤝 Contribution

Ce projet a été développé dans le cadre d'un projet académique.

## 👥 Auteurs

- **Mauricio Oliveira** 💻 GitHub : @maucasoli
- **Jean Guyot** 💻 GitHub : @GuyotJean
