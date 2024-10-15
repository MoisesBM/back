const express = require('express');
const router = express.Router();
const { crearProyecto } = require('../controllers/proyectosController.js'); 

// POST /api/proyectos
router.post('/', crearProyecto);

module.exports = router;
