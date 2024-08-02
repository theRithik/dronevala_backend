const DB = require('../middleware/Database')
const jwt = require('jsonwebtoken')
const bcypt = require('bcryptjs')


exports.superLogin= async(req,res)=>{
    try{
        const email = req.body.email
        const connection = await DB.getConnection()
        const [result] = await    connection.query(`SELECT * FROM superAdmin WHERE email = '${email}'`,)
            connection.release()
            if(result.length>0){
                const hashedPassword = bcypt.compareSync(req.body.password,result[0].password)
                
                if(!hashedPassword){
                    res.status(300).send('You have enterd the wrong password')
                }
                else{
                    const token = jwt.sign({"role":"Super Admin","id":result[0].id,"exp":Math.floor(Date.now() / 1000) + (7*24*60*60)},process.env.ADMIN_SECRETE,{})
                    res.status(200).send({auth:true,token:token,id:result[0].id})
                }
            }else{
                res.status(300).send('No Admin Found ')
            }
           
    }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }

    exports.getVendors=async(req,res)=>{
        try{
            const connection = await DB.getConnection()
            const [result] = await    connection.query(`SELECT * FROM superAdmin WHERE id = '${req.id}'`)
            connection.release()
            if(result){
                res.status(200).send({auth:true,data:result})
            }
        }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }

    exports.TravelCharges=async(req,res)=>{
        try{
            const data ={
                distanceA:req.body.distanceA,
                distanceB:req.body.distanceB,
                price:req.body.price
            }
            const connection = await DB.getConnection()
            const [result] = await    connection.query(`SELECT * FROM travelCharges WHERE distanceA = '${req.body.distanceA}' AND distanceB = '${req.body.distanceB}'`,)
            if(result.length>0){
                connection.release()
                res.status(300).send('Already data is present please use Update to update the details')
      
            }else{
                const [result3] = await connection.query('INSERT INTO travelCharges SET ?',data,)
                connection.release()
                if(result3){
                    res.status(200).send({auth:true,token:result3})
                }
            }
        }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }

    exports.UpdateCharges=async(req,res)=>{
        try{
            const distanceA=req.body.distanceA
            const distanceB=req.body.distanceB
              const price=req.body.price
            const connection = await DB.getConnection()
            const [result] = await   connection.query(`SELECT * FROM travelCharges WHERE distanceA = '${req.body.distanceA}' AND distanceB = '${req.body.distanceB}'`,)
            if(result.length>0){
               const [result3] = await   connection.query(`UPDATE travelCharges  SET price = '${price}' WHERE distanceA = '${distanceA}' AND distanceB = '${distanceB}'`)
               if(result3){
                res.status(200).send({auth:true,token:result3})
               }
            }
        }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }

    exports.gettcharges=async(req,res)=>{
        try{
            const connection = await DB.getConnection()
            const [result] = await    connection.query('SELECT * FROM travelCharges')
            connection.release()
            if(result){
                res.status(200).send(result)
            }
        }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }

    exports.getServiceorders=async(req,res)=>{
        try{
            const connection = await DB.getConnection()
            const [result] = await    connection.query('SELECT * FROM serviceorders')
            connection.release()
            if(result){
                res.status(200).send(result)
            }
        }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }

    exports.getcourseOrders=async(req,res)=>{
        try{
            const connection = await DB.getConnection()
            const [result] = await    connection.query('SELECT * FROM courseorders')
            connection.release()
            if(result){
                res.status(200).send(result)
            }
        }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }

    exports.CourseFee=async(req,res)=>{
        try{
            const price = req.body.price
            const connection = await DB.getConnection()
            const [result] = await connection.query(`UPDATE courseAdvanceFee SET fee = '${price}' WHERE id= 1`)
            connection.release()
            if(result){
                res.status(200).send({auth:true,token:result})
            }

        }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }

    exports.GetVendors=async(req,res)=>{
        try{
           
            const connection = await DB.getConnection()
            const [result] = await connection.query( 'SELECT id,Institute_Name,Name,Institute_Email FROM admin')
            connection.release()
            if(result){
                res.status(200).send(result)
            }

        }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }

    exports.GetUser=async(req,res)=>{
        try{
           
            const connection = await DB.getConnection()
            const [result] = await connection.query( 'SELECT id,uniqID,name,email FROM users')
            connection.release()
            if(result){
                res.status(200).send(result)
            }

        }catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }

    exports.Getallorders=async(req,res)=>{
try{
    const connection = await DB.getConnection()
    const [result] = await connection.query('SELECT * FROM courseorders')
    const [result2] = await connection.query('SELECT * FROM serviceorders')
    const [result3]  = await connection.query('SELECT * FROM rentalorders')
    const [result4] = await connection.query('SELECT * FROM storeorders')
    connection.release()
    if(result && result2 && result3 && result4){
    res.status(200).send({data:result,data2:result2,data3:result3,data4:result4})
    }
}catch(err){
            console.log(err)
            res.status(500).send('Internal Server Error')  
        }
    }