const { Pool } = require('pg');
const pool = new Pool(require('../config/db'));

exports.createProject = async (req, res) => {
  const { name, description, date } = req.body;
  const username = req.body.username;

  try {
    console.log("Creando proyecto para el usuario:", username);

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