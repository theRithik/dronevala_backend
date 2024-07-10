
function RegisterMail(data){
    return `<!DOCTYPE html>
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
                    line-height: 1.5;
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
    <h1 class="brand" align="center"><img src="https://dronevala.com/background/emailLogo.png" title="Logo" class='imglog' alt="dronevala"/><span>Dronevala</span></h1>
    <p>Dear ${data.Name}</p>
    <p>Welcome to Dronevala.com! To ensure the security and compliance of our platform, we kindly ask you to complete the registration process by verifying your email address and accepting our Terms and Conditions.</p>
   <p>Verify your email by clicking on this  <a href="http://localhost:3000/user/verify/${data.token}" target="_blank" rel='noopener noreferrer'><button class="buttonReg">Verify</button></a></p>
    <p>Once completed, you'll have full access to Dronevala.com </p>
    <p>Thank you for joining our community!</p>
    <p class="foot">Many Thanks,</p>
    <p class="foot2">Team Dronevala</p>
            </div>
        </body>
    </html> `
}

module.exports = RegisterMail