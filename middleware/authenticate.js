const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded; // Guarda el ID del usuario en la petición
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token no válido' });
  }
};
