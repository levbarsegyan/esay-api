import express from 'express'
import dotenv from 'dotenv'
import initRoutes from './routes/api.js'
dotenv.config()
const app = express()
app.use(express.urlencoded({ extended: true, }))
app.use(express.json())
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './api-docs/swagger.json'
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
initRoutes(app)
import connection from './app/database/connection.js'
(async ()=>{
    const client = await connection()
    app.set('db', client)
})()
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
    console.log(`Listening on port ${PORT} 👌🏾 \nLet's build something awesome 🔥`)
)