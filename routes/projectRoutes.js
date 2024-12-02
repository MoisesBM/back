const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');


router.post('/projects', projectController.createProject);
router.get('/projects', projectController.getProjects);
router.delete('/projects/:id', projectController.deleteProject);
router.put('/projects/:id', projectController.updateProject);
router.get('/projects/:id', projectController.getProjectById);

// -------------------------------------------------------
// Rutas para tareas
router.get('/projects/:id/tasks', projectController.getTasksByProjectId);
router.post('/projects/:id/tasks', projectController.createTask);
router.delete('/tasks/:taskId', projectController.deleteTask);

// Ruta para obtener los usuarios asignados a un proyecto
router.get('/projects/:id/users', projectController.getUsersByProjectId);
// Ruta para asignar un usuario a un proyecto
router.post('/projects/:id/users', projectController.assignUserToProject)
// Ruta para eliminar un usuario de un proyecto
router.delete('/projects/:id/users/:userId', projectController.removeUserFromProject);

router.get('/assigned-projects', projectController.getAssignedProjects);
router.post('/tasks/assign', projectController.assignTaskToUser);



module.exports = router;