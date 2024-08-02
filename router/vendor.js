const bodyParser = require('body-parser')
const express = require('express')
const fileUpload = require('express-fileupload')
const vendor= express.Router()
const Dvendor = require('../controller/Dvendor')
const DVendor2 = require('../controller/DvendorRental')
const TokenAuthentication = require('../middleware/Vauthentication')

vendor.use(bodyParser.urlencoded({extended:true}))
vendor.use(bodyParser.json())
vendor.use(fileUpload())

vendor.post('/emailVerfication',Dvendor.emailverify)
vendor.post('/instituteRegister',Dvendor.vendorRegister)
vendor.post('/instituteLogin',Dvendor.vlogin)
vendor.post('/googleRegister',Dvendor.vgoogleReg)
vendor.post('/vgoogleLogin',Dvendor.VgooleLogin)

vendor.use(TokenAuthentication)
vendor.post('/updateAdminDetails',Dvendor.AddAdminDetails)
vendor.post('/addBranch',Dvendor.addBranch)
vendor.post('/category',Dvendor.AddCategory)
vendor.get('/ADetails',Dvendor.Adetails)
vendor.get('/fulllDetails',Dvendor.fullDetails)
vendor.post('/updateAdmin',Dvendor.UpdateDetails)
vendor.post('/updateImage',Dvendor.adminImage)
vendor.post('/addservice',Dvendor.ServiceAdd)
vendor.post('/serviceType',Dvendor.serviceType)
vendor.post('/droneType',Dvendor.ServiceDrone)
vendor.post('/addLocation',Dvendor.ServiceLocation)
vendor.get('/findService',Dvendor.findService)
vendor.put('/updateServiceDates',Dvendor.updateDates)
vendor.put('/addserviceImage',Dvendor.ServiceImage)
vendor.post('/addserviceBanner',Dvendor.ServiceBanner)
vendor.post('/addserviceGallery',Dvendor.ServiceGallery)


// Academy.......
vendor.post('/addCourse',Dvendor.AddCourse)
vendor.get('/findCourse',Dvendor.FindCourse)
vendor.post('/updateCourseImage',Dvendor.UpdateCourseImage)
vendor.post('/updateCourse',Dvendor.UpdateCourse)
vendor.post('/AddTrainer',Dvendor.AddTrainer)
vendor.post('/addSyllabus',Dvendor.AddSyllabus)
vendor.post('/courseBanner',Dvendor.CourseBanner)
vendor.post('/courseGallery',Dvendor.CourseGallery)
vendor.post('/courseStartDate',Dvendor.UpdateCourseDate)
vendor.get('/getOrderDetails',Dvendor.getCourseOrders)
vendor.get('/ServiceOrdersList',Dvendor.getServiceOrders)
vendor.post('/courseOrderID',Dvendor.CourseOrderDetails)
vendor.post('/serviceOrderID',Dvendor.ServiceOrderDetails)
vendor.get('/CalenderEvent',Dvendor.CalenderEvents)

// rental

vendor.post('/addRental',DVendor2.AddRental)
vendor.post('/addRentalProduct',DVendor2.AddRentalProduct)
vendor.get('/findProducts',DVendor2.findRental)
vendor.post('/updateRentalImage',DVendor2.updateProductImage)
vendor.post('/UpdateRentalProduct',DVendor2.updateproductdetails)
vendor.post('/rentalGallery',DVendor2.RentalGallery)
vendor.post('/rentalBanner',DVendor2.RentalBanner)
vendor.post('/productstatus',DVendor2.productStatus)
vendor.get('/rentalorders',DVendor2.rentalorder)
vendor.post('/rentalorderDetails',DVendor2.rentalorderDetails)

// jobs

vendor.post('/jobpost',Dvendor.JobPost)
vendor.get('/jobtitle',Dvendor.titleName)
vendor.post('/jobstatus',Dvendor.jobstatus)


module.exports = vendor