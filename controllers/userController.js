const { Pool } = require('pg');
const pool = new Pool(require('../config/db'));

exports.getUserProfile = async (req, res) => {
    const username = req.query.username; // Obtener el username de los parámetros de consulta
    const email = req.query.email; // Obtener el email de los parámetros de consulta
    if (!username || !email) {
      return res.status(400).json({ message: 'Username y email son requeridos' });
    }
    try {
      const result = await pool.query('SELECT username, email FROM users WHERE username = $1 AND email = $2', [username, email]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      res.status(500).json({ message: 'Error al obtener los datos del usuario' });
    }
  };