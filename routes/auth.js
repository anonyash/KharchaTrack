const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config'); // <— THIS is what loads it




// Signup
// router.post('/signup', async (req, res) => {
//   const { username, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   db.run(
//     'INSERT INTO users (username, password) VALUES (?, ?)',
//     [username, hashedPassword],
//     function (err) {
//       if (err) return res.status(400).json({ error: 'Username already exists.' });
//       res.json({ success: true, userId: this.lastID });
//     }
//   );
// });


// Login
// router.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
//     if (err || !user) return res.status(401).json({ error: 'Invalid credentials.' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

//     res.json({ success: true, userId: user.id });
//   });
// });


// Signup
router.post('/signup', async (req, res) => {
  console.log("signup route hit")
  console.log('body: ', req.body)
    const {  fullName, email, password } =  req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    db.run(
      'INSERT INTO users (fullName, email, password ) VALUES (?, ?, ?)',
      [ fullName, email, hashedPassword],
      function (err) {
        if (err) return res.status(400).json({ message: `${err}` });

        const user = { id: this.lastID, email };
        const token = jwt.sign(user, jwtSecret, { expiresIn: '1h' });

        res.json({ success: true, token, userId: user.id });
      }
    );
  });


// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err || !user) return res.status(401).json({ message: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });
  
      res.json({ success: true, token, userId: user.id , username: user.fullName });
    });
  });


  





module.exports = router;






  