require('dotenv').config()

const pg = require('pg');
const isProd = process.env.NODE_ENV === 'production'

const connectionString = "postgres://jymmcobmzetihf:6653e9e126dfda00ce77a5d4e59a6fae40e37604d46ec703aabed728b8bcba41@ec2-54-166-251-173.compute-1.amazonaws.com:5432/d2ot4v4ca446jk"

const client = new pg.Client({
    connectionString: isProd ? process.env.DATABASE_URL : connectionString, 
    ssl: isProd
})

module.exports = client

