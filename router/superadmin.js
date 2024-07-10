const express = require('express')
const SuperAdmin = express.Router()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const Dadmin = require('../controller/Dadmin')
const SuperAdminAuthentication = require('../middleware/AdminAuthentication')
SuperAdmin.use(bodyParser.urlencoded({extended:true}))
SuperAdmin.use(bodyParser.json())
SuperAdmin.use(fileUpload())

SuperAdmin.post('/login',Dadmin.superLogin)

SuperAdmin.use(SuperAdminAuthentication)

SuperAdmin.post('/vendors',Dadmin.getVendors)
SuperAdmin.post('/travelCharges',Dadmin.TravelCharges)
SuperAdmin.get('/gettravel',Dadmin.gettcharges)
SuperAdmin.get('/getcourseorder',Dadmin.getcourseOrders)
SuperAdmin.get('/getServiceorder',Dadmin.getServiceorders)
SuperAdmin.post('/UpdatetCharge',Dadmin.UpdateCharges)
SuperAdmin.post('/courseFee',Dadmin.CourseFee)
SuperAdmin.get('/getallvendorsdetails',Dadmin.GetVendors)
SuperAdmin.get('/getAllusers',Dadmin.GetUser)
SuperAdmin.get('/getAllOrders',Dadmin.Getallorders)

module.exports = SuperAdmin