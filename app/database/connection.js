import Pg from 'pg'
const { Client, } = Pg
async function connection() {
    const client = new Client({
        user: process.env.DbUser,
        host: process.env.DbHost,
        database: process.env.NODE_ENV === 'test' ? process.env.DbName_test : process.env.DbName,
        password: process.env.DbPassword,
        port: process.env.DbPort,
    })
    try {
        await client.connect()
        return client
    } catch (error) {
        console.log(error)
    }
}
export default connection
