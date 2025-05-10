const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const db = require('../database');

console.log('user.js')
router.post('/user-data', async  (req, res) => {
  console.log('user-data hit: ', req.body.id )
  const userId = req.body.id;
  // Fetch user-specific data from DB...
  // console.log('message:'`Hello User #${userId}`)

  db.all(`SELECT * FROM transactions WHERE user_id = ${userId}`, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.json(rows);
    console.log(rows)
  });



});

module.exports = router;
