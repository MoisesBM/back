const express = require('express');
const cors = require('cors');
const routes = require('./routes/authRoutes'); 
//const projectRoutes = require('./routes/projectRoutes');  // Nueva importación para proyectos

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', routes);

// Nueva ruta para manejar proyectos
//app.use('/api/projects', projectRoutes);  // Agregamos las rutas de proyectos

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
