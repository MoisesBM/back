const express = require('express');
const cors = require('cors');
const routes = require('./routes/authRoutes'); 
const proyectosRoutes = require('./routes/proyectos');  // Nueva importación para proyectos

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', routes);

// Nueva ruta para manejar proyectos
//app.use('/api/proyectos', proyectosRoutes); // Usar las rutas de proyectos

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});





/**const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
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


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'moisesbuitrago201@gmail.com', 
    pass: 'vhuj ndov yuds pqrq' 
  }
});

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, hashedPassword, email]);
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

      const token = jwt.sign({ username: user.username }, 'secretkey', { expiresIn: '10m' });


      const mailOptions = {
        from: 'tuemail@gmail.com',
        to: user.email,
        subject: 'Token de acceso',
        text: `Tu token de acceso es: ${token}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ message: 'Error al enviar correo: ' + error.message });
        } else {
          res.json({ message: 'Correo con token enviado exitosamente' });
        }
        console.log('Correo enviado: ' + info.response);
        console.log(info.accepted);
      });

    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error al hacer login:', error);
    res.status(500).json({ message: 'Error al hacer login' });
  }
});
app.post('/verify-token', (req, res) => {
  const { token } = req.body;

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    } else {
      res.json({ message: 'Token verificado correctamente', user: decoded.username });
    }
  });
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("El servidor esta listo y cargado!");
  }
});


// Iniciar el servidor
app.listen(3000, () => {
  console.log('Backend escuchando en http://localhost:3000');
}); **/
