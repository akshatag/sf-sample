var express = require('express');
var router = express.Router();
const db = require('../config')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/names', function(req, res, next) {
  db.query('SELECT * FROM sample_pii', (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results.rows)
  })

  // await client.connect(process.env.DATABASE_URL);
  // res = await client.query('SELECT first_name FROM sample_pii');
  // res.send(res);
  // await client.end();
})

module.exports = router;
