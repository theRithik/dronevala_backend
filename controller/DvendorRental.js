const DB = require('../middleware/Database')


exports.AddRental = async(req,res)=>{
    try{
        
               
    const date = new Date().toLocaleString('en-IN',{timeZone:'IST'},{format:'dd/mm/yyyy'})
    const data ={
        adminID:req.vid,
        rentalID:'Ren'+Math.floor(Date.now() + Math.random()).toString(),
        productName:req.body.name,
        brand:req.body.brand,
        companyName:req.body.company,
        image:req.body.image,
        state:req.body.state,
        city:req.body.city,
        address:req.body.address,
        productCategory:req.body.productType,
        droneCategory:req.body.droneCategory,
        description:req.body.desc,
        features:req.body.features,
        latitude:req.body.lat,
        longitude:req.body.lng,
        price:req.body.price,
        distance:req.body.distance,
           deliveryCharges:req.body.delivery,
        date:date,
    }

    const connection = await DB.getConnection()
    const [result] = await connection.query('INSERT INTO rentalProducts SET ?',data)
    connection.release()
    if(result){
        res.status(200).send({auth:true,data:data.rentalID})
    }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.AddRentalProduct=async(req,res)=>{
    try{
        const date = new Date().toLocaleString('en-IN',{timeZone:'IST'},{format:'dd/mm/yyyy'})
        const data ={
            adminID:req.vid,
            rentalID:'Ren'+Math.floor(Date.now() + Math.random()).toString(),
            productName:req.body.name,
            brand:req.body.brand,
            companyName:req.body.company,
            image:req.body.image,
            state:req.body.state,
            city:req.body.city,
            address:req.body.address,
            productCategory:req.body.productType,
            description:req.body.desc,
            features:req.body.features,
            latitude:req.body.lat,
            longitude:req.body.lng,
            distance:req.body.distance,
            deliveryCharges:req.body.delivery,
            date:date
        }
        const connection = await DB.getConnection()
        const [result] = await connection.query('INSERT INTO rentalProducts SET ?',data)
        connection.release()
        if(result){
            res.status(200).send({auth:true,data:data.rentalID})
        }

    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}


exports.findRental=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await  connection.query(`SELECT id,rentalID,productName FROM rentalProducts WHERE adminID ='${req.vid}'`)
        if(result){
            res.status(200).send({auth:true,data:result})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.updateProductImage=async(req,res)=>{
    try{
        const connection = await DB.getConnection()
        const [result] = await connection.query(`UPDATE rentalProducts SET image = '${req.body.image}' WHERE rentalID ='${req.body.id}'`)
        if(result){
            res.status(200).send({auth:true,data:'Updated Successfully'})
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.updateproductdetails=async(req,res)=>{
    try{
        const id = req.body.rentalID
        const connection = await DB.getConnection()
        const [result] = await connection.query('SELECT * FROM rentalProducts WHERE rentalID = ?',id)
        if(result.length<=0){
            connection.release()
            res.status(300).send('An error occured')
        }
        else{
            const updateField={}
        if(req.body.company!==undefined&&req.body.company!==''){
           updateField.companyName  = req.body.company
           
        }
        else{
             updateField.companyName = result[0].companyName
        }
        if(req.body.state!==undefined && req.body.state!==''){
            updateField.state=req.body.state
        }
        else{
            updateField.state=result[0].state
        }
        if(req.body.city!==undefined && req.body.city!==''){
            updateField.city=req.body.city
        }
        else{
            updateField.city=result[0].city
        }
        if(req.body.address!==undefined && req.body.address!==''){
            updateField.address=req.body.address
        }
        else{
            updateField.address=result[0].address
        }
        if(req.body.desc!==undefined && req.body.desc!==''){
            updateField.description=req.body.desc
        }
        else{
            updateField.description=result[0].description
        }
        if(req.body.features!==undefined && req.body.features!==''){
            updateField.features=req.body.features
        }
        else{
            updateField.features=result[0].features
        }
        if(req.body.price!==undefined && req.body.price!==''){
            updateField.price=req.body.price
        }
        else{
            updateField.price=result[0].price
        }
        if(req.body.delivery!==undefined && req.body.delivery!==''){
            updateField.deliveryCharges=req.body.delivery
        }
        else{
            updateField.deliveryCharges=result[0].deliveryCharges
        }

        if(req.body.distance!==undefined && req.body.distance!==''){
            updateField.distance=req.body.distance
        }
        else{
            updateField.distance=result[0].distance
        }
        if(req.body.lat!==undefined && req.body.lat!==''){
            updateField.latitude=req.body.lat
        }
        else{
            updateField.latitude=result[0].latitude
        }
        if(req.body.lng!==undefined && req.body.lng!==''){
            updateField.longitude=req.body.lng
        }
        else{
            updateField.longitude=result[0].longitude
        }
      const [result2] = await connection.query(`UPDATE rentalProducts SET ? WHERE rentalID = '${id}'`,[updateField])
      connection.release()  
      if(result2){
            res.status(200).send({auth:true,token:'successfully updated',result2})
         }
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
}

exports.RentalGallery=async(req,res)=>{
    try{
        let obj={}
        console.log(req.body.image)
        const id = req.body.id
        const arr = req.body.image
        for(let i=0; i<arr.length;i++){
            obj['image'+(i+1)] = arr[i]
        }
        obj['rentalID']=id
        const connection = await DB.getConnection()
        const [result]= await connection.query('INSERT INTO rentalgallery SET ?',obj)
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

exports.RentalBanner=async(req,res)=>{
    try{
    const connection = await DB.getConnection()
    const id = req.body.id
    const image = req.body.image
    const [result] = await connection.query(`SELECT * FROM rentalBanner WHERE rentalID ='${id}'`)
    if(result?.length>0){
        const [result2]= await connection.query(`UPDATE rentalBanner SET banner= ? WHERE rentalID = '${id}'`,image)
        connection.release()
        if(result2){
            res.status(200).send({auth:true,result2})
        }
    }else{
       
            const data3={
            rentalID:id,
                banner:image
        }
    const [result2]= await connection.query('INSERT INTO rentalBanner SET ?',data3)
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
    
    exports.productStatus=async(req,res)=>{
        try{
            const connection = await DB.getConnection()
            const id = req.body.id
            const data ={
                status:req.body.status
            }
            const [result] = await connection.query(`UPDATE  rentalProducts SET ? WHERE rentalID = '${id}'`,data)
            if(result){
                res.status(200).send('Successfully Updated')
            }
        }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
    }

    exports.rentalorder=async(req,res)=>{
        try{
const connection = await DB.getConnection()
const [result] = await  connection.query(`SELECT id,userName,productName,DateandTime,status,type FROM rentalorders WHERE AdminId ='${req.vid}'`)
    if(result){
        res.status(200).send({auth:true,data:result})
    }           
        }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')  
    }
    }


    exports.rentalorderDetails=async(req,res)=>{
        try{
            console.log(req.body)
            const connection = await DB.getConnection()
            const [result] = await  connection.query(`SELECT * FROM rentalorders WHERE id ='${req.body.id}'`)
                if(result){
                const [result2]   = await connection.query(`UPDATE rentalorders SET status = "seen" WHERE id = '${req.body.id}'`)
                       connection.release()
                      if(result2){
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
