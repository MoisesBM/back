const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const transporter = require('../config/emailConfig');


const pool = new Pool(require('../config/db'));

exports.register = async (req, res) => {
  const { username, password, email, acceptTerms} = req.body;
  
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    //Se implemento la validacion de correos electronicos existentes. - MOISESBMM
    const emailExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //Insercion de datos a la base de datos, La tabla "Users" recibiendo como valores (username, password, email) y retornando el valor de id
    const userResult = await pool.query( 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id', [username, hashedPassword, email]
    );
    res.status(201).json({ message: 'Usuario registrado exitosamente' });

    const userId = userResult.rows[0].id; 
    
    //Validacion de aceptacion de terminos y condiciones
     const accepted = acceptTerms === true || acceptTerms === 'true' ? 0 : 1;
     await pool.query('INSERT INTO user_terms_conditions (user_id, accepted, accepted_at) VALUES ($1, $2, NOW())', [userId, accepted]);
    
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error en el registro: ' + error.message });
  }
};

exports.login = async (req, res) => {
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
      });

    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error al hacer login:', error);
    res.status(500).json({ message: 'Error al hacer login' });
  }
};

exports.verifyToken = (req, res) => {
  const { token } = req.body;

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    } else {
      res.json({ message: 'Token verificado correctamente', user: decoded.username });
    }
  });
};
