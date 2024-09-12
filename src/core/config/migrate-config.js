const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')

dotenv.config()

module.exports = {
  development: {
    driver: process.env.DIALET,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
      ca: fs.readFileSync(path.resolve(__dirname, "../../../ca.pem"), 'utf8')
    },
  }
}
