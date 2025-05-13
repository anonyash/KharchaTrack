const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/mydb.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to the database.');
});

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`;

const createAccountsTable = `
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    balance REAL NOT NULL,
    type TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  )
`;

const createTransactionsTable = `
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    sig TEXT NOT NULL,
    currency TEXT NOT NULL,
    text TEXT NOT NULL,
    note TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
  )
`;

// Enable foreign key constraints
db.run('PRAGMA foreign_keys = ON');

db.run(createUsersTable);
db.run(createAccountsTable);
db.run(createTransactionsTable);

module.exports = db;
