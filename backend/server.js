const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./models/mongoConfig');
const departmentRoutes = require('./routes/routes.js');


connectDB();

const app = express();
app.use(bodyParser.json());


app.use(
  cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  })
);


app.use('/api', departmentRoutes);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
