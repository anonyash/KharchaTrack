const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
const db = require('./database');

const PORT = 3000;

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public', 'signup.html')));
app.use(express.static('public'));

// Account routes
// Get all accounts for a user
app.get('/api/accounts', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  db.all('SELECT * FROM accounts WHERE user_id = ?', [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Create new account
app.post('/api/accounts', (req, res) => {
  const { user_id, name, balance, type } = req.body;
  
  if (!user_id || !name || balance === undefined || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Start a transaction to ensure data consistency
  db.run('BEGIN TRANSACTION');

  // Insert the account
  db.run(
    'INSERT INTO accounts (user_id, name, balance, type) VALUES (?, ?, ?, ?)',
    [user_id, name, balance, type],
    function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Failed to create account' });
      }

      // Commit the transaction
      db.run('COMMIT', function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to commit transaction' });
        }
        res.status(201).json({ id: this.lastID });
      });
    }
  );
});

// Update account
app.put('/api/accounts/:id', (req, res) => {
    const { id } = req.params;
    const { name, balance, type, updateType } = req.body;

    db.get('SELECT balance FROM accounts WHERE id = ?', [id], (err, account) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        let newBalance = account.balance;
        if (updateType === 'add') {
            newBalance += balance;
        } else if (updateType === 'subtract') {
            newBalance -= balance;
        } else {
            newBalance = balance;
        }

        const sql = `
            UPDATE accounts 
            SET name = COALESCE(?, name),
                balance = ?,
                type = COALESCE(?, type)
            WHERE id = ?
        `;

        db.run(sql, [name, newBalance, type, id], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ 
                id: id,
                name: name || account.name,
                balance: newBalance,
                type: type || account.type
            });
        });
    });
});

// Delete account
app.delete('/api/accounts/:id', (req, res) => {
  const accountId = req.params.id;

  // Start a transaction
  db.run('BEGIN TRANSACTION');

  // First get the account details to verify it exists
  db.get('SELECT * FROM accounts WHERE id = ?', [accountId], (err, account) => {
    if (err) {
      db.run('ROLLBACK');
      return res.status(500).json({ error: 'Database error' });
    }

    if (!account) {
      db.run('ROLLBACK');
      return res.status(404).json({ error: 'Account not found' });
    }

    // Delete the account (transactions will be deleted automatically due to CASCADE)
    db.run('DELETE FROM accounts WHERE id = ?', [accountId], function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Failed to delete account' });
      }

      // Commit the transaction
      db.run('COMMIT', function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to commit transaction' });
        }
        res.json({ message: 'Account and associated transactions deleted successfully' });
      });
    });
  });
});

// Get account summary (total balance, income, expenses)
app.get('/api/account-summary', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Get total balance from accounts
  db.get('SELECT SUM(balance) as totalBalance FROM accounts WHERE user_id = ?', [userId], (err, balanceResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Get income and expenses from transactions
    db.get(`
      SELECT 
        SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as totalExpenses
      FROM transactions 
      WHERE user_id = ?
    `, [userId], (err, transactionResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        totalBalance: balanceResult.totalBalance || 0,
        totalIncome: transactionResult.totalIncome || 0,
        totalExpenses: transactionResult.totalExpenses || 0,
        savings: (transactionResult.totalIncome || 0) - (transactionResult.totalExpenses || 0)
      });
    });
  });
});

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
    `INSERT INTO transactions (id, user_id, account_id, amount, sig, currency, text, note, date, time) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      transaction.id,
      transaction.user_id,
      transaction.account_id,
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
    }
  );
});

// Get transactions for a specific account
app.get('/api/account-transactions/:accountId', (req, res) => {
  const accountId = req.params.accountId;
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ error: 'Month and year are required' });
  }

  const paddedMonth = String(month).padStart(2, '0');
  const nextMonth = month === '12' ? '01' : String(Number(month) + 1).padStart(2, '0');
  const nextYear = month === '12' ? String(Number(year) + 1) : year;

  const start = `${year}-${paddedMonth}-01`;
  const end = `${nextYear}-${nextMonth}-01`;

  db.all(`
    SELECT * FROM transactions
    WHERE account_id = ? AND date >= ? AND date < ?
    ORDER BY date DESC
  `, [accountId, start, end], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Update account balance when transaction is added
app.post('/api/transaction', (req, res) => {
  const transaction = req.body;
  
  // Start a transaction
  db.run('BEGIN TRANSACTION');

  // Insert the transaction
  db.run(
    `INSERT INTO transactions (id, user_id, account_id, amount, sig, currency, text, note, date, time) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      transaction.id,
      transaction.user_id,
      transaction.account_id,
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
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Failed to insert transaction' });
      }

      // Update account balance
      db.run(
        'UPDATE accounts SET balance = balance + ? WHERE id = ?',
        [transaction.amount, transaction.account_id],
        function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Failed to update account balance' });
          }

          // Commit the transaction
          db.run('COMMIT', function(err) {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Failed to commit transaction' });
            }
            res.status(201).json({ id: transaction.id });
          });
        }
      );
    }
  );
});

// Delete transaction and update account balance
app.delete('/api/transaction/:id', (req, res) => {
  const id = req.params.id;

  // Start a transaction
  db.run('BEGIN TRANSACTION');

  // First get the transaction details
  db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, transaction) => {
    if (err) {
      db.run('ROLLBACK');
      return res.status(500).json({ error: 'Failed to get transaction details' });
    }

    if (!transaction) {
      db.run('ROLLBACK');
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Delete the transaction
    db.run('DELETE FROM transactions WHERE id = ?', [id], function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Failed to delete transaction' });
      }

      // Update account balance (subtract the transaction amount)
      db.run(
        'UPDATE accounts SET balance = balance - ? WHERE id = ?',
        [transaction.amount, transaction.account_id],
        function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Failed to update account balance' });
          }

          // Commit the transaction
          db.run('COMMIT', function(err) {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Failed to commit transaction' });
            }
            res.json({ message: 'Transaction deleted successfully' });
          });
        }
      );
    });
  });
});

// Insert user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  console.log(name, email)
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

// // delete transaction
// app.delete('/api/transaction/:id', (req, res) => {
//   const id = req.params.id;

//   db.run('DELETE FROM transactions WHERE id = ?', [id], function (err) {
//     if (err) {
//       console.error("Error deleting transaction:", err);
//       return res.status(500).json({ error: "Failed to delete transaction." });
//     }

//     if (this.changes === 0) {
//       return res.status(404).json({ message: "Transaction not found." });
//     }

//     res.json({ message: "Transaction deleted successfully." });
//   });
// });

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