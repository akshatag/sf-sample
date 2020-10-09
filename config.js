require('dotenv').config()

const Pool = require('pg').Pool;

const isProd = process.env.NODE_ENV === 'production'

const connectionString = "postgres://jymmcobmzetihf:6653e9e126dfda00ce77a5d4e59a6fae40e37604d46ec703aabed728b8bcba41@ec2-54-166-251-173.compute-1.amazonaws.com:5432/d2ot4v4ca446jk"

console.log('connecting to db...')

const pool = new Pool({
    connectionString: isProd ? process.env.DATABASE_URL : connectionString, 
    ssl: {rejectUnauthorized: false}
})

module.exports = {
    query: (text, params) => pool.query(text, params)
}

