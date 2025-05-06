const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.get('/user-data', authenticateToken, (req, res) => {
  const userId = req.user.id;
  // Fetch user-specific data from DB...
  res.json({ message: `Hello User #${userId}` });
});

module.exports = router;
