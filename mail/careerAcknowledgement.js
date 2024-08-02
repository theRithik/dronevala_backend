
async function careersAcknowlegmentMail (data){

    return `<!DOCTYPE html>
          <html>
              <head>
                  <meta charset="utf-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <title>Acknowledegement</title>
                  <meta name="description" content="">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style type="text/css">
                        @font-face {
                      font-family: 'YourCustomFont';
                      src: url('/mySql/droneApp/assests/Poppins.woff2') format('woff2'); /* Use appropriate font format */
                  }
                  
                  body{
                      font-family: 'Poppins', sans-serif;
                  }
                      div.board{
                          background-color:#fefefe ;
                          width: 800px;
                          padding: 30px;
                          position: relative;
                          padding-bottom: 0;
                      
                      }
                     h1{
                      color: #0166e7;
              font-size: 36px;
              font-style: normal;
              font-weight: normal;
              line-height: 150%;
              word-spacing: 3px;
                     }
          
                     .borderline{
                    border-left: 2px solid #026fe5;
                      height: 50px;
                      display: block;
                     }
          
                     p{
                      color: #00356c;
                      font-size: 14px;
                      line-height: 150%;
                      text-align: justify;
                     }
          
                     .footer{
                      background-color: #00356c;
                      height: 200px;
                      position: relative;
                      display: flex;
                      justify-content: center;
                      position: absolute;
                      left: -5px;
                      width: 100%;
                     }
          
                     @media screen and (max-width:600px){
                      .droneStyle{
                          top:50px
                      }
                     }
                  </style>
              </head>
              <body>
                 <div class="board">
                 <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0"> 
                 <tbody> 
                 <tr> 
                 <td width="30%">
                  <img src="https://dronevala.com/images/logo.png" style="width: 60%;" alt="logo"/>
                  </td>
                  <td width="30%"></td>
                  <td width="40%">
                      <img style="width:100%" src="https://agmay.in/images/flight.png"  alt="drone taxi"/>
                      </td>
                      </tr> 
                      </tbody> 
                      </table>
                      <div style="width: 60%;margin-top: 10%;padding: 20px;">
                      <h1 style="color: #0166e7;">Acknowledgement of Your Job Application</h1>
                      <span class="borderline"></span>
                  </div>
                  <div style="padding: 20px;margin-top: 30px;margin-right: 10%;padding-bottom: 40px;">
                      <p><strong style="color: #00356c;">Dear ${data.name}</strong></p>
                      <p>I hope this email finds you well. I am writing to acknowledge that we have received your recent job application for the ${data.position} position at ${data.companyname}. Thank you for taking the time to apply and for considering a career with us.</p>
              <p>We understand the effort and thought that goes into submitting an application, and we want to assure you that your application have been received and currently under review by our hiring team. While we carefully consider each application we receive, it may take some time before we are able to provide an update on the status of your application. We appreciate your patience in advance. </p>
              <p>In the meantime, if you have any questions or would like to provide any additional information, please feel free to reach out to us at careers@agmay.in. We value your interest in joining our team and look forward to the possibility of working together. </p>
              <p>Thank you once again for your application and interest in Dronevala.</p>
              <p><strong>Warm Regards,</strong></p>
              <p><strong>Dronevala AI</strong></p>      
          </div>
         
                 </div>
                 <div class="footer">
                 <table align="center" style="padding-top:10%" cellpadding="0" cellspacing="0" border="0"> 
                 <tbody> 
                 <tr style="text-align:center">
                 <td>
                 <img src="https://agmay.in/assests/Instagram.png" style="width:15px;padding-right:10px" alt="instagram"/>
                
                
                 <img src="https://agmay.in/assests/twitter.png" style="width:15px;padding-right:10px" alt="instagram"/>
                
                 <img src="https://agmay.in/assests/youtube.png" style="width:18px" alt="instagram"/>
                
                 </tr>
                 <tr> 
                 <td>
             <span style="color: #dce8f3;font-size: 12px;word-spacing: 2px;"> BJR Nagar  Malkajgiri  Hyderabad, Telangana, INDIA</span>
             </td>
             </tr>
             <tr>  
             <td style="text-align:center">     
             <span style="color: #dce8f3;font-size: 12px;">&copy; All Right Reserved</span>
                 </td>
                     </tr> 
                 </tbody> 
                 </table>
                            </div>
                
              </body>
          </html>
          
          `
  }
      
      module.exports = careersAcknowlegmentMail
  
  
  