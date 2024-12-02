const express = require('express');
const cors = require('cors');
const routes = require('./routes/authRoutes'); 
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', projectRoutes);
app.use('/api/user', userRoutes);
app.use('/', routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
