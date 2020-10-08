var express = require('express');
var router = express.Router();

const pg = require('pg');
const connectionstring = "postgres://jymmcobmzetihf:6653e9e126dfda00ce77a5d4e59a6fae40e37604d46ec703aabed728b8bcba41@ec2-54-166-251-173.compute-1.amazonaws.com:5432/d2ot4v4ca446jk"

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/names', function(req, res, next) {
  const client = new pg.Client(process.env.DATABASE_URL)
  // await client.connect(process.env.DATABASE_URL);
  // res = await client.query('SELECT first_name FROM sample_pii');
  // res.send(res);
  // await client.end();
})

module.exports = router;
