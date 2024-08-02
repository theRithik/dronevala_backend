const verifyMail = require('../mail/verifyemail')
const DB = require('../middleware/Database')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const bcypt = require('bcryptjs')
var transport2 = nodemailer.createTransport({
    host:'smtp.hostinger.com',
    port:465,
    secure:true,
    auth:{
        user:'dronevala-register@dronevala.com',
        pass:'Agmay@2022'
    }
})


exports.emailverify=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
console.log(req.body)
const email = req.body.Email
        const [exicitingUser]=  await connection.query('SELECT * FROM admin WHERE Institute_Email = ?',[email])
        connection.release()
        console.log(exicitingUser)
        if(exicitingUser.length>0){
            res.status(300).send('Email is already Registered try to login')
        }else{
            const hased = bcypt.hashSync(req.body.Password,8)
            const token =   jwt.sign({"email":req.body.Email,"name":req.body.name,"instName":req.body.InstName,"password":hased,"exp": Math.floor(Date.now() / 1000) + (15 * 60),},process.env.VENDOR_SECRETE,{})
        const dt ={
            name:req.body.name,
            token:token
        }   
       const hm = verifyMail(dt)
        var mailoption = {
            from:'dronevala-register@dronevala.com',
            to:req.body.Email,
            subject:'Verify Your Registration as a Vendor on Dronevala.com',
            html:hm
        }

        transport2.sendMail(mailoption,(err,result)=>{
            if(err){
                res.status(300).send(err)
            }
            else{
                res.status(200).send({auth:true,token:'Email sent Successfully'})
            }
        })
        }

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
}

exports.vendorRegister=async(req,res)=>{
try{
    jwt.verify(req.body.token,process.env.VENDOR_SECRETE,async(err,decode)=>{
        console.log(decode)
        if(err){
            res.status(300).send(err.message)
        }else{
            const user={
                _id: Math.floor(Date.now() + Math.random()).toString(),
                Name:decode.name,
                Institute_Name:decode.instName,
                Institute_Email:decode.email,
                Password:decode.password,
                status:req.body.status?req.body.status:'Active',
                role:req.body.role?req.body.role:'Admin',
                data_Created: new Date().toLocaleDateString('en-GB',{timeZone:'IST'})
            }
            const email = decode.email
            const connection = await DB.getConnection()
            const [result] = await connection.query(`SELECT * FROM admin WHERE Institute_Email = '${email}'`)
            if(result.length<1){
                const [result2] = await connection.query('INSERT INTO admin SET ?',user)
                connection.release()
                console.log(result2)
                if(result2){
                    const token = jwt.sign({"name":decode.name,"role":"Admin","vid":'vendor'+result2.insertId,"exp":Math.floor(Date.now() / 1000) + (7*24*60*60)},process.env.VENDOR_SECRETE,{})
                    res.status(200).send({auth:true,id:'vendor'+result2.insertId,email:user.Institute_Email,name:user.Name,Instname:user.Institute_Name,token:token})
                }

            }else{
                connection.release()
                res.status(300).send('email already excists')
              
            }
        }
    })
    

}catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error')
}
}



exports.vlogin=async(req,res)=>{
try{
    const email = req.body.Email
    const connection = await DB.getConnection()
    const [result] = await connection.query(`SELECT * FROM admin WHERE Institute_Email = '${email}'`)
    connection.release()
    if(result){
        console.log(result[0])
        const hashedPassword = bcypt.compareSync(req.body.password,result[0].Password)
            
        if(!hashedPassword){
            res.status(400).send('wrong password')
        }
        else{ 
            const token = jwt.sign({"name":result[0].Name,"role":"Admin","vid":'vendor'+result[0].id,"exp":Math.floor(Date.now() / 1000) + (7*24*60*60)},process.env.VENDOR_SECRETE,{})
            res.status(200).send({auth:true,token:'Successfully Logined',data:token,id:'vendor'+result[0].id,name:result[0].Name})
        }
    }else{
        res.status(300).send('No User Found Please Login')
    }
}catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error')
}
}

exports.vgoogleReg=async(req,res)=>{
try{
    const data = jwt.decode(req.body.data.credential)
    const hashedPassword = bcypt.hashSync(data.sub,8)
    const admin={
        _id: Math.floor(Date.now() + Math.random()).toString(),
        Name:data.given_name,
        Institute_Name:req.body.instname,
        Institute_Email:data.email,
        googleID:data.sub,
        Password:hashedPassword,
        status:req.body.status?req.body.status:'Active',
        role:req.body.role?req.body.role:'Admin',
        data_Created: new Date().toLocaleDateString('en-GB',{timeZone:'IST'})
    }
    const connection = await DB.getConnection()
    const [result] = await connection.query(`SELECT * FROM admin WHERE Institute_Email = '${data.email}'`)
    if(result.length<1){
        const [result2] = await connection.query('INSERT INTO admin SET ?',admin)
        connection.release()
        if(result2){
            const token = jwt.sign({"name":data.given_name,"role":"Admin",vid:'vendor'+result2.insertId,"exp":Math.floor(Date.now() / 1000) + (7*24*60*60)},process.env.VENDOR_SECRETE,{})
            res.status(200).send({auth:true,id:'vendor'+result2.insertId,email:admin.Institute_Email,name:admin.Name,Instname:admin.Institute_Name,token:token})
        }

    }else{
        connection.release()
        res.status(300).send('email already excists please try login')
    }
}
catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error')
}
}

exports.VgooleLogin = async(req,res)=>{
    try{
        const data = jwt.decode(req.body.credential)
        const connection = await DB.getConnection()
        const [result]= await connection.query(`SELECT * FROM admin WHERE googleID= '${data.sub}'`)
        connection.release()
        console.log(result)
        if(result.length<1){
            res.status(400).send('No user Found Please Sign Up first')
        }else{
            const hashedPassword= bcypt.hashSync(data.sub,result[0].password)
            if(!hashedPassword){
                res.status(300).send('Wrong Password')
            }
            else{
                const token = jwt.sign({"name":result[0].Name,"role":"admin","vid":'vendor'+result[0].id,"exp":Math.floor(Date.now() / 1000) + (7*24*60*60)},process.env.VENDOR_SECRETE,{})
                res.status(200).send({auth:true,token:token,name:result[0].Name,vid:'vendor'+result[0].id})
            }   
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
}

exports.AddAdminDetails =async(req,res)=>{
    try{

        const data = {
            adminID:req.body._id,
            Name:req.body.Name,
            Institute_Name:req.body.Institute_Name,
            Institute_Email:req.body.Institute_Email,
            alternative_Email:req.body.alternative_Email,
            phone_Number:req.body.Phone_number,
            Address:req.body.Address,
            role:'Admin',
            status:'Active',
            date_Created:new Date().toLocaleDateString('en-GB',{timeZone:'IST'})
            
         }
const connect = await DB.getConnection()

const [result] = await connect.query('INSERT INTO admindetails SET ?',data)
connect.release()
if(result){
    res.status(200).send({auth:true,data:result})
}

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error') 
    }

}

exports.addBranch =async(req,res)=>{
    try{
        const data = req.body.branch_address
        let obj={}
        for(let i=0;i<data.length;i++){
            obj['branch'+(i+1)] = data[i].address
        }
       obj['adminID']=req.body.id
       const connection = await DB.getConnection()
       const [result] = await connection.query('INSERT INTO instbranches SET ?',obj)
       connection.release()
       if(result){
        res.status(200).send({auth:true,data:result})
       }
    }catch(err){
 console.log(err)
        res.status(500).send('Internal Server Error') 
    }
}

exports.AddCategory=async(req,res)=>{
    try{
        const data = req.body.category
        const id = req.body._id
        let obj1={}
        for(let i=0;i<data.length;i++){
            obj1['category'+(i+1)]=data[i]
        }
        const data2 = req.body.category_types
        let obj3 ={}
        obj3['adminID']=id
        for(let i =0;i<data2.length;i++){
           
            obj3['type'+(i+1)]=data2[i].type
        }
        const connection = await DB.getConnection()
        const [result] = await connection.query('UPDATE admindetails SET ? WHERE adminID= ?',[obj1,id])
        connection.release()
        if(result){
            const [result2] = await connection.query('INSERT categorytype SET ?',obj3)
            
            res.status(200).send({auth:true,data:result2})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error') 
    }
}

exports.Adetails=async(req,res)=>{
try{
    const connection = await DB.getConnection()
    const id = req.vid
    console.log(id)
    const [result] = await connection.query('SELECT Name, role,profile_photo,category1, category2,category3,category4 FROM admindetails WHERE adminID = ?',id)
  connection.release()
    if(result){
        res.status(200).send(result)
    }

}catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error') 
}
}


exports.fullDetails=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const id = req.vid
        console.log(id)
        const [result] = await connection.query(`SELECT id,Institute_Email,Name,phone_Number,alternative_Email,Institute_Name,Address,Profile_photo FROM admindetails WHERE adminID = '${id}'`)
      connection.release()
        if(result){
            res.status(200).send(result)
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error') 
    }
}

exports.UpdateDetails =async(req,res)=>{
try{
const dat={
    Name:req.body.name,
    Institute_Name:req.body.instName,
    Institute_Email:req.body.email,
    alternative_Email:req.body. alterEmail,
    phone_Number:req.body.phone,
    Address:req.body.address
}
console.log(dat)
const id = req.vid
const connection= await DB.getConnection()
const [result] = await connection.query(`UPDATE admindetails SET ? WHERE adminID = '${id}'`,dat)
connection.release()
if(result){
    res.status(200).send({auth:true,token:'Updated Successfully'})
}
}catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error') 
}
}

exports.adminImage=async(req,res)=>{
    try{
        const id = req.vid
        const image = req.body.image
        const connection = await DB.getConnection()
        const [result] = await connection.query(`UPDATE admindetails SET profile_photo = ? WHERE adminID = '${id}'`,image)
        connection.release()
        if(result){
            res.status(200).send({auth:true,token:'Successfully Updated'})
        }

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error') 
    }
}

exports.ServiceAdd=async(req,res)=>{
try{
    const date = new Date().toLocaleDateString('en-GB',{timeZone:'IST'})
    const data = {
        adminID:req.vid,
        serviceID:'serv'+Math.floor(Date.now() + Math.random()).toString(),
        firstName:req.body.fname,
        middleName:req.body.mname,
        lastName:req.body.lname,
        companyName:req.body.Cname,
        currentLocation:req.body.clocation,
        Address:req.body.address,
        serviceLocations:req.body.slocation,
        phone:req.body.phone,
        service:req.body.service,
        availableDates:req.body.avDate.toString(),
        serviceRadius:req.body.range,
        serviceImage:req.body.serviceImage,
        dateCreated:date
    }
    console.log(data)
    const connection = await DB.getConnection()
    const [result] = await connection.query('INSERT serviceperson SET ?',data)
    connection.release()
    if(result){
        res.status(200).send({auth:true,serviceID:data.serviceID})
    }
}catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error') 
}
}

exports.serviceType=async(req,res)=>{
try{
    const id = req.body.id
    let obj={}
    const data = req.body.types
    const price= req.body.price
    for(let i =0;i<data.length;i++){
obj['serviceType'+(i+1)]=data[i].type
obj['price'+(i+1)]=price[i].price
    }
    obj['serviceID']=req.body.id
    obj['serviceCategory']=req.body.category
    obj['priceType']= req.body.ptype
console.log(obj)
    const connection = await DB.getConnection()
    const [result] = await connection.query(`SELECT * FROM servicetypes WHERE serviceID ='${id}'`)
    if(result.length<1){
        const [result2]= await  connection.query('INSERT servicetypes SET ?',obj,)
        connection.release()
        if(result2){
            res.status(200).send({auth:true,result2})
        }
    }else{
        const [result2]  = await  connection.query('UPDATE servicetypes SET ? WHERE servicID = ?',obj,id,)
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

exports.ServiceDrone=async(req,res)=>{
try{
    const data={
        DroneName :req.body.dname,
        serviceID :req.body.id,
        droneImage:req.body.droneImage,
        tech : req.body.techSp
        }
        console.log(data)
        const connection = await DB.getConnection()
        const [result] = await  connection.query('INSERT servicedrone SET ?',data,)
        connection.release()
        if(result){
            res.status(200).send({auth:true,result})
        }
}catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error') 
}
}

exports.ServiceLocation=async(req,res)=>{
try{
    const data = {
        latitude:req.body.lat,
        longitude:req.body.lng
    }
    const id = req.body.id
    const connection = await DB.getConnection()
        const [result] = await  connection.query(`UPDATE serviceperson SET ? WHERE serviceID = '${id}'`,data)
        connection.release()
        if(result){
            res.status(200).send({auth:true,token:'added successfully'})
        }
}catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error') 
}
}

exports.findService=async(req,res)=>{
try{
const id = req.vid
const connection = await DB.getConnection()

const [result]= await  connection.query(`SELECT id,serviceID,firstName,middleName,lastName FROM serviceperson WHERE adminID ='${id}'`)
connection.release()
if(result){
    res.status(200).send({auth:true,data:result})
}
}catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error') 
} 
}

exports.updateDates=async(req,res)=>{
try{
    const dates = req.body.dates
    const id = req.body.id
    const connection  =await DB.getConnection()
  const [result] = await  connection.query(`UPDATE serviceperson SET availableDates = ? WHERE serviceID= '${id}'`,dates)
  connection.release()
  if(result){
    res.status(200).send({auth:true,data:result})
  }

}catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error')  
}
}

exports.ServiceImage=async(req,res)=>{
    try{
        const image = req.body.image
        const id = req.body.id
const connection = await DB.getConnection()
const [result] = await connection.query(`UPDATE serviceperson SET serviceImage= ? WHERE serviceID = '${id}' `,image)
connection.release()
if(result){
    res.status(200).send({auth:true,result})
}
    }catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error')  
}
}

exports.ServiceBanner=async(req,res)=>{
try{
const connection = await DB.getConnection()
const id = req.body.id
const image = req.body.image
const [result] = await connection.query(`SELECT * FROM servicebanner WHERE serviceID ='${id}'`)
if(result?.length>0){
    const [result2]= await connection.query(`UPDATE servicebanner SET banner= ? WHERE serviceID = '${id}'`,image)
    connection.release()
    if(result2){
        res.status(200).send({auth:true,result2})
    }
}else{
   
        const data3={
            serviceID:id,
            banner:image
    }
const [result2]= await connection.query('INSERT INTO servicebanner SET ?',data3)
connection.release()
if(result2){
    res.status(200).send({auth:true,data:result2})
}
}
}catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error')  
}
}

exports.ServiceGallery=async(req,res)=>{
    try{
        let obj={}
        console.log(req.body.image)
        const id = req.body.id
        const arr = req.body.image
        for(let i=0; i<arr.length;i++){
            obj['image'+(i+1)] = arr[i]
        }
        obj['serviceID']=id

        console.log(obj)
        const connection = await DB.getConnection()
        const [result]= await connection.query('INSERT INTO servicegallery SET ?',obj)
       connection.release()
        console.log(result)
        if(result){
            res.status(200).send({auth:true,data:result,data2:obj})
        }

    }catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error')  
}
}

// Academy.............

exports.AddCourse=async(req,res)=>{
    try{
        const CiD='Cour'+Math.floor(Date.now() + Math.random()).toString()
        const date = new Date().toLocaleDateString('en-GB',{timeZone:'IST'})
        const courseData={
            "courseID":CiD,
            "Institute_id":req.body.Institute_id,
            "institute_name":req.body.institute_name,
            "course":req.body.course,
            "fees":req.body.fees,
            "state":req.body.state,
            "city":req.body.city,
            "address":req.body.address,
            "startDate":req.body.date,
            "display_image":req.body.display_Image,
            "courseDuration":req.body.courseDuration,
            "courseType":req.body.courseType,
            "latitude":req.body.lat,
            "longitude":req.body.lng,
    "droneType":req.body.droneType,
    "droneCategory":req.body.droneCategory,
    "description":req.body.description,
    "date":date
        }
        const connection = await DB.getConnection()
        const [result] = await connection.query('INSERT INTO courses SET ?',courseData)
       connection.release()
        if(result){
            res.status(200).send({auth:true,token:'successfully added', courseID:CiD})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.FindCourse=async(req,res)=>{
try{
    const id = req.vid
const connection = await DB.getConnection()
const [result] = await connection.query('SELECT id,courseID,course FROM courses WHERE institute_id = ?',id)
connection.release()
if(result){
    res.status(200).send({auth:true,data:result})
}
}catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}


exports.UpdateCourse=async(req,res)=>{
    try{
        const id = req.body._id
        const connection= await DB.getConnection()
        const [result]  = await connection.query('SELECT course,fees,discount,courseDuration FROM courses WHERE courseID = ?',id)
     if(result.length>0){
        const updateField={}
        if(req.body.CourseName!==undefined&&req.body.CourseName!==''){
           updateField.course  = req.body.CourseName
           
        }
        else{
             updateField.course = result[0].course
        }
        if(req.body.fees!==undefined && req.body.fees!==''){
            updateField.fees=req.body.fees
        }
        else{
            updateField.fees=result[0].fees
        }
        if(req.body.discount!==undefined && req.body.discount!==''){
            updateField.discount=req.body.discount
        }
        else{
            updateField.discount=result[0].discount
        }
        if(req.body.courseDuration!==undefined && req.body.courseDuration!==''){
            updateField.courseDuration=req.body.courseDuration
        }
        else{
            updateField.courseDuration=result[0].courseDuration
        }
        console.log(updateField)
        const [result2] = await  connection.query(`UPDATE courses SET course= '${updateField.course}', fees = '${updateField.fees}',discount = '${updateField.discount}', courseDuration ='${updateField.courseDuration}' WHERE courseID = '${id}'`)
        connection.release()
if(result2){
    res.status(200).send({auth:true,token:'successfully updated',result2})
}
     }else{
        connection.release()
     }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.UpdateCourseImage =async(req,res)=>{
    try{
        const image = req.body.image
        const id = req.body.courseID
const connection = await DB.getConnection()
const [result] = await connection.query(`UPDATE courses SET display_image = ? WHERE courseID = '${id}'`,image,)
connection.release()
if(result){
    res.status(200).send({auth:true,token:'Succesfully Updated'})
}   
}catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.AddTrainer=async(req,res)=>{
    try{
        const data={
            courseID:req.body.id,
            trainer_Name:req.body.tname,
            trainer_Experience:req.body.tExp,
            trainer_Category:req.body.topt,
            trainer_Description:req.body.desc,
        }

        const connection = await DB.getConnection()
        const [result] = await connection.query('INSERT INTO coursetrainers SET ?',data)
        connection.release()
        if(result){
            res.status(200).send({auth:true,data:result})
        }

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.AddSyllabus=async(req,res)=>{
    try{
        const sy = req.body.syllabus
        const id = req.body.id
       
    const data = {
        courseID:req.body.id,
        type:req.body.type
    }
     Object.assign(sy,data)
console.log(sy)
     const connection = await DB.getConnection()
     const [result]=await connection.query(`SELECT * FROM coursesyllabus WHERE courseID = '${id}'`)
if(result?.length<1){
const [result2] = await  connection.query(`INSERT INTO coursesyllabus SET ?`,[sy])
connection.release()
if(result2){
res.status(200).send({auth:true,data:result2})
}
}else{
    const [result2] = await  connection.query(`UPDATE coursesyllabus SET ? WHERE courseID = ?`,[sy,id])
    connection.release()      
    if(result2){
            res.status(200).send({auth:true,data:result2})
           }
}
    
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}


exports.CourseBanner=async(req,res)=>{
    try{
    const connection = await DB.getConnection()
    const id = req.body.id
    const image = req.body.image
    const [result] = await connection.query(`SELECT * FROM courseBanner WHERE courseID ='${id}'`)
    if(result?.length>0){
        const [result2]= await connection.query(`UPDATE courseBanner SET banner_Image= ? WHERE courseID = '${id}'`,image)
        connection.release()
        if(result2){
            res.status(200).send({auth:true,result2})
        }
    }else{
       
            const data3={
                courseID:id,
                banner_Image:image
        }
    const [result2]= await connection.query('INSERT INTO courseBanner SET ?',data3)
    connection.release()
    if(result2){
        res.status(200).send({auth:true,data:result2})
    }
    }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
    }

    exports.CourseGallery=async(req,res)=>{
        try{
            let obj={}
            console.log(req.body.image)
            const id = req.body.id
            const arr = req.body.image
            for(let i=0; i<arr.length;i++){
                obj['image'+(i+1)] = arr[i]
            }
            obj['courseID']=id
            const connection = await DB.getConnection()
            const [result]= await connection.query('INSERT INTO photogallery SET ?',obj)
           connection.release()
            console.log(result)
            if(result){
                res.status(200).send({auth:true,data:result,data2:obj})
            }
    
        }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
    }

    exports.UpdateCourseDate=async(req,res)=>{
        try{
            const id = req.body.id
            const date = req.body.date
            const connection = await DB.getConnection()
            const [result] = await  connection.query(`UPDATE courses SET startDate = ? WHERE courseID ='${id}'`,date)
                connection.release()
                if(result){
                    res.status(200).send({auth:true,data:result})
                }

        }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }

exports.getCourseOrders=async(req,res)=>{
try{
    const id = req.vid
    const connection = await DB.getConnection()
    const [result] = await connection.query(`SELECT id,courseName,userName,status,DateandTime FROM courseorders WHERE institute_id ='${id}'`)
    connection.release()
    if(result){
        res.status(200).send({auth:true,data:result})
    }
}catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error')  
}
    }

exports.getServiceOrders= async(req,res)=>{
try{
    const id = req.vid
    const connection = await DB.getConnection()
const [result]= await   connection.query(`SELECT id,userName,subCategory,DateandTime,status,type FROM serviceorders WHERE AdminID ='${id}'`)
    connection.release()
    if(result){
        res.status(200).send({auth:true,data:result})
    }
 
}catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error')  
}
    }

    exports.CourseOrderDetails = async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const id = req.body.id
    const [result] =await connection.query(`SELECT * FROM courseorders WHERE id ='${id}'`)
    console.log(result,id)
    if(result){
        if(result[0].status !=='seen'){
const [result2]= await  connection.query(`UPDATE courseorders SET status = "seen" WHERE id = '${id}'`)
connection.release()
res.status(200).send({auth:true,data:result})
        }else{
            connection.release()
            res.status(200).send({auth:true,data:result})      
        }
}else{
        connection.release()
    }

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
    }

    
    exports.ServiceOrderDetails = async(req,res)=>{
        try{
            const connection = await DB.getConnection()
            const id = req.body.id
        const [result] =await connection.query(`SELECT * FROM serviceorders WHERE id ='${id}'`)
        console.log(result,id)
        if(result){
            if(result[0].status !=='seen'){
    const [result2]= await  connection.query(`UPDATE serviceorders SET status = "seen" WHERE id = '${id}'`)
    connection.release()
    res.status(200).send({auth:true,data:result})
            }else{
                connection.release()
                res.status(200).send({auth:true,data:result})      
            }
    }else{
            connection.release()
        }
    
        }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
        }

        exports.CalenderEvents=async(req,res)=>{
            try{
                const id = req.vid
                const connection = await DB.getConnection()
                const [result] = await  connection.query(`SELECT id,bookedDates,subCategory,userName,servicePerson FROM serviceorders WHERE AdminID = '${id}'`,)
               
                if(result){
                    const [result2] = await  connection.query(`SELECT id,bookingDates,productName,userName,orderType FROM rentalorders WHERE AdminID = '${id}'`,)
                    connection.release()
                    res.status(200).send({auth:true,data:result,result:result2})
                }

            }catch(err){
                console.log(err)
                res.status(500).send('Internal Server Error')  
            }
        }

        exports.JobPost=async(req,res)=>{
            try{
                const connection = await DB.getConnection()
                const data ={
                    jobtitle:req.body.title,
                    adminID:req.vid,
                    companyname:req.body.cname,
                    jobtype:req.body.jtype,
                    location:req.body.location,
                    department:req.body.dtype,
                    salaryrange:req.body.salary,
                    jobdescription:req.body.description,
                    RequiredQualifications:req.body.rqualification,
                    preferredQualifications:req.body.pqualification,
                    keyResponsibilities:req.body.responsibilities,
                    benefits:req.body.benefits,
                    lastdate:req.body.ldate,
                    companyDescription:req.body.cdescription,
                    email:req.body.email,
                    phone:req.body.phone,
                    status:'Active',
                    date:new Date().toLocaleDateString('en-GB',{timeZone:'IST'})
                }
                const [result]= await connection.query('INSERT INTO jobs SET ?',[data])
                connection.release()
                if(result){
                    res.status(200).send('Successfully Posted')
                }

            }catch(err){
                console.log(err)
                res.status(500).send('Internal Server Error')  
            }
        }

        exports.titleName=async(req,res)=>{
            try{
                const connection = await DB.getConnection()
                const [result] = await connection.query(`SELECT id,jobtitle FROM jobs WHERE adminID='${req.vid}'`)
                if(result){
                    res.status(200).send(result)
                }

            }catch(err){
                console.log(err)
                res.status(500).send('Internal Server Error')  
            }
        }

        exports.jobstatus=async(req,res)=>{
            try{
                const connection = await DB.getConnection()
                const data = req.body.status
                const [result] = await connection.query(`UPDATE jobs SET status = ? WHERE id = '${req.body.id}'`,[data])
                if(result){
                    res.status(200).send(result)
                }

            }catch(err){
                console.log(err)
                res.status(500).send('Internal Server Error')  
            }
        }
        