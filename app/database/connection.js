import Pg from 'pg'
const {Client,} = Pg
async function connection(){
    const client = new Client({
        user:process.env.DbUser,
        host:process.env.DbHost,
        database:process.env.DbName,
        password:process.env.DbPassword,
        port:process.env.DbPort,
    })
    try {
        await client.connect()
        console.log('database connected')
        return client
    } catch (error) {
        console.log(error)
    }
}
export default connection
