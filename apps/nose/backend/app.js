const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes (aggiungi le tue route qui)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
