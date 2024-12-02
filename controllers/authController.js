const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const pool = new Pool(require('../config/db'));

const handleDatabaseError = (res, error) => {
  console.error(error);
  res.status(500).json({ message: 'Error en la base de datos: ' + error.message });
};

exports.register = async (req, res) => {
  const { username, password, email, acceptTerms } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const emailExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id',
      [username, hashedPassword, email]
    );
    const userId = userResult.rows[0].id;

    const accepted = acceptTerms === true || acceptTerms === 'true' ? 0 : 1;
    await pool.query(
      'INSERT INTO user_terms_conditions (user_id, accepted, accepted_at) VALUES ($1, $2, NOW())',
      [userId, accepted]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    handleDatabaseError(res, error);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    res.json({
      message: 'Inicio de sesión exitoso',
      userId: user.id,
      username: user.username,
    });
  } catch (error) {
    handleDatabaseError(res, error);
  }
};
