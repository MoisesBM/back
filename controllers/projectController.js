const { Pool } = require('pg');
const pool = new Pool(require('../config/db'));

exports.createProject = async (req, res) => {
  const { name, description, date } = req.body;
  const userId = req.user.id; // El ID del usuario autenticado se extrae del token

  try {
    const result = await pool.query(
      'INSERT INTO projects (name, description, date, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, date, userId]
    );

    res.status(201).json({
      message: 'Proyecto creado exitosamente',
      project: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el proyecto' });
  }
};
