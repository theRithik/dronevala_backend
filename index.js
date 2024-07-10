const env = require('dotenv').config()
const express = require('express')
const app = express()
const user = require('./router/user')
const vendor = require('./router/vendor')
const port = process.env.PORT||5000

const cors = require('cors')
const SuperAdmin = require('./router/superadmin')

app.use(cors())
app.use('/user',user)
app.use('/admin',vendor)
app.use('/super',SuperAdmin)

app.listen(port,()=>{
    console.log('Server started')
})