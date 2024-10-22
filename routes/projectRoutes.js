const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');


router.post('/projects', projectController.createProject);


router.get('/projects', projectController.getProjects);

router.delete('/projects/:id', projectController.deleteProject);

router.put('/projects/:id', projectController.updateProject);

module.exports = router;