const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const transporter = require('../config/emailConfig');

const pool = new Pool(require('../config/db'));

exports.register = async (req, res) => {
  const { username, password, email, acceptTerms } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id', [username, hashedPassword, email]);

    const userId = userResult.rows[0].id;
    await pool.query('INSERT INTO user_terms_conditions (user_id, accepted) VALUES ($1, $2)', [userId, acceptTerms]);

    res.status(200).json({ message: 'Usuario registrado y términos aceptados' });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
