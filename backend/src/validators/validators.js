import { body, param } from 'express-validator';

// ----------------- Auth -----------------
export const registerValidator = [
  body('nom')
    .notEmpty().withMessage('Le nom est obligatoire')
    .isLength({ max: 255 }).withMessage('Le nom est trop long'),
  body('email')
    .isEmail().withMessage('Email invalide')
    .isLength({ max: 255 }).withMessage('Email trop long'),
  body('password')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

export const loginValidator = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est obligatoire')
];

// ----------------- Categories -----------------
export const createCategoryValidator = [
  body('nom')
    .notEmpty().withMessage('Le nom est obligatoire')
    .isLength({ max: 255 }).withMessage('Le nom est trop long'),
  body('description')
    .isString().withMessage('Description invalide')
];

// ----------------- Commandes -----------------
export const createCommandeValidator = [
  body('items')
    .isArray({ min: 1 }).withMessage('La commande doit contenir au moins un item'),
  body('items.*.ouvrage_id')
    .isInt({ gt: 0 }).withMessage('ID d\'ouvrage invalide'),
  body('items.*.quantite')
    .isInt({ gt: 0 }).withMessage('Quantité invalide')
];

// ----------------- Listes -----------------
export const createListeValidator = [
  body('nom')
    .notEmpty().withMessage('Le nom de la liste est obligatoire')
    .isLength({ max: 255 }).withMessage('Nom trop long'),
  body('items')
    .isArray({ min: 1 }).withMessage('La liste doit contenir au moins un item'),
  body('items.*.ouvrage_id')
    .isInt({ gt: 0 }).withMessage('ID d\'ouvrage invalide'),
  body('items.*.quantite_souhaitee')
    .isInt({ gt: 0 }).withMessage('Quantité souhaitée invalide')
];

// ----------------- Ouvrages -----------------
export const createOuvrageValidator = [
  body('titre')
    .notEmpty().withMessage('Le titre est obligatoire')
    .isLength({ max: 255 }).withMessage('Titre trop long'),
  body('auteur')
    .optional()
    .isLength({ max: 255 }).withMessage('Auteur trop long'),
  body('isbn')
    .optional()
    .isLength({ max: 50 }).withMessage('ISBN trop long'),
  body('prix')
    .isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('stock')
    .isInt({ min: 0 }).withMessage('Stock invalide'),
  body('categorie_id')
    .optional()
    .isInt({ gt: 0 }).withMessage('Catégorie invalide')
];

export const addAvisValidator = [
  body('note')
    .isInt({ min: 1, max: 5 }).withMessage('Note doit être entre 1 et 5'),
  body('commentaire')
    .optional()
    .isString().withMessage('Commentaire invalide')
];

// ----------------- Panier -----------------
export const addItemValidator = [
  body('ouvrage_id')
    .isInt({ gt: 0 }).withMessage('ID d\'ouvrage invalide'),
  body('quantite')
    .isInt({ gt: 0 }).withMessage('Quantité invalide')
];

export const updateItemValidator = [
  param('id')
    .isInt({ gt: 0 }).withMessage('ID de l\'item invalide'),
  body('quantite')
    .isInt({ gt: 0 }).withMessage('Quantité invalide')
];

// ----------------- Users -----------------
export const updateUserValidator = [
  body('nom')
    .optional()
    .isLength({ max: 255 }).withMessage('Nom trop long'),
  body('email')
    .optional()
    .isEmail().withMessage('Email invalide')
];
