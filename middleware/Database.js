const sql = require('mysql2')
var DB = sql.createPool({
    host:process.env.DB_HOST,
    user:process.env.SQL_ID,
    password:process.env.SQL_PASS,
    database:'u126858798_dronesapp',
    connectionLimit: 30,
}).promise()

exports.getConnection=async()=>{
        try{
            const connection = await DB.getConnection()
            console.log('connection to database is ok')
            return connection;
        }catch(err){
            console.error('Error getting database connection:', err);
            throw err;
        }
    }

