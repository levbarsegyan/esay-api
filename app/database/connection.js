import Pg from 'pg'
const {Client,} = Pg
function connection(){
    const client = new Client({
        user:process.env.DbUser,
        host:process.env.DbHost,
        database:process.env.DbName,
        password:process.env.DbPassword,
        port:process.env.DbPort,
    })
    client.connect().then(console.log('database connected'))
    return client
}
export default connection
