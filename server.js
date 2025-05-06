

const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;
const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/user-data');
app.use(express.json());

const userRoutes = require('./routes/user');
app.use('/api', userRoutes); // Route becomes: /api/user-data

app.use('/api', authRoutes);
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public', 'signup.html')));
app.use(express.static('public'));


// '/' to 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// '/login' to login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
// '/signup' to signup
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});








// Insert user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.json(rows);
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// stop server
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    db.close(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
});