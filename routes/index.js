var express = require('express');
var router = express.Router();
const db = require('../config');
const fs = require('fs')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/all', async function(req, res, next) {
  results = await db.query('SELECT * FROM sample_pii')
  res.send(results.rows)
})

router.get('/ca', async function(req, res, next) {
  results = await db.query('SELECT * FROM sample_pii WHERE state = $1', ['CA']) 
  res.send(results.rows)
})


module.exports = router;
