const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticate = require('../middleware/authenticate');

// Ruta para crear un nuevo proyecto
router.post('/', authenticate, projectController.createProject);

// Ruta para obtener proyectos del usuario autenticado
router.get('/', authenticate, projectController.getProjects);

module.exports = router;