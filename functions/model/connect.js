import * as functions from 'firebase-functions'
import mysql from 'mysql'
const config = functions.config()

const dbConf = {
  host: config.db.host,
  user: config.db.username,
  database: config.db.database,
  password: config.db.password
}

const connection = mysql.createConnection(dbConf)

connection.connect(err => {
  if (err) {
    console.error('Error connecting: ' + err.stack)
  }
  console.log('Connected as thread id: ' + connection.threadId)
})

export default connection
