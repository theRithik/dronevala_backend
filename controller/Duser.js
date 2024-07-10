const DB = require('../middleware/Database')
const jwt = require('jsonwebtoken')
const bcypt = require('bcryptjs')
const RegisterMail = require('../mail/register')
const nodemailer = require('nodemailer')
const querymail = require('../mail/querymail')
const AdminqueryMail = require('../mail/adminquerymail')

var transport2 = nodemailer.createTransport({
    host:'smtp.hostinger.com',
    port:465,
    secure:true,
    auth:{
        user:'dronevala-register@dronevala.com',
        pass:'Agmay@2022'
    }
})
var transport3 = nodemailer.createTransport({
    host:'smtp.hostinger.com',
    port:465,
    secure:true,
    auth:{
        user:'ai@dronevala.com',
        pass:'Agmay@2022'
    }
})

exports.ContactusMail=async(req,res)=>{
    try{
        const ml = querymail(req.body.name) 
        var mailoption ={
            from:'AI@dronevala.com',
            to:req.body.email,
            subject:'We have successfully received your Query',
            html:ml
        }
    
        const dt = {
            name:req.body.name,
            phone:req.body.phone,
            email:req.body.email,
            query:req.body.message
        }
        const ml2 = AdminqueryMail(dt)
        var mailoption2 ={
            from:'AI@dronevala.com',
            to:'info@dronevala.com',
            cc:'vayuvegasagar@gmail.com',
            subject:`${req.body.name} New Query Request`,
            html:ml2
        }
    
        transport3.sendMail(mailoption,(err,result)=>{
            if(err){
               res.status(400).send('An error occured please try again')
            }else{
                transport3.sendMail(mailoption2,(err,result2)=>{
                    if(err){
                        res.status(300).send('An error occured please try again')
                    }else{
                        console.log(result2)
                        res.status(200).send({auth:true,token:'Request sent successfully'})
                    }
                })
               
    
            }
        })

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.UserLogin= async(req,res)=>{
    try{
        const email = req.body.email
        const connection = await DB.getConnection()
        const [result] = await   connection.query(`SELECT * FROM users WHERE email= '${email}'`)
            connection.release()
            if(result.length>0){
                const hashedPassword = bcypt.compareSync(req.body.password,result[0].password)
                
                if(!hashedPassword){
                    res.status(300).send('You have enterd the wrong password')
                }
                else{
                    const token = jwt.sign({"name":result[0].name,"role":"user","id":result[0].uniqID,"exp":Math.floor(Date.now() / 1000) + (30*24*60*60)},process.env.USER_SECRETE,{})
                    res.status(200).send({auth:true,token:token,uniq:result[0].uniqID,name:result[0].name})
                }
            }else{
                res.status(300).send('No user Found please register first')
            }
           
    }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }

    exports.Register=async(req,res)=>{
        try{
            const connection = await DB.getConnection()
            const [result] = await connection.query(`SELECT * FROM users WHERE email = '${req.body.Email}'`)
            connection.release()
            if(result.length>0){
                res.status(300).send('Email is already Registered')
            }else{
                const hashed = bcypt.hashSync(req.body.Password,8)
                const token =   jwt.sign({"email":req.body.Email,"name":req.body.Name,"password":hashed,"exp": Math.floor(Date.now() / 1000) + (15 * 60),},process.env.USER_SECRETE,{})
               const dt ={
                Name:req.body.Name,
                token:token
               }
                const ht = RegisterMail(dt)
                var mailoption = {
                    from:'dronevala-register@dronevala.com',
                    to:req.body.Email,
                    subject:'Verify Your Registration on Dronevala.com',
                    html: ht
            }
            transport2.sendMail(mailoption,(err,result)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log('working')
                    res.status(200).send({auth:true,token:'Email sent Successfully'})
                }
            })
        }

        }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }

    exports.userEmailRegister=async(req,res)=>{
        try{
            jwt.verify(req.body.token,process.env.USER_SECRETE,async(err,decode)=>{
                if(err){
                    res.status(300).send(err.message)
                }else{
                    const data = {
                        uniqID:Math.floor(Date.now() + Math.random()).toString(),
                        name:decode.name,
                        email:decode.email,
                        password:decode.password,
                        role:"user",
                        date_Created:new Date().toLocaleDateString('en-GB',{timeZone:'IST'})
                    }
                  const email = decode.email
                    const connection = await DB.getConnection()
                    const [result] = await connection.query(`SELECT * FROM users WHERE email = '${email}'`)
                    if(result.length<1){
                      const [result2] =await connection.query('INSERT INTO users SET ?',data)
                      console.log(result2)
                      if(result2){
                        const data2 ={
                            uniqID :'DV'+ result2.insertId,
                            firstName:decode.name,
                            email:decode.email,
                            role:'user',
                            status:'Active',
                            DateCreated:data.date_Created
                        }
                        const token = jwt.sign({"name":decode.name,id:data2.uniqID,"role":"user"},process.env.USER_SECRETE,{})
const [result3] =  await connection.query('INSERT INTO userDetails SET ?',data2) 
connection.release()
if(result3){
    res.status(200).send({auth:true,data:'user successfully registerd',token:token,id:data2.uniqID,name:decode.name})
}
                      }
                      connection.release()
                    }else{
                        connection.release()
                        res.status(300).send('email already in excists')
                    }
                }
            })
            
        
        }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')
        }
        }

exports.googleLogin= async(req,res)=>{
    try{
        const data = jwt.decode(req.body.data.credential)
        const connection = await DB.getConnection()
        const [result] = await   connection.query(`SELECT * FROM users WHERE googleID= '${data.sub}'`)
        if(result.length>0){
            const hashedPassword= bcypt.hashSync(data.sub,result[0].password)
            if(!hashedPassword){
                res.status(400).send('Wrong Password')
            }
            else{
                const token = jwt.sign({"name":data.name,"role":"user","id":result[0].uniqID,"exp":Math.floor(Date.now() / 1000) + (30*24*60*60)},process.env.USER_SECRETE,{})
                res.status(200).send({auth:true,token:token,name:result[0].name,uniq:result[0].uniqID})
            }
        }else{
            res.status(300).send('No user Found Please Sign Up first')
        }

    }catch(err){
                console.log(err)
                res.status(500).send('Internal Server Error')  
            }
}

exports.googleRegister = async(req,res)=>{
    try{
        const data = jwt.decode(req.body.data.credential)
        const hashedPassword = bcypt.hashSync(data.sub,8)
        const user={
            uniqID:Math.floor(Date.now() + Math.random()).toString(),
            googleID:data.sub,
            email:data.email,
            name:data.given_name,
            password:hashedPassword,
            role:"user",
            date_Created:new Date().toLocaleDateString('en-GB',{timeZone:'IST'})
        }
       
        const connection = await DB.getConnection()
        
        const [result] = await connection.query(`SELECT * FROM users WHERE email ='${data.email}'`)
        if(result.length<1){
            const [result2] = await connection.query('INSERT INTO users SET ?',user)
if(result2){
    const data2={
        uniqID:'DV'+result2.insertId,
        email:user.email,
        firstName:user.name,
        role:'user',
        DateCreated:user.date_Created,
        profilePhoto:data.picture,
        status:'Active'
    }
  const [result3] = await connection.query('INSERT INTO userDetails SET ?',data2,)
  const token = jwt.sign({"name":req.body.name,id:data2.uniqID,"role":"user","exp":Math.floor(Date.now() / 1000) + (30*24*60*60)},process.env.USER_SECRETE,{})
  connection.release()
  if(result3){
    res.status(200).send({auth:true,data:'user successfully registerd',token:token,name:user.name,id:data2.uniqID})
  }else{
    res.status(400).send('An Error Occured')
  }
}else{
    res.status(400).send('An Error Occured')
}
        }else{
            connection.release()
            res.status(300).send('Email already in use')
        }

    }catch(err){
                console.log(err)
                res.status(500).send('Internal Server Error')  
            }
}

exports.getAllServices =async (req,res)=>{
try{
    const connection =  await DB.getConnection()
    const [result] = await connection.query('SELECT * FROM serviceperson')
    connection.release()
    if(result){
        res.status(200).send(result)
    }
}catch(err){
                console.log(err)
                res.status(500).send('Internal Server Error')  
            }
}

exports.getAllAcademy = async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await  connection.query('SELECT * FROM courses')
        connection.release()
        if(result){
            res.status(200).send(result)
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.getBanner= async(req,res)=>{
    try{
        const id = req.body.id
        const connection = await DB.getConnection()
        const [result] = await  connection.query(`SELECT * FROM courseBanner WHERE courseID = '${id}'`)
        connection.release()
        if(result){
            res.status(200).send(result)
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.courseDetails=async(req,res)=>{
    try{
        const id = req.body._id
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT * FROM courses WHERE courseID = '${id}'`)
        connection.release()
        if(result){
            res.status(200).send(result)
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.getTrainer=async(req,res)=>{
    try{
        const id  = req.body.cid
const connection = await DB.getConnection()
const[result] = await connection.query(`SELECT * FROM coursetrainers WHERE courseID = '${id}'`)
connection.release()
if(result){
    res.status(200).send(result)
}
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}


exports.getSyllabus=async(req,res)=>{
    try{
        const id = req.body.id
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT * FROM coursesyllabus WHERE courseID= '${id}'`)
        connection.release()
        if(result){
            res.status(200).send(result)
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}


exports.courseReviews=async(req,res)=>{
    try{
        const id = req.body.id
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT * FROM reviews WHERE _id = '${id}'`)
        connection.release()
        if(result){
            res.status(200).send(result)
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.getCourseAdvanceFee=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await connection.query('SELECT * FROM courseAdvanceFee')
        connection.release()
        if(result){
            res.status(200).send(result)
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.courseGallery=async(req,res)=>{
    try{
        const id = req.body.id
        const connection= await DB.getConnection()
        const [result] = await connection.query(`SELECT * FROM photogallery WHERE courseID= '${id}'`)
        connection.release()
if(result){

    res.status(200).send(result)
}
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

// services

exports.ServiceDetails=async(req,res)=>{
    try{
        const id = req.body.id
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT id,adminID,serviceID,firstName,middleName,lastName,companyName,currentLocation,Address,serviceLocations,phone,service,availableDates,serviceRadius,latitude,longitude,serviceImage FROM serviceperson WHERE serviceID = '${id}'`)
     connection.release()
        if(result){
            res.status(200).send(result)
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.ServiceTypes=async(req,res)=>{
    try{
        const id = req.body.id
        const connection = await DB.getConnection()
      const [result] = await connection.query(`SELECT * FROM servicetypes WHERE serviceID = '${id}'`)
            connection.release()
            if(result){
                res.status(200).send(result)
            }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.DroneType=async(req,res)=>{
    try{
        const id = req.body.id
        const connection = await DB.getConnection()
     const [result] = await  connection.query(`SELECT * FROM servicedrone WHERE serviceID = '${id}'`)
        connection.release()
        if(result){
            res.status(200).send(result)
        }
    }catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error')  
}
}

exports.serviceBanner= async(req,res)=>{
    try{
        const id = req.body.id
        const connection = await DB.getConnection()
        const [result] = await  connection.query(`SELECT * FROM servicebanner WHERE serviceID = '${id}'`)
        connection.release()
        if(result){
            res.status(200).send(result)
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.ServiceGallery=async(req,res)=>{
    try{
        const id = req.body.id
        const connection= await DB.getConnection()
        const [result] = await connection.query(`SELECT * FROM servicegallery WHERE serviceID= '${id}'`)
        connection.release()
if(result){

    res.status(200).send(result)
}
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.TravelCharges = async(req,res)=>{
    try{
        const connection =await DB.getConnection()
        const [result]= await  connection.query('SELECT * FROM travelCharges')
        if(result){
            res.status(200).send(result)
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}


exports.ServiceTypes=async(req,res)=>{
    try{
        const id = req.body.id
        const connection= await DB.getConnection()
        const [result] = await  connection.query(`SELECT * FROM servicetypes WHERE serviceID = '${id}'`)
        connection.release()
if(result){

    res.status(200).send(result)
}
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.OrderIntiated=async(req,res)=>{
    try{
        const data = {
            uniqID:req.body.uniqID,
            AdminID:req.body.adminId,
            serviceID:req.body.serviceID,
            companyName:req.body.company,
            servicePerson:req.body.serviceperson,
            servicePhone:req.body.servicePhone,
            orderCategory:req.body.category,
            subCategory:req.body.subcat,
            paid:req.body.paid,
            userID:req.body.userId,
            userName:req.body.name,
            userEmail:req.body.uemail,
            phone:req.body.phone,
            booking:req.body.booking,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            type:req.body.type,
            price:req.body.price,
            Address:req.body.Address,
            bookedDates:req.body.dates,
            DateandTime:new Date().toLocaleString('en-IN',{timeZone:'IST'},{format:'dd/mm/yyyy'}),
            status:'unseen',
            subtotal:req.body.subtotal,
            gst:req.body.gst,
            travelCharges:req.body.travelCharges,
            distance:req.body.distance +' Km'
        }
console.log(data)
        const phone = req.body.phone
        const id = req.body.userId

        const connection = await DB.getConnection()
        const [result]= await connection.query(`UPDATE userDetails SET phone = ? WHERE uniqID = ?`,[phone,id])
        if(result){
            const [result2] = await  connection.query('INSERT INTO serviceordersInitated SET ?',data)
                connection.release()
                if(result2){
                    res.status(200).send({auth:true,result2})
                }
        }

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}


exports.CourseOrderIntiated=async(req,res)=>{
    try{
        const phone = req.body.phone
        const id = req.body.userId
        const data = {
            uniqID:req.body.uniqID,
            institute_id:req.body.institute_id,
            instituteName:req.body.instituteName,
            courseID:req.body.courseID,
            courseDuration:req.body.courseDuration,
            courseName:req.body.course,
            courseStartDate:req.body.startDate,
            state:req.body.state,
            city:req.body.city,
            address:req.body.address,
            price:req.body.price,
            userID:req.body.userId,
            userName:req.body.name,
            userEmail:req.body.email,
            userAddress:req.body.userAddress,
            type:req.body.type,
            phone:req.body.phone,
            subtotal:req.body.subT,
            gst:req.body.gst,
            latitude:req.body.lat,
            longitude:req.body.lng,
            totalPaid:req.body.totalPaid,
            discount:req.body.discount,
            DateandTime:new Date().toLocaleString('en-IN',{timeZone:'IST'},{format:'dd/mm/yyyy'}),
            status:'unseen'
        }

        const connection = await DB.getConnection()
        const [result]= await connection.query(`UPDATE userDetails SET phone = ? WHERE uniqID = ?`,[phone,id])
        if(result){
            const [result2] = await  connection.query('INSERT INTO courseorderInitated SET ?',data)
                connection.release()
                if(result2){
                    res.status(200).send({auth:true,result2})
                }
        }

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.courseOrderDetails=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT id,courseName,instituteName,DateandTime FROM courseorders WHERE userID = ${req.id}`)
        connection.release()
        if(result){
            res.status(200).send({auth:true,data:result})
        }

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.serviceOrderDetails=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT id,servicePerson,subCategory,DateandTime FROM serviceorders WHERE userID  = ${req.id}`)
        connection.release()
        if(result){
            res.status(200).send({auth:true,data:result})
        }

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.rentalOrderDetails=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await  connection.query(`SELECT id,productName,companyName,DateandTime FROM rentalorders WHERE userID = ${req.id}`)
        connection.release()
        if(result){
            res.status(200).send({auth:true,data:result})
        }

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}
exports.storeOrderDetails=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT id,productName,brand,DateandTime FROM storeorders WHERE userID = ${req.id}`)
        connection.release()
        if(result){
            res.status(200).send({auth:true,data:result})
        }

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.courseorderFullDetails=async(req,res)=>{
    try{
        const id = req.body.id
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT * FROM courseorders WHERE id ='${id}' AND userID =${req.id}`)
        connection.release()
        if(result){
            res.status(200).send({auth:true,data:result})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.serviceorderFullDetails=async(req,res)=>{
    try{
        const id = req.body.id
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT * FROM serviceorders WHERE id ='${id}' AND userID =${req.id}`)
        connection.release()
        if(result){
            res.status(200).send({auth:true,data:result})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}
exports.rentalorderFullDetails=async(req,res)=>{
    try{
        const id = req.body.id
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT * FROM rentalorders WHERE id ='${id}' AND userID =${req.id}`)
        connection.release()
        if(result){
            res.status(200).send({auth:true,data:result})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}
exports.storeorderFullDetails=async(req,res)=>{
    try{
        const id = req.body.id
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT * FROM storeorders WHERE id ='${id}' AND userID =${req.id}`)
      connection.release()
        if(result){
            res.status(200).send({auth:true,data:result})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.UserReviews=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await  connection.query(`SELECT id,courseName,DateandTime,instituteName,rating,type,id,institute_Id,courseID,message FROM courseorders WHERE userID = ${req.id} `)
   const [result2] = await  connection.query(`SELECT id,servicePerson,DateandTime,subCategory,rating,type,id,AdminID,serviceID,message FROM serviceorders WHERE userID = ${req.id}`)
            const [result3] = await  connection.query(`SELECT id,productName,DateandTime,companyName,rating,type,id,adminId,rentalID,message FROM rentalorders WHERE userID =${req.id}`)
          const [result4] = await  connection.query(`SELECT id,productName,DateandTime,brand,seller,rating,type,id,adminID,productID,message FROM storeorders WHERE userID =${req.id}`)
          connection.release()
          res.status(200).send({data1:result,data2:result2,data3:result3,data4:result4})

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.UserName=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await  connection.query(`SELECT id,firstName,middleName,lastName FROM userDetails WHERE uniqID =${req.id}`)
        connection.release()
        if(result){
            res.status(200).send({auth:true,result:result})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.PostReviews=async(req,res)=>{
    try{
        
    const data = {
        _id:req.body.id,
        adminID:req.body.adminID,
        userID:req.body.userID,
        rowID:req.body.rowID,
        name:req.body.name,
        rating:req.body.rating,
        message:req.body.message,
        data_Created:new Date().toLocaleString(),
    }
    const type = req.body.type
    const data2 = {
        rating :req.body.rating,
        message:req.body.message
    }
    const connection = await DB.getConnection()
    const [result] = await connection.query(`SELECT * FROM reviews WHERE userID = '${data.userID}' AND _id = '${data._id}'`)
    if(result.length<1){
const [result2] = await  connection.query('INSERT INTO reviews SET ? ',data)
const [result3] = await  connection.query(`UPDATE ${type}orders SET ? WHERE userID = '${data.userID}' AND id='${data.rowID}'`,data2)
connection.release()
if(result3){
    res.status(200).send({auth:true,token:'successfully posted'}) 
}
    }else{
        const [result2]= await  connection.query(`UPDATE reviews SET ? WHERE userID = '${data.userID}' AND _id = '${data._id}'`,data)
        const [result3]= await  connection.query(`UPDATE ${type}orders SET ? WHERE userID = '${data.userID}' AND id='${data.rowID}'`,data2)
        connection.release()
        if(result3){
            res.status(200).send({auth:true,token :'updated successfully'})
        }
    }



    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.profilePhoto=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT profilePhoto FROM userDetails WHERE uniqID =${req.id}`)
        connection.release()
        if(result){
            res.status(200).send({auth:true,data:result})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.GetUserDetails=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await   connection.query(`SELECT * FROM userDetails WHERE uniqID = ${req.id}`)
        connection.release()
        if(result){
            res.status(200).send({auth:true,data:result})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.UpdateProfile=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const data = {
            firstName:req.body.fstName,
            middleName:req.body.Mname,
            lastName:req.body.lstName,
            email:req.body.email,
            phone:req.body.phone,
            alternativePhone:req.body.alternate,
            DOB:req.body.DOB,
            passport:req.body.passport,
            aadhaar:req.body.aadhaar,
            presentAddress:req.body.presentAddress,
            permanentAddress:req.body.permanentaddress,
            city:req.body.city,
            state:req.body.state
        }
        const [result] = await connection.query('UPDATE userDetails SET ? WHERE uniqID = ?',[data,req.id])
        connection.release()
        if(result){
            res.status(200).send({auth:true,data:result})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.AddprofilePhoto=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await connection.query(`UPDATE userDetails SET profilePhoto = ? WHERE uniqID =${req.id}`,[req.body.image])
        connection.release()
        if(result){
            res.status(200).send({auth:true,data:result})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}