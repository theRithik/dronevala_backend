const env = require('dotenv').config()
const express = require('express')
const app = express()
const user = require('./router/user')
const vendor = require('./router/vendor')
const port = process.env.PORT||5000
const serverless = require('serverless-http')
const cors = require('cors')
const SuperAdmin = require('./router/superadmin')
const helmet = require('helmet')


app.use(cors())
app.use(helmet())
app.get('/',(req,res)=>{
    res.status(200).send('Successfully connected')
  })
app.use('/user',user)
app.use('/admin',vendor)
app.use('/super',SuperAdmin)


module.exports.handler = serverless(app)