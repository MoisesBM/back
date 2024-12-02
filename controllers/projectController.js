const { Pool } = require('pg');
const pool = new Pool(require('../config/db'));

exports.createProject = async (req, res) => {
  const { name, description, date, newdate} = req.body;
  const username = req.body.username;

  try {
    console.log("Creando proyecto para el usuario:", username);
    console.log("Nuevo campo:", newdate);

    const result = await pool.query(
      'INSERT INTO projects (name, description, date, username) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, date, username]
    );


    return res.status(201).json({
      message: 'Proyecto creado exitosamente',
      project: result.rows[0], 
    });

  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    return res.status(500).json({ message: 'Error al crear el proyecto' });
  }
};


exports.getProjects = async (req, res) => {
  const username = req.query.username;  

  if (!username) {
    return res.status(400).json({ message: 'El nombre de usuario es requerido' });
  }

  try {
    const result = await pool.query('SELECT * FROM projects WHERE username = $1', [username]);
    console.log("Obteniendo proyectos para el usuario:", username);
    
    return res.status(200).json(result.rows);

  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    return res.status(500).json({ message: 'Error al obtener proyectos' });
  }
};

exports.deleteProject = async (req, res) => {
  const projectId = req.params.id;
  const username = req.query.username; 

  try {
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND username = $2 RETURNING *',
      [projectId, username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado o no autorizado' });
    }

    res.status(200).json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el proyecto' });
  }
};

exports.updateProject = async (req, res) => {
  const projectId = req.params.id;
  const { name, description, date } = req.body;
  const username = req.body.username;

  try {
    const result = await pool.query(
      'UPDATE projects SET name = $1, description = $2, date = $3 WHERE id = $4 AND username = $5 RETURNING *',
      [name, description, date, projectId, username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado o no autorizado' });
    }

    res.status(200).json({ project: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el proyecto' });
  }
};
//-------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------

exports.getProjectById = async (req, res) => {
  const projectId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el proyecto:', error);
    res.status(500).json({ message: 'Error al obtener el proyecto' });
  }
};

exports.getTasksByProjectId = async (req, res) => {
  const projectId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE project_id = $1', [projectId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas' });
  }
};

exports.createTask = async (req, res) => {
  const projectId = req.params.id;
  const { name, description, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (name, description, status, project_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, status, projectId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(500).json({ message: 'Error al crear la tarea' });
  }
};

exports.updateTask = async (req, res) => {
  const taskId = req.params.taskId;
  const { name, description, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET name = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
      [name, description, status, taskId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
};

exports.deleteTask = async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(200).json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(500).json({ message: 'Error al eliminar la tarea' });
  }
};

exports.getUsersByProjectId = async (req, res) => {
  const projectId = req.params.id;
  try {
    const result = await pool.query(
      'SELECT users.username, users.email FROM users JOIN project_users ON users.id = project_users.user_id WHERE project_users.project_id = $1',
      [projectId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};
exports.assignUserToProject = async (req, res) => {
  const projectId = req.params.id;
  const { username } = req.body;
  try {
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const userId = userResult.rows[0].id;

    const existingAssignment = await pool.query(
      'SELECT * FROM project_users WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );
    if (existingAssignment.rows.length > 0) {
      return res.status(409).json({ message: 'El usuario ya está asignado a este proyecto.' });
    }

    const result = await pool.query(
      'INSERT INTO project_users (project_id, user_id) VALUES ($1, $2) RETURNING *',
      [projectId, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al asignar el usuario al proyecto:', error);
    res.status(500).json({ message: 'Error al asignar el usuario al proyecto' });
  }
};

exports.removeUserFromProject = async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.params.userId;

  if (!projectId || !userId) {
    return res.status(400).json({ message: 'El projectId y el userId son obligatorios' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM project_users WHERE project_id = $1 AND user_id = $2 RETURNING *',
      [projectId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado en el proyecto' });
    }
    res.status(200).json({ message: 'Usuario eliminado del proyecto exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario del proyecto:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario del proyecto' });
  }
};

exports.getAssignedProjects = async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ message: 'El nombre de usuario es requerido' });
  }

  try {
    // Obtener el ID del usuario a partir del nombre de usuario
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const userId = userResult.rows[0].id;

    // Obtener los proyectos asignados al usuario junto con el nombre del creador
    const assignedProjectsResult = await pool.query(
      `SELECT p.id, p.name, p.description, p.date, p.username AS creator
       FROM projects p
       JOIN project_users pu ON p.id = pu.project_id
       WHERE pu.user_id = $1`,
      [userId]
    );

    res.status(200).json(assignedProjectsResult.rows);
  } catch (error) {
    console.error('Error al obtener los proyectos asignados:', error);
    res.status(500).json({ message: 'Error al obtener los proyectos asignados' });
  }
};
exports.assignTaskToUser = async (req, res) => {
  const { taskId, userId } = req.body; 

  if (!taskId || !userId) {
    return res.status(400).json({ message: 'El taskId y el userId son obligatorios' });
  }

  try {
    const result = await pool.query(
      'UPDATE tasks SET assigned_user_id = $1 WHERE id = $2 RETURNING *',
      [userId, taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al asignar la tarea al usuario (BACKEND):', error);
    res.status(500).json({ message: 'Error al asignar la tarea al usuario' });
  }
};
