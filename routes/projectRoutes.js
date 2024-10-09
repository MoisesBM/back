// Carlos

const express = require('express');
const { createProject, deleteProject } = require('../controllers/projectController');
const router = express.Router();

// Ruta para crear un proyecto
router.post('/projects', createProject);

// Ruta para eliminar un proyecto
router.delete('/projects/:id', deleteProject);

module.exports = router;
