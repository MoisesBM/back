const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
  user: 'postgres',     
  host: 'localhost',
  database: 'GstWeb',   
  password: 'postgres',  
  port: 5432,
});


app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {

    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    //dsdsd
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error en el registro: ' + error.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {

    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {

      const token = jwt.sign({ username: user.username }, 'secretkey', { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error al hacer login:', error);
    res.status(500).json({ message: 'Error al hacer login' });
  }
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Backend escuchando en http://localhost:3000');
});
