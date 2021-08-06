const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const env = require('dotenv');

// Setting up the environment variables
env.config();

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI ||
      `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.zk79k.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log('Database Connected');
  });

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.use(cors());
app.use(express.json());

// routes
const authRoutes = require('./routes/auth');
const homeRoute = require('./routes/home');

app.use('/api', authRoutes);
app.use('/api', homeRoute);

var PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
