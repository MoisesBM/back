// controllers/proyectosController.js

const { Pool } = require('pg');
const pool = new Pool(require('../config/db'));

// Crear un proyecto asociado al usuario
exports.crearProyecto = async (req, res) => {
  const { nombre, descripcion, fecha, username } = req.body;

  try {
    // Obtenemos el ID del usuario a partir del username
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userId = userResult.rows[0].id;

    // Insertamos el nuevo proyecto asociado al ID del usuario
    const result = await pool.query(
      'INSERT INTO proyectos (nombre, descripcion, fecha, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, descripcion, fecha, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    res.status(500).json({ message: 'Error al crear el proyecto' });
  }
};

// // Obtener proyectos asociados a un usuario
// exports.obtenerProyectos = async (req, res) => {
//   const { username } = req.params;

//   try {
//     const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ message: 'Usuario no encontrado' });
//     }

//     const userId = userResult.rows[0].id;

//     // Obtenemos todos los proyectos del usuario
//     const proyectos = await pool.query('SELECT * FROM proyectos WHERE user_id = $1', [userId]);

//     res.json(proyectos.rows);
//   } catch (error) {
//     console.error('Error al obtener proyectos:', error);
//     res.status(500).json({ message: 'Error al obtener proyectos' });
//   }
// };
