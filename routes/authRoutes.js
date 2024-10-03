const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para el registro
router.post('/register', authController.register);

// Ruta para el login
router.post('/login', authController.login);

// Ruta para la verificación de token
router.post('/verify-token', authController.verifyToken);

module.exports = router;
