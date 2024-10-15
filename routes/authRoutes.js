const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-token', authController.verifyToken);
//router.post('/crearProyecto', proyectosController.crearProyecto);



module.exports = router;
