const DB = require('../middleware/Database')


exports.AllRental=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await connection.query('SELECT * FROM rentalProducts')
        connection.release()
        if(result){
            res.status(200).send(result)
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.RentalDetails=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT * FROM rentalProducts WHERE rentalID = '${req.body.id}'`)
        connection.release()
        if(result){
            res.status(200).send(result)
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.RentalBanner= async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await connection.query(`SELECT * FROM rentalBanner WHERE rentalID = '${req.body.id}'`)
        if(result){
            res.status(200).send(result)
        }

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.RentalGallery=async(req,res)=>{
    try{
        const id = req.body.id
        const connection= await DB.getConnection()
        const [result] = await connection.query(`SELECT * FROM rentalgallery WHERE rentalID= '${id}'`)
        connection.release()
if(result){
    res.status(200).send(result)
}
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.RentalOrderIntiated=async(req,res)=>{
    try{
        const data = {
            uniqID:req.body.uniqID,
            AdminID:req.body.adminId,
            rentalID:req.body.rentalID,
            brand:req.body.brand,
            companyName:req.body.company,
            productName:req.body.productName,
            paid:req.body.paid,
            userID:req.body.userId,
            userName:req.body.name,
            userEmail:req.body.uemail,
            userPhone:req.body.phone,
            booking:req.body.booking,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            type:req.body.type,
            price:req.body.price,
            address:req.body.Address,
            bookedDates:req.body.dates.toString(),
            date:new Date().toLocaleString('en-IN',{timeZone:'IST'},{format:'dd/mm/yyyy'}),
            status:'unseen',
            subtotal:req.body.subtotal,
            gst:req.body.gst,
            deliveryCharges:req.body.travelCharges,
            distance:req.body.distance +' Km'
        }
console.log(data)
        const phone = req.body.phone
        const id = req.body.userId

        const connection = await DB.getConnection()
        const [result]= await connection.query(`UPDATE userDetails SET phone = ? WHERE uniqID = ?`,[phone,id])
        if(result){
            const [result2] = await  connection.query('INSERT INTO rentalOrderInitated SET ?',[data])
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

exports.getuserorder=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result]= await connection.query(`SELECT * FROM  rentalorders WHERE adminID='${req.id}'`)
        if(result){
            res.status(200).send({auth:true,data:result})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}