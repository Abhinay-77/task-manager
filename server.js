

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json()); 
app.use(cors()); 




mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
  