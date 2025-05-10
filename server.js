

const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
const db = require('./database');


const PORT = 3000;



const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/user-data');


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




// Insert transaction
app.post('/api/transaction', (req, res) => {
  const transaction = req.body;
  db.run(
    `INSERT INTO transactions (id, user_id, amount, sig, currency, text, note, date, time) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      transaction.id,
      transaction.user_id,
      transaction.amount,
      transaction.sig,
      transaction.currency,
      transaction.text,
      transaction.note,
      transaction.date,
      transaction.time
    ],
    function(err) {
      if (err) {
        return console.error('Insert failed:', err.message);
      }
      console.log(`Transaction inserted with rowid ${this.lastID}`);
      res.status(201).json({ id: this.lastID });
    })});




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
  db.all('SELECT * FROM transactions ', [], (err, rows) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.json(rows);
  });
});



app.get('/api/transaction', (req, res) => {
  console.log('/api/transaction hit')
  console.log(req.query)
  const  month = req.query.month;
  const  year = req.query.year;
  const  userId = req.query.user_id;
  console.log(month, year, userId)

  if (!month || !year || !userId) {
    return res.status(400).json({ error: 'Month, year and user ID are required' });
  }

  const paddedMonth = String(month).padStart(2, '0');
  const nextMonth = month === '12' ? '01' : String(Number(month) + 1).padStart(2, '0');
  const nextYear = month === '12' ? String(Number(year) + 1) : year;

  const start = `${year}-${paddedMonth}-01`;
  const end = `${nextYear}-${nextMonth}-01`;

  db.all(`
    SELECT * FROM transactions
    WHERE date >= ? AND date < ?  AND user_id = ?
    ORDER BY date DESC
  `, [start, end, userId ], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// delete transaction
app.delete('/api/transaction/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM transactions WHERE id = ?', [id], function (err) {
    if (err) {
      console.error("Error deleting transaction:", err);
      return res.status(500).json({ error: "Failed to delete transaction." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    res.json({ message: "Transaction deleted successfully." });
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