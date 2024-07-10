function verifyMail (data){
    return ` <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
            <title>Email Verification</title>
            <style type="text/css">
                
             
            div.bord{
                margin: 20px 10px 20px 10px;
                border:1px solid #e8e8e8;
                border-radius:10px;
                padding:20px;
                background-color:aliceblue;
            }
            button.buttonReg{
                padding: 5px 20px 5px 20px;
    border-radius: 20px;
    background-color: black;
    color: white;
            }
            p{
                line-height: 1.5
            }
            p.foot{
                margin-bottom:0;
                margin-top:5px;
            }
           p.foot2{
                margin-top:5px;
            }
            .imglog{
                width:40px;
                display:block;
            }
            </style>
        </head>
        <body>
    <div class="bord">
    <h1 class="brand" align="center"> <img src="https://dronevala.com/background/emailLogo.png" width="40px" title="Logo" class='imglog' alt="logo"/><span>Dronevala</span></h1>
    <p>Dear ${data.name}</p>
    <p>To ensure the credibility of our platform, please verify your registration by clicking the 
    <a href="https://dronevala.com/vendors/verify/${data.token}" target="_blank" rel='noopener noreferrer'><button class="buttonReg">Register</button></a>
    </p>
    <p>Once verified, you can set up your service profile and connect with potential customers on Dronevala.com .</p>
   
    <p >Welcome aboard!</p>
    <p class="foot">Best regards,</p>
    <p class="foot2">Team Dronevala
            </div>
        </body>
    </html> `
}

module.exports =verifyMail