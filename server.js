import express from 'express'
import dotenv from 'dotenv'
import initRoutes from './routes/api.js'
dotenv.config()
const app = express()
app.use(express.urlencoded({ extended: true, }))
app.use(express.json())
initRoutes(app)
import connection from './app/database/connection.js'
(async () => {
    const client = await connection()
    console.log('client', client)
    app.set('db', client)
})()
export default app
