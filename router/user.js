const express = require('express')
const user = express.Router()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const Duser = require('../controller/Duser')
const UserAuthentication = require('../middleware/userAuthentication')
const DuserRental = require('../controller/DuserRental')

user.use(bodyParser.urlencoded({extended:true}))
user.use(bodyParser.json())
user.use(fileUpload())

user.post('/contact',Duser.ContactusMail)
user.get('/serviceDetails',Duser.getAllServices)
user.get('/user',Duser.getAllAcademy)
user.post('/getImageBanner',Duser.getBanner)
user.post('/fullcourseDetails',Duser.courseDetails)
user.post('/getSyllabus',Duser.getSyllabus)
user.post('/getTrainers',Duser.getTrainer)
user.post('/getreviews',Duser.courseReviews)
user.get('/courseAdvanceFee',Duser.getCourseAdvanceFee)
user.post('/courseGallery',Duser.courseGallery)
user.post('/servicePerson',Duser.ServiceDetails)
user.post('/DroneTypes',Duser.DroneType)
user.post('/getserviceBanner',Duser.serviceBanner)
user.post('/servicephotoGallery',Duser.ServiceGallery)
user.post('/serviceTypes',Duser.ServiceTypes)

// Rental
user.get('/allrental',DuserRental.AllRental)
user.post('/RentalDetails',DuserRental.RentalDetails)
user.post('/getRentalBanner',DuserRental.RentalBanner)
user.post('/rentalGallery',DuserRental.RentalGallery)



//  
user.post('/userLogin',Duser.UserLogin)
user.post('/google/login',Duser.googleLogin)
user.post('/google/register',Duser.googleRegister)
user.post('/verifyEmail',Duser.Register)
user.post('/registerVerify',Duser.userEmailRegister)
user.get('/getjobs',Duser.getJobs)
user.post('/getjobdetails',Duser.jobDetails)
user.post('/applyjob',Duser.applyJob)

user.use(UserAuthentication)
user.post('/courseorderInitated',Duser.CourseOrderIntiated)
user.post('/orderInitated',Duser.OrderIntiated)
user.post('/initatedRentalOrder',DuserRental.RentalOrderIntiated)
user.get('/getuserRentalorder',DuserRental.getuserorder)
user.get('/getTcharge',Duser.TravelCharges)
user.get('/userCourseOrderDetails',Duser.courseOrderDetails)
user.get('/userServiceOrderDetails',Duser.serviceOrderDetails)
user.get('/userRentalOrderDetails',Duser.rentalOrderDetails)
user.get('/userStoreOrderDetails',Duser.storeOrderDetails)
user.post('/courseOrderFullDetils',Duser.courseorderFullDetails)
user.post('/serviceOrderFullDetils',Duser.serviceorderFullDetails)
user.post('/rentalOrderFullDetils',Duser.rentalorderFullDetails)
user.post('/storeOrderFullDetils',Duser.storeorderFullDetails)
user.get('/userReviews',Duser.UserReviews)
user.get('/userName',Duser.UserName)
user.post('/postReview',Duser.PostReviews)
user.get('/profilephoto',Duser.profilePhoto)
user.get('/getUser',Duser.GetUserDetails)
user.post('/UpdateProfile',Duser.UpdateProfile)
user.post('/adduserImage',Duser.AddprofilePhoto)






module.exports = user