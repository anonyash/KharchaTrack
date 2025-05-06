const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/mydb.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to the database.');
});

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`;


const createTransactionsTable = `
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    sig TEXT NOT NULL,
    currency TEXT NOT NULL,
    Category TEXT NOT NULL,
    note TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`;




db.run(createUsersTable);
db.run(createTransactionsTable);

module.exports = db;
