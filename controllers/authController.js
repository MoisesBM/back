const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const transporter = require('../config/emailConfig');

const pool = new Pool(require('../config/db'));

// Registro de usuarios
exports.register = async (req, res) => {
  const { username, password, email, acceptTerms } = req.body;

  try {
    // Verificar si el usuario ya existe
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el usuario en la base de datos
    const userResult = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id',
      [username, hashedPassword, email]
    );

    const userId = userResult.rows[0].id;

    // Registrar la aceptación de términos y condiciones
    await pool.query(
      'INSERT INTO user_terms_conditions (user_id, accepted) VALUES ($1, $2)',
      [userId, acceptTerms]
    );

    res.status(200).json({ message: 'Usuario registrado y términos aceptados' });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Inicio de sesión de usuarios
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Crear el token JWT
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, message: 'Inicio de sesión exitoso' });
  } catch (err) {
    console.error('Error en el inicio de sesión:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Verificación de token
exports.verifyToken = (req, res) => {
  const token = req.header('auth-token');

  if (!token) return res.status(401).json({ message: 'Acceso denegado' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    res.status(200).json({ message: 'Token verificado' });
  } catch (err) {
    res.status(400).json({ message: 'Token inválido' });
  }
};
