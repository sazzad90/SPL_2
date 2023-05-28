const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');
const sgMail = require('@sendgrid/mail');
const OTPGenerator = require('otp-generator');
const { useState } = require('react');
const mammoth = require('mammoth');
const Docxtemplater = require('docxtemplater');
const handlebars = require('handlebars');
const bcrypt = require('bcrypt');
const AuthService = require('./AuthService')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const async = require('async');

const app = express();

// app.use(cookieParser);
// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: 'secret',
// }))


app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
// app.set('views', path.join('/views', 'views'));
app.set('views', path.join(__dirname, '../views'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'spldb'
})

db.connect(err => {
    if(err){
        return err;
    }
})



app.listen(5050, () => {
    console.log('Listening on port 5050.');
})


app.post('/submit', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const employeeID = req.body.employeeID;
    const userID = req.body.userID;
    const secretKey = req.body.secretKey;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const isMatch = bcrypt.compareSync(password, hashedPassword);

    if (isMatch) {
      db.query("SELECT * FROM employee where employee_id=?",[employeeID],(err, result) =>{
        if (err) {
          console.log(err);
      } else {
        const name = result[0].name;

        const userType = result[0].designation;
        const dept_name = result[0].dept_name;
        console.log(dept_name);
        db.query("SELECT * FROM department where dep_name=?",[dept_name],(err, result1) =>{
          if (err) {
            console.log(err);
        } else {
          const dept_id = result1[0].dep_id;

        db.query("INSERT into userdb(Employee_id,Name, Email, Password, userID,dep_id,userType) values(?,?,?,?,?,?,?)",
        [employeeID,name,email, hashedPassword, userID,dept_id,userType], (err, result2) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result2);
            }
        });
      }

      })

       
    }
})
    }
  })


//creating sign up token
app.post('/createToken', (req, res) => {
    const secretKey = crypto.randomBytes(64).toString('hex');
    const userID = crypto.randomBytes(32).toString('hex');
    const payload = { userID: userID }

    const token = jwt.sign(payload, secretKey);

    console.log({ userID, token, secretKey })

    res.send({ userID, token, secretKey });
})


let loggingInfo = [];

app.post('/get', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const sign = false;

    db.query("SELECT * FROM userdb where email=?", [email], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result[0]) {
                const hashedPassword = result[0].Password
                const isMatch = bcrypt.compareSync(password, hashedPassword);

                const secretKey = crypto.randomBytes(64).toString('hex');
                AuthService.setSecretKey(secretKey)

                const encryptionKey = crypto.createHash('sha256').update(result[0].UserType).digest();
                const iv = Buffer.alloc(16, 0);

                const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);

                let encryptedSecretKey = cipher.update(secretKey, 'utf8', 'hex');
                encryptedSecretKey += cipher.final('hex');

                const payload = { userID: result[0].UserType }
                const token = jwt.sign(payload, encryptedSecretKey);

                if (isMatch) {
                    console.log(result)
                    res.send({ sign: true, token, result });
                    loggingInfo.push(email);
                    console.log(loggingInfo[loggingInfo.length - 1]);

                    //session
                    // req.session.email = email;
                    // console.log(req.session.email);
                    // req.session.save();
                }
                else {
                    res.send(sign)
                }
            }
            else {
                res.send(sign)
            }
        }
    });
});




// OTP generation
sgMail.setApiKey('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');



app.post('/authentication', async (req, res) => {
    const email = req.body.email;
    // const otp = crypto.randomInt((1000, 9999)).toString()
    const otp = OTPGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });


    const msg = {
        to: email,
        from: 'bsse1207@iit.du.ac.bd',
        subject: 'OTP Verification',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <title>OTP Verification</title>
                <style type="text/css">
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        color: #333;
                        background-color: #f2f2f2;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 5px;
                        box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
                    }
                    h1 {
                        font-size: 24px;
                        font-weight: normal;
                        margin-top: 0;
                        margin-bottom: 20px;
                        text-align: center;
                    }
                    p {
                        margin-top: 0;
                        margin-bottom: 20px;
                        line-height: 1.5;
                    }
                    .otp-box {
                        display: inline-block;
                        padding: 10px;
                        border: 2px solid #ccc;
                        background-color: #f9f9f9;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>OTP Verification</h1>
                    <p> As part of our security measures, we need you to verify your email account with an one-time password (OTP).</p>
                    <p>
                        <div class="otp-box">${otp}</span>
                    </p>
                    <p>Please enter this OTP in the required field to complete your account verification.</p>
                    <p>Thank you</p>

                </div>
            </body>
            </html>
        `
    };
    sgMail.send(msg);
    console.log('otp: ',otp);

    res.send(otp);
})



//employeeID checking

app.post('/checkEmployeeID', (req, res) => {
  const employeeID = req.body.employeeID;

  db.query("SELECT * FROM employee WHERE employee_id = ?", [employeeID],(err, result) => {
    if (err) {
        res.send(err)
     } else{
         if(result.length > 0) {
          res.send(result);
        }else{
          res.send('Invalid Employee ID');
         }
     }
  })
})

app.post('/checkEmail', (req, res) => {
  const email = req.body.email;
  const employeeID = req.body.employeeID;
  console.log(employeeID,email);
db.query("SELECT * FROM employee WHERE employee_id = ?", [employeeID],(err, result1) => {
  if (err) {
    res.send(err)
 } else{
  console.log(result1[0].email);
      if(result1[0].email === email) {
        res.send(result1);
      }else{
        console.log('haha')

        res.send('Invalid Email ID');
      } }
})
})



//fetch profile information
app.get('/fetchProfile/:email', (req, res) => {
  const info =loggingInfo[loggingInfo.length-1];
  const email = req.params.email;
  console.log(email);
          db.query("SELECT * from userdb where email = ?",[email], (err,result)=>{
          if (err) {
            console.error(err);
        }
        else{
          console.log('r: ',result);
          const name = result[0].Name;
          const email = result[0].Email;
          const designation = result[0].UserType;

          res.send({name, email,designation});

        }
        })

})


// delete profile
app.post('/deleteProfile', (req, res) => {
  const email = req.body.email;

  db.query("DELETE from userdb where email = ?",[email], (err,result)=>{
    if (err) {
      console.error(err);
  }
  else{
    res.send(result);

  }
  })

}) //forward event notice via mail

 const http = require('http');
const { log } = require('console');

const server = http.createServer((req, res) => {
  // Handle HTTP requests
});
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });

server.listen(8000, () => {
    console.log('Listening on port 8000.');
})


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('admin-notification', (data) => {
    console.log(`Received admin notification: ${data}`);
    // Send the admin notification to all connected clients
    // socket.broadcast.emit('admin-notification', data)
    io.emit('admin-notification', data);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


//  app.post('/forwardEventNotice', (req, res) => {

//     db.query("SELECT MAX(eventid) INTO @max_id FROM eventNotice",(err2,result1)=>{
//         //console.log("loop1");
//         if (err2) {
//             console.error(err2);
//             return res.status(500).send('An error occurred while fetching the maximum event ID');
//         }
//         db.query("SELECT * FROM eventNotice WHERE eventid = @max_id", (err3, result) => {
//             if (err3) {
//                 console.error(err3);
//                 return res.status(500).send('An error occurred while fetching the latest event notice');
//             }
//             else{
//                 const name = result[0].name;
//                 const startingDate = result[0].startingDate;
//                 const deadline = result[0].deadline;
//                 res.send({ name, startingDate, deadline });
//             }
//         })
//     })
            

//  })


 app.post('/forwardEventNotice', (req, res) => {

  db.query("SELECT MAX(notice_id) INTO @max_id FROM notice where type = 'event'",(err2,result1)=>{
      //console.log("loop1");
      if (err2) {
          console.error(err2);
          return res.status(500).send('An error occurred while fetching the maximum event ID');
      }
      db.query("SELECT * FROM notice WHERE notice_id = @max_id", (err3, result) => {
          if (err3) {
              console.error(err3);
              return res.status(500).send('An error occurred while fetching the latest event notice');
          }
          else{
              const startingDate = result[0].starting_date;
              const deadline = result[0].deadline;
              const eventId = result[0].event_id;
              db.query("SELECT * FROM events WHERE event_id = ?", [eventId],(err4, result1) => {
                if (err4) {
                  console.error(err4);
              }
              else{
                const name = result1[0].name;
                res.send({name, startingDate,deadline});

              }
              })

          }
      })
  })
          

})




 

//forward team list notice via mail

app.post('/forwardTeamlistNotice', (req, res) => {

  //  db.query("SELECT MAX(noticeid) INTO @max_id FROM teamlistNotice",(err2,result1)=>{
  //      //console.log("loop1");
  //      if (err2) {
  //          console.error(err2);
  //          return res.status(500).send('An error occurred while fetching the maximum event ID');
  //      }
  //      db.query("SELECT * FROM teamlistNotice WHERE noticeid = @max_id", (err3, result) => {
  //          if (err3) {
  //              console.error(err3);
  //              return res.status(500).send('An error occurred while fetching the latest event notice');
  //          }
  //          else{
  //              const name = result[0].name;
  //              const startingDate = result[0].startingDate;
  //              const deadline = result[0].deadline;
  //              res.send({ name, startingDate, deadline });
  //          }
  //      })
  //  })

  db.query("SELECT MAX(notice_id) INTO @max_id FROM notice where type = 'teamlist'",(err2,result1)=>{
    //console.log("loop1");
    if (err2) {
        console.error(err2);
        return res.status(500).send('An error occurred while fetching the maximum event ID');
    }
    db.query("SELECT * FROM notice WHERE notice_id = @max_id", (err3, result) => {
        if (err3) {
            console.error(err3);
            return res.status(500).send('An error occurred while fetching the latest event notice');
        }
        else{
            const startingDate = result[0].starting_date;
            const deadline = result[0].deadline;
            const eventId = result[0].event_id;
            db.query("SELECT * FROM events WHERE event_id = ?", [eventId],(err4, result1) => {
              if (err4) {
                console.error(err4);
            }
            else{
              const name = result1[0].name;
              res.send({name, startingDate,deadline});

            }
            })

        }
    })
})
           

})



// post event notice
let event = '';
let date = '';


app.post('/eventNotice', (req, res) => {
  
  date = req.body.date;
  event = req.body.event;


  res.sendStatus(200);
  console.log(event)
  console.log('posted notice received.')
});

app.get('/eventNotice', (req, res) => {
    res.send({ event,date });
    console.log(event, date)
    console.log('posted notice bounced back.')
  });




// remove post from title page
// let showPost = true;
// app.post('/removePost', (req, res) => {
//     showPost = false;
//     console.log(showPost);
//   });
  
//   app.get('/removePost', (req, res) => {
//       res.send({ showPost });
//       console.log(showPost)
//     });

 //send event notice via mail
app.post('/sendEventNotice', async(req, res) => {

let emailList;

db.query("SELECT email FROM userdb where usertype = 'Head of Dept/inst.'", (err1, results)=> {
   
    if (err1) {
        console.error(err1);
        return res.status(500).send('An error occurred while fetching email addresses');
    }

     emailList = results.map(row => row.email);
     console.log(emailList)

    });
    db.query("SELECT MAX(eventid) INTO @max_id FROM eventNotice",(err2,result1)=>{
        //console.log("loop1");
        if (err2) {
            console.error(err2);
            return res.status(500).send('An error occurred while fetching the maximum event ID');
        }
        db.query("SELECT * FROM eventNotice WHERE eventid = @max_id", (err3, result) => {
            if (err3) {
                console.error(err3);
                return res.status(500).send('An error occurred while fetching the latest event notice');
            }
            
            const name = result[0].name;
            const startingDate = result[0].startingDate;
            const deadline = result[0].deadline;

            let i = 0;

            //results.forEach((row) => {
            const msg = {
                to: emailList,
                from: 'bsse1207@iit.du.ac.bd',
                subject: 'Event Notice',
                html: `Greetings,<br><br>
        
                There will be an Inter department <strong>${name}</strong> competition from <strong>${startingDate}</strong>. We are delighted to invite you to participate in this competition. You are requested to fill up the registration form before the deadline date <strong>${deadline}</strong><br><br>
                
                Thanks,<br>
                The Director<br>
                Physical Education Center<br>
                University of Dhaka`
            };
            //console.log(row.email);   
            sgMail.send(msg);  
        
        //})
        res.send("haha");
           
        });  

    }); 
});



    // app.post('/sendEventNotice', (req, res) => {
    //     db.query("SELECT MAX(eventid) INTO @max_id FROM eventnotice", (err, result) => {
    //         if (err) throw err;
            
    //         const maxId = result[0].max_id;
            
    //         db.query("SELECT * FROM eventnotice WHERE eventid = ?", [maxId], (err, result) => {
    //             if (err) throw err;
                
    //             const name = result[0].name;
    //             const startingDate = result[0].startingDate;
    //             const deadline = result[0].deadline;
    
    //             db.query("SELECT email FROM userdb", (err, results) => {
    //                 if (err) {
    //                     console.log(err);
    //                 } else {
    //                     results.forEach(result => {
    //                         const email = result.Email;
    
    //                         const msg = {
    //                             to: email,
    //                             from: 'bsse1207@iit.du.ac.bd',
    //                             subject: 'Team List Submission Notice',
    //                             html: `Greetings,<br><br>
    
    //                             There will be an Inter department <strong>${name}</strong> competition from <strong>${startingDate}</strong>. We are delighted to invite you to participate in this competition. You are requested to fill up the team list form before the deadline date <strong>${deadline}</strong><br><br>
    
    //                             Thanks,<br>
    //                             The Director<br>
    //                             Physical Education Center<br>
    //                             University of Dhaka`
    //                         };
    //                         sgMail.send(msg);
    //                     });
    //                     res.send("Emails sent successfully");
    //                 }
    //             });
    //         });
    //     });
    // });
    
    
   


//send teamlist notice via mail
app.post('/sendTeamlistNotice', (req, res) => {

     
    db.query("SELECT MAX(noticeid) INTO @max_id FROM teamlistnotice",(err,result)=>{
    db.query("SELECT * FROM teamlistnotice WHERE noticeid = @max_id ", (err, result) => {
        const name = result[0].name;
        const startingDate = result[0].startingDate;
        const deadline = result[0].deadline;


        const msg = {
            to: 'bsse1220@iit.du.ac.bd',
            from: 'bsse1207@iit.du.ac.bd',
            subject: 'Team List Submission Notice',
            html: `Greetings,<br><br>
    
            There will be an Inter department <strong>${name}</strong> competition from <strong>${startingDate}</strong>. We are delighted to invite you to participate in this competition. You are requested to fill up the team list form before the deadline date <strong>${deadline}</strong><br><br>
            
            Thanks,<br>
            The Director<br>
            Physical Education Center<br>
            University of Dhaka`
        };
        sgMail.send(msg);
    
        res.send(msg);
    })
    });

 
    

});

   




//creating event notice
app.post('/eventNoticeSubmit', (req, res) =>{

    const name = req.body.name;
    const startingDate = req.body.startingDate;
    const deadline = req.body.deadline;
    const type = req.body.type;
    const year = req.body.year;
        
        // db.query("INSERT into eventNotice(name, startingDate, deadline) values(?,?,?) ",[name,startingDate, deadline],(err, result) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         res.send(result);

        //     }
        // });

        db.query("INSERT INTO events (name, starting_date, year) VALUES (?, ?, ?)", [name, startingDate, year], (err, result) => {
          if (err) {
              console.log(err);
          } else {
              console.log("hi1");
              const eventId = result.insertId; // Retrieve the ID of the newly inserted record
              console.log('result: ',result)
              db.query("INSERT INTO notice (event_id, starting_date, deadline, type) VALUES (?, ?, ?, ?)", [eventId, startingDate, deadline, type], (err, result) => {
                  console.log("hi2");
                  if (err) {
                      console.log(err);
                  } else {
                      res.send(result);
                  }
              });
          }
      });
    });
 
       

//creating teamlist notice
app.post('/teamlistNoticeSubmit', (req, res) =>{


  const name = req.body.name;
  const deadline = req.body.deadline;
  const type = req.body.type;
  const year = req.body.year;
      

      db.query('SELECT * FROM events WHERE name = ? AND year = ?', [name, year], (err, result)  => {
        if (err) {
            console.log(err);
        } else {
            const eventId = result[0].event_id; // Retrieve the ID of the newly inserted record
            const startingDate = result[0].starting_date;
            console.log('result: ',result[0].event_id);

            db.query("INSERT INTO notice (event_id, starting_date, deadline, type) VALUES (?, ?, ?, ?)", [eventId, startingDate, deadline, type], (err, result1) => {
                if (err) {
                    console.log(err);
                } else {
                  res.send({ startingDate});
                }
            });
        }
    });
    });
        


//generating group stage fixture 
// app.post('/fixtureInfo', (req, res) =>{

//     const startDate = req.body.startingDate;
//     const startingDate = new Date(startDate);
//     const eventName = req.body.eventName;

//     const current = new Date();
//     const year = current.getFullYear().toString();

//     const numberOfgroups = req.body.groupNumber;
//     let numberOfTeams = 0;
//     let data1 = [];

//     db.query("SELECT dep_id FROM teams where event_name = ? && year = ?",[eventName,year], (err, result) => {
//         if (err) {
//             console.log(err);
//         } else {
//           result.forEach(dept => {
//             console.log("dept: " + dept.dep_id);
//             db.query("SELECT dep_code FROM department where dep_id = ?",[dept.dep_id], (err1, result1) => {
//               if (err1) {
//                   console.log(err1);
//               } else {
//                 console.log(result1);
//                  //data1 = result1.map(row => row.dep_code);
//                  data1.push(result1[0].dep_code.toString());
//                 console.log("data1 : " +data1);

//       numberOfTeams = data1.length;
//       console.log("fixturing starts:")
//             // fixture function
//             function generateGroupStageFixture(eventName,numTeams, teams, numGroups, startDate, offDays) {
//               let teamsPerGroup = Math.floor(numTeams / numGroups);
//               const groups = [];
//               for (let i = 0; i < numGroups; i++) {
//                 const groupTeams = teams.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);
//                 if(teamsPerGroup%2 === 1) groupTeams.push("BYE");
//                 groups.push(groupTeams);
//               }
            
//               let currentDate = new Date(startDate);
//               console.log("start : " + startDate);
//               //const totalMatches = numGroups*getNumberOfCombinations(teamsPerGroup,2);
            
            
//               if(teamsPerGroup%2 === 1) teamsPerGroup++;
            
//               for(let i = 0; i < groups.length; i++){
//                   console.log(groups[i]);
//               }
            
//               const matches = [];
//               const rounds = teamsPerGroup - 1;
//               const halfTeamsPerGroup = teamsPerGroup / 2;
//               let count = 0;
//               currentDate = new Date(startDate);
//               let matchTimes = [];
//               if(eventName.toLowerCase() === "football" || eventName.toLowerCase() === "volleyball" || eventName.toLowerCase() === "baksetball"){
//                 matchTimes = ["09:00 am", "11:00 am", "03:00 pm", "05:00 pm"];
//               }
//               else if(eventName.toLowerCase() === "cricket"){
//                 matchTimes = ["07:00 am", "11:00 am", "03:00 pm"];
//               }
            
//               const matchesPerDay = matchTimes.length;
//               // else if(eventName.toLowerCase() === "volleyball" || eventName.toLowerCase() === "baksetball"){
//               //   matchTimes = ["7am", "11am", "3pm"];
//               // }
//               let timeSlots = [...matchTimes];
//               let flag = false;
//               for (let round = 0; round < rounds; round++) {
//                 for (let group = 0; group < numGroups; group++) {
//                   for (let i = 0; i < halfTeamsPerGroup; i++) {
//                     const homeTeam = groups[group][i];
//                     const awayTeam = groups[group][teamsPerGroup - i - 1];
//                     if (homeTeam !== null && awayTeam !== null && homeTeam !== "BYE" && awayTeam !== "BYE") {
//                       if (timeSlots.length === 0) {
//                         timeSlots = [...matchTimes];
//                       }
//                       matchTime = timeSlots.shift();
//                       matches.push({
//                         homeTeam: homeTeam,
//                         awayTeam: awayTeam,
//                         // date: getNextValidDate(currentDate, offDays),
//                         date: getNextValidDate(currentDate, offDays).toLocaleString('en-US', {weekday: 'short', month: 'short', day: '2-digit', year: '2-digit'}),
//                         time: matchTime,
//                       });
//                       count++;
            
//                       if(count === matchesPerDay){ 
//                         currentDate.setDate(currentDate.getDate()+1);
//                         count = 0;
//                       }
//                     }
//                   }
//                   // Rotate teams
//                   const temp = groups[group][1];
//                   for (let i = 1; i < teamsPerGroup - 1; i++) {
//                     groups[group][i] = groups[group][i + 1];
//                   }
//                   groups[group][teamsPerGroup - 1] = temp;
//                 }
//               }
//               return matches;
//             }
            
            
//             function getNextValidDate(currentDate, offDays) {
//               while (currentDate) {
//                 //console.log(currentDate + "\t" + endDate);
//                 const dayOfWeek = currentDate.getDay();
//                 if (!offDays.includes(dayOfWeek)) {
//                   return currentDate;
//                 }
//                 currentDate.setDate(currentDate.getDate() + 1);
//               }
//               return null;
//             }
            
//             // function getNumberOfCombinations(n, r) {
//             //   const numerator = factorial(n);
//             //   const denominator = factorial(r) * factorial(n - r);
//             //   const result = numerator / denominator;
//             //   return result;
//             // }
            
//             // function factorial(n) {
//             //   if (n === 0 || n === 1) {
//             //     return 1;
//             //   } else {
//             //     return n * factorial(n - 1);
//             //   }
//             // }
            
//             function getTimeSlot(timeSlots, matchTimes) {
//               if (timeSlots.length === 0) {
//                 timeSlots = [...matchTimes];
//               }
//               console.log("timeslot: " + timeSlots);
//               console.log("timeslot length: " + timeSlots.length);
//               // const index = Math.floor(Math.random() * timeSlots.length);
//               // const selectedTime = timeSlots.splice(index, 1)[0];
//               const selectedTime = timeSlots.shift(); // Remove and return the first element
            
//               return selectedTime;
//             }
            
// //main call
//               const offDays = [5,6];
//               const matches = generateGroupStageFixture(eventName,numberOfTeams,data1,numberOfgroups,startingDate,offDays);
//               console.log(matches);
//               let eventID;
//               matches.forEach(match => {
//                 const team1 = match.homeTeam;
//                 const team2 = match.awayTeam;
//                 const time = match.date;
//                 const matchTime2 = match.time;
                
//                 db.query("SELECT * FROM events where name = ? && year = ?",[eventName,year], (err, result) => {
//                   if (err) {
//                     console.log(err);
//                   } else {
//                     const event_id = result[0].event_id;
//                     eventID = event_id;
//                       db.query("INSERT INTO fixture(team1, team2, time, matchTime,event_id) VALUES(?,?,?,?,?)", [team1, team2, time,matchTime2,event_id], (err1, result1) => {
//                         if (err1) {
//                           console.log(err1);
//                         } else {
//                           console.log("Data inserted successfully");
//                         }
//                       });
//                     }
//                     })
//                   })
                

//               res.send(matches);
//             }
//           })
//         })
//         console.log("loop done");
//       }
//       console.log("loop 2");
//     })

        
//         });


let publicEventID;
app.post('/fixtureInfo', (req, res) => {
  // const startDate = req.body.startingDate;
  // const startingDate = new Date(startDate);

  const eventName = req.body.eventName;
  const current = new Date();
  const year = current.getFullYear().toString();
  const numberOfgroups = req.body.groupNumber;
  let numberOfTeams = 0;
  let data1 = [];
  let eventID; // Define the eventID variable

  db.query("SELECT * FROM events WHERE name = ? and year = ?", [eventName, year], (err1, result1) => {
    if (err1) {
      console.log(err1);
      res.status(500).send('Error retrieving teams data.');
    }else{
      eventID = result1[0].event_id;
      publicEventID = eventID;
      const startingDate = result1[0].starting_date;
  db.query("SELECT dep_id FROM teams WHERE event_name = ? && year = ?", [eventName, year], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving teams data.');
      return;
    }


    const depIdPromises = result.map(dept => {
      return new Promise((resolve, reject) => {
        db.query("SELECT dep_code FROM department WHERE dep_id = ?", [dept.dep_id], (err2, result2) => {
          if (err2) {
            reject(err2);
          } else {
            resolve(result2[0].dep_code.toString());
          }
        });
      });
    });

    Promise.all(depIdPromises)
      .then(results => {
        data1 = results;
        numberOfTeams = data1.length;

        // Rest of your code that depends on data1 and numberOfTeams
        // ...
        function generateGroupStageFixture(eventName,numTeams, teams, numGroups, startDate, offDays) {
                        let teamsPerGroup = Math.floor(numTeams / numGroups);
                        const groups = [];
                        for (let i = 0; i < numGroups; i++) {
                          const groupTeams = teams.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);
                          if(teamsPerGroup%2 === 1) groupTeams.push("BYE");
                          groups.push(groupTeams);
                        }
                      
                        let currentDate = new Date(startDate);
                        console.log("start : " + startDate);
                        //const totalMatches = numGroups*getNumberOfCombinations(teamsPerGroup,2);
                      
                      
                        if(teamsPerGroup%2 === 1) teamsPerGroup++;
                      
                        for(let i = 0; i < groups.length; i++){
                            console.log(groups[i]);
                        }
                      
                        const matches = [];
                        const rounds = teamsPerGroup - 1;
                        const halfTeamsPerGroup = teamsPerGroup / 2;
                        let count = 0;
                        currentDate = new Date(startDate);
                        let matchTimes = [];
                        if(eventName.toLowerCase() === "football" || eventName.toLowerCase() === "volleyball" || eventName.toLowerCase() === "baksetball"){
                          matchTimes = ["09:00 am", "11:00 am", "03:00 pm", "05:00 pm"];
                        }
                        else if(eventName.toLowerCase() === "cricket"){
                          matchTimes = ["07:00 am", "11:00 am", "03:00 pm"];
                        }
                      
                        const matchesPerDay = matchTimes.length;
                        // else if(eventName.toLowerCase() === "volleyball" || eventName.toLowerCase() === "baksetball"){
                        //   matchTimes = ["7am", "11am", "3pm"];
                        // }
                        let timeSlots = [...matchTimes];
                        let flag = false;
                        for (let round = 0; round < rounds; round++) {
                          for (let group = 0; group < numGroups; group++) {
                            console.log("testing");
                            for (let i = 0; i < halfTeamsPerGroup; i++) {
                              const homeTeam = groups[group][i];
                              const awayTeam = groups[group][teamsPerGroup - i - 1];
                              if (homeTeam !== null && awayTeam !== null && homeTeam !== "BYE" && awayTeam !== "BYE") {
                                if (timeSlots.length === 0) {
                                  timeSlots = [...matchTimes];
                                }
                                matchTime = timeSlots.shift();
                                matches.push({
                                  homeTeam: homeTeam,
                                  awayTeam: awayTeam,
                                  // date: getNextValidDate(currentDate, offDays),
                                  date: getNextValidDate(currentDate, offDays).toLocaleString('en-US', {weekday: 'short', month: 'short', day: '2-digit', year: '2-digit'}),
                                  time: matchTime,
                                });
                                count++;
                      
                                if(count === matchesPerDay){ 
                                  currentDate.setDate(currentDate.getDate()+1);
                                  count = 0;
                                }
                              }
                            }
                            // Rotate teams
                            const temp = groups[group][1];
                            for (let i = 1; i < teamsPerGroup - 1; i++) {
                              groups[group][i] = groups[group][i + 1];
                            }
                            groups[group][teamsPerGroup - 1] = temp;
                          }
                        }
                        return matches;
                      }
                      
                      
                      function getNextValidDate(currentDate, offDays) {
                        while (currentDate) {
                          //console.log(currentDate + "\t" + endDate);
                          const dayOfWeek = currentDate.getDay();
                          if (!offDays.includes(dayOfWeek)) {
                            return currentDate;
                          }
                          currentDate.setDate(currentDate.getDate() + 1);
                        }
                        return null;
                      }
                      
                      // function getNumberOfCombinations(n, r) {
                      //   const numerator = factorial(n);
                      //   const denominator = factorial(r) * factorial(n - r);
                      //   const result = numerator / denominator;
                      //   return result;
                      // }
                      
                      // function factorial(n) {
                      //   if (n === 0 || n === 1) {
                      //     return 1;
                      //   } else {
                      //     return n * factorial(n - 1);
                      //   }
                      // }
                      
                      function getTimeSlot(timeSlots, matchTimes) {
                        if (timeSlots.length === 0) {
                          timeSlots = [...matchTimes];
                        }
                        console.log("timeslot: " + timeSlots);
                        console.log("timeslot length: " + timeSlots.length);
                        // const index = Math.floor(Math.random() * timeSlots.length);
                        // const selectedTime = timeSlots.splice(index, 1)[0];
                        const selectedTime = timeSlots.shift(); // Remove and return the first element
                      
                        return selectedTime;
                      }

        const offDays = [5, 6];
        const matches = generateGroupStageFixture(eventName, numberOfTeams, data1, numberOfgroups, startingDate, offDays);

        let insertCount = 0;
        const insertMatchesCallback = (err) => {
          if (err) {
            console.log(err);
            res.status(500).send('Error inserting matches into the database.');
            return;
          }

          insertCount++;
          if (insertCount === matches.length) {
            console.log("Data inserted successfully");
            res.send(matches);
          }
        };

        // db.query("SELECT * FROM events WHERE name = ? && year = ?", [eventName, year], (err, result) => {
        //   if (err) {
        //     console.log(err);
        //     res.status(500).send('Error retrieving event ID.');
        //     return;
        //   }

          matches.forEach(match => {
            const { homeTeam, awayTeam, date, time } = match;
            db.query("INSERT INTO fixture(team1, team2, time, matchTime, event_id) VALUES(?,?,?,?,?)", [homeTeam, awayTeam, date, time, eventID], (err, result) => {
              if (err) {
                insertMatchesCallback(err);
              } else {
                insertMatchesCallback(null);
              }
            });
          });
        });
      })
      // .catch(err => {
      //   console.log(err);
      //   res.status(500).send('Error retrieving department codes.');
      // });
    }
  })
})




        

// displaying fixtures

app.get('/data', (req, res) => {
    db.query('SELECT * FROM fixture where event_id=? ', [publicEventID],(err, results) => {
      if (err) throw err;
      console.log('haha')
      res.json(results);
      console.log(results);
    });
  });
  

  //generating knockout fixture 

  app.post('/knockOutfixtureInfo', (req, res) => {
    const startDate = req.body.startingDate;
    const startingDate = new Date(startDate);
    const eventName = req.body.eventName;
    const current = new Date();
    const year = current.getFullYear().toString();
    let numberOfTeams = 0;
    let data1 = [];
    let eventID; // Define the eventID variable
    console.log("startDate: " + startDate);
    console.log("eventName: " + eventName);
  
    db.query("SELECT dep_id FROM teams WHERE event_name = ? && year = ?", [eventName, year], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error retrieving teams data.');
        return;
      }
  
      const depIdPromises = result.map(dept => {
        return new Promise((resolve, reject) => {
          db.query("SELECT dep_code FROM department WHERE dep_id = ?", [dept.dep_id], (err1, result1) => {
            if (err1) {
              reject(err1);
            } else {
              resolve(result1[0].dep_code.toString());
            }
          });
        });
      });
  
      Promise.all(depIdPromises)
        .then(results => {
          data1 = results;
          numberOfTeams = data1.length;
  
          // Rest of your code that depends on data1 and numberOfTeams
          // ...
          function generateKnockoutFixture(eventName, numTeams, teams, startDate, offDays) {
            console.log("start");
            const matches = [];
            const byes = getNumberOfByes(numTeams);
        
            const numOfMatches = Math.ceil(numTeams/2);
            console.log("numOfMatches = ", numOfMatches);
        
          
            // Shuffle the teams randomly
            shuffleArray(teams);
          
            // Generate the match schedule
            let currentDate = new Date(startDate);
            let matchCount = 0;
            let matchesInSameDay = 0;
            let prevDate = null;
            let matchTimes = [];
            if(eventName.toLowerCase() === "football" || eventName.toLowerCase() === "volleyball" || eventName.toLowerCase() === "baksetball"){
              matchTimes = ["09:00 am", "11::00 am", "03:00 pm", "05:00 pm"];
            }
            else if(eventName.toLowerCase() === "cricket"){
              matchTimes = ["07:00 am", "11:00 am", "03:00 pm"];
            }
        
          const matchesPerDay = matchTimes.length;
          let timeSlots = [...matchTimes];
          let count = 0;
        
            while (teams.length > 1) {
                // console.log(teams.length);
        
            if (!isOffDay(currentDate, offDays)) {
                if (timeSlots.length === 0) {
                  timeSlots = [...matchTimes];
                }
                matchTime = timeSlots.shift();
                const match = {
                  team1: teams.shift(),
                  team2: teams.pop(),
                  date: new Date(currentDate).toLocaleString('en-US', {weekday: 'short', month: 'short', day: '2-digit', year: '2-digit'}),
                  time: matchTime
                };
                matches.push(match);
                count++;
        
                if(count === matchesPerDay){
                  currentDate.setDate(currentDate.getDate()+1);
                  count = 0;
                }
            }
            else{
                currentDate.setDate(currentDate.getDate() + 1);
            }
          }
       // Handle remaining team playing against BYE
            if (teams.length === 1) {
              const byeMatch = {
                team1: teams[0],
                team2: "BYE",
                date: "N/A",
              };
              matches.push(byeMatch);
            }
          
            return matches;
        }
          
          
          function getNumberOfByes(numTeams) {
            let byes = 0;
            while (numTeams > 1) {
              if (numTeams % 2 !== 0) {
                byes++;
              }
              numTeams = Math.ceil(numTeams / 2);
            }
            return byes;
          }
          
          function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
          }
          
          function isOffDay(date, offDays) {
            const dayOfWeek = date.getDay();
            return offDays.includes(dayOfWeek);
          }

              const offDays = [5,6];
              const matches = generateKnockoutFixture(eventName,numberOfTeams,data1,startingDate,offDays);
              console.log("matches : " + matches[0].team1);

          const insertMatchesCallback = (err) => {
            if (err) {
              console.log(err);
              res.status(500).send('Error inserting matches into the database.');
              return;
            }
  
            // insertCount++;
            // if (insertCount === matches.length) {
            //   console.log("Data inserted successfully");
            //   // res.send(matches);
            // }
          };
          res.send(matches);

          db.query("SELECT * FROM events WHERE name = ? && year = ?", [eventName, year], (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send('Error retrieving event ID.');
              return;
            }
  
            eventID = result[0].event_id;
            publicEventID = eventID;
  
            matches.forEach(match => {
              const { homeTeam, awayTeam, date, time } = match;
              console.log(match.team1,',', homeTeam);

              db.query("INSERT INTO fixture(team1, team2, time, matchTime, event_id) VALUES(?,?,?,?,?)", [match.team1, match.team2, match.date, match.time, eventID], (err, result) => {
                if (err) {
                  insertMatchesCallback(err);
                } else {
                  insertMatchesCallback(null);
                }
              });
            });
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).send('Error retrieving department codes.');
        });
    });
  });


//   app.post('/knockOutfixtureInfo', (req, res) =>{

//     const startDate = req.body.startingDate;
//     const startingDate = new Date(startDate);

//     const eventName = req.body.eventName;;
    
//     let numberOfTeams = 0;

//     db.query("SELECT dep_name FROM teams", (err, result) => {
        
//         if (err) {
//             console.log(err);
//         } else {
//           const data1 = result.map(row => row.dep_name);
//           numberOfTeams = data1.length;
//            console.log(data1);

//             // fixture function
//             function generateKnockoutFixture(eventName, numTeams, teams, startDate, offDays) {
//               console.log("start");
//               const matches = [];
//               const byes = getNumberOfByes(numTeams);
          
//               const numOfMatches = Math.ceil(numTeams/2);
//               console.log("numOfMatches = ", numOfMatches);
          
            
//               // Shuffle the teams randomly
//               shuffleArray(teams);
            
//               // Generate the match schedule
//               let currentDate = new Date(startDate);
//               let matchCount = 0;
//               let matchesInSameDay = 0;
//               let prevDate = null;
//               let matchTimes = [];
//               if(eventName.toLowerCase() === "football" || eventName.toLowerCase() === "volleyball" || eventName.toLowerCase() === "baksetball"){
//                 matchTimes = ["09:00 am", "11::00 am", "03:00 pm", "05:00 pm"];
//               }
//               else if(eventName.toLowerCase() === "cricket"){
//                 matchTimes = ["07:00 am", "11:00 am", "03:00 pm"];
//               }
          
//             const matchesPerDay = matchTimes.length;
//             let timeSlots = [...matchTimes];
//             let count = 0;
          
//               while (teams.length > 1) {
//                   // console.log(teams.length);
          
//               if (!isOffDay(currentDate, offDays)) {
//                   if (timeSlots.length === 0) {
//                     timeSlots = [...matchTimes];
//                   }
//                   matchTime = timeSlots.shift();
//                   const match = {
//                     team1: teams.shift(),
//                     team2: teams.pop(),
//                     date: new Date(currentDate),
//                     time: matchTime
//                   };
//                   matches.push(match);
//                   count++;
          
//                   if(count === matchesPerDay){
//                     currentDate.setDate(currentDate.getDate()+1);
//                     count = 0;
//                   }
//               }
//               else{
//                   currentDate.setDate(currentDate.getDate() + 1);
//               }
//             }
//          // Handle remaining team playing against BYE
//               if (teams.length === 1) {
//                 const byeMatch = {
//                   team1: teams[0],
//                   team2: "BYE",
//                   date: "N/A",
//                 };
//                 matches.push(byeMatch);
//               }
            
//               return matches;
//           }
            
            
//             function getNumberOfByes(numTeams) {
//               let byes = 0;
//               while (numTeams > 1) {
//                 if (numTeams % 2 !== 0) {
//                   byes++;
//                 }
//                 numTeams = Math.ceil(numTeams / 2);
//               }
//               return byes;
//             }
            
//             function shuffleArray(array) {
//               for (let i = array.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [array[i], array[j]] = [array[j], array[i]];
//               }
//             }
            
//             function isOffDay(date, offDays) {
//               const dayOfWeek = date.getDay();
//               return offDays.includes(dayOfWeek);
//             }
//     const offDays = [5,6];
//     const matches = generateKnockoutFixture(eventName,numberOfTeams,data1,startingDate,offDays);
//     console.log(matches);

//     matches.forEach(match => {
//       const team1 = match.team1;
//       const team2 = match.team2;
//       const time = match.date;
//       const matchTime = match.time;

//       db.query("DELETE FROM fixture", (err, result) => {
//           if (err) {
//             console.log(err);
//           } else {
//             db.query("INSERT INTO fixture(team1, team2, time, matchTime) VALUES(?,?,?,?)", [team1, team2, time, matchTime], (err, result) => {
//               if (err) {
//                 console.log(err);
//               } else {
//                 console.log("Data inserted successfully");
//               }
//             });
//           }
//         });

        
//     });

//     res.send(matches);

//   }

// })
//  })


 //publish fixtures 


 let isPublish = false;
  app.post('/publishFixture', (req, res) => {
      isPublish = true;
      console.log('publish fixture');
      res.send('OK');
  })

  app.get('/publishFixture', (req, res) => {
    if(isPublish){
      console.log('display fixture')
      const query = 'SELECT * FROM fixture';
      db.query(query, (err, results) => {
        if (err) throw err;
        console.log('haha')
        res.json(results);
        console.log(results);
      });

    }
})



// pec notification
// Create endpoint for sending notifications
// app.post('/notifications', (req, res) => {
//   const { message, recipient } = req.body;
//   const insertQuery = `INSERT INTO notifications (message, recipient) VALUES ('${message}', '${recipient}')`;
//   db.query(insertQuery, (err, result) => {
//     if (err) {
//       console.log('Error inserting notification into database:', err);
//       res.sendStatus(500);
//     } else {
//       // Send notification to recipient(s) via web sockets
//       const notification = { id: result.insertId, message, recipient };
//       io.emit('notification', notification);
//       res.sendStatus(200);
//     }
//   });
// });



//all about notifications

// API to get all notifications
//pec notification starts
app.get('/PECnotifications', (req, res) => {
    const sql = 'SELECT * FROM notification where receiver_id = ? ORDER BY created_at DESC ';
    db.query(sql,[13], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });
  
  // API to create a notification
  app.post('/PECnotifications', (req, res) => {
    const { title, body } = req.body;
    const receiver_id = 13;
    const sql = 'INSERT INTO notification (title, body,receiver_id) VALUES (?, ?,?)';
    const values = [title, body, receiver_id];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        const notification = { id: result.insertId, title, body };
        res.json(notification);
      }
    });
  });
  

app.get('/pecnotification/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM notification WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } else if (results.length === 0) {
        res.status(404).json({ message: 'Notification not found' });
      } else {
        const notification = results[0];
   //     res.render('PECNotification', { notification: notification });
   res.json(notification)
      }
    });
  });

//pec notification ends

//executive notification starts
let insertid = 0;
let title,body,notification;

app.post('/denyEventNotice/:id', async(req, res) =>{
    const eventName = req.body.eventName;
    const nid = req.params;
    insertid++;
    console.log('e: ',nid);
    title = 'Event Notice Issue: '+eventName;
    body = 'Your submitted event notice has some issues. Please contact with the PEC head as soon as possible to resolve the problem. Thank you'
    notification = [{ id: insertid, title, body }];


    db.query('DELETE FROM notification WHERE id = ?', [nid], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }else{
        console.log(results);

    db.query('select employee_id from userdb where UserType = ? and dep_id = ?',["executive",2], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } else{
        console.log(result);
          const employeeId = result[0].employee_id;
          // console.log('dep_id: ' + depId);
        db.query('INSERT INTO notification (title, body,receiver_id) VALUES (?, ?,?)',  [title,body,employeeId], (err1, result1) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
          } else {
            console.log("approved");
              
          }
        });
      }
    }) 
  }
})
    res.send('ok');
})

app.get('/exenotifications/:email', (req, res) => {
  const {email} = req.params;
  console.log('email: ',email);
  db.query('SELECT * FROM employee where email = ? ',[email], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      const employeeID = results[0].employee_id;
      console.log("employeeID: " + employeeID);
  db.query('SELECT * FROM notification where receiver_id = ? ORDER BY created_at DESC',[employeeID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json(result);
    } 
  });

}
});
    });


  app.get('/executiveNotification/:id', (req, res) => {
    const { id } = req.params

    const sql = 'SELECT * FROM notification WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } else if (results.length === 0) {
        res.status(404).json({ message: 'Notification not found' });
      } else {
        const notification = results[0];
        res.json(notification);
      }
    });
      });


 //executive notification ends


//dept head notification starts

const bodyParser = require('body-parser');

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies
app.use(bodyParser.json());



app.post('/approveAllEventNotice', (req, res) => {
  const id  = req.body.id;
  console.log('id: ',id)
  const userType = 'head';

db.query('select * from notification where id = ?',[id], (err2, result2) => {
    if (err2) {
      console.error(err2);
      res.status(500).json({ message: 'Internal server error' });
    } else{
      const title = result2[0].title;
      const body = result2[0].body;
      console.log(title, body);

db.query('select employee_id from userdb where UserType = ?',[userType], (err, result) => {
  if (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } else{
    console.log(result);
    result.forEach((row) => {
      const employeeId = row.employee_id;
      // console.log('dep_id: ' + depId);
    db.query('INSERT INTO notification (title, body,receiver_id) VALUES (?, ?,?)',  [title,body,employeeId], (err1, result1) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        console.log("approved");
      }
    });
  });
  }
}) 
res.send('ok')

    }
  })

});


app.post('/approveNorthEventNotice', (req, res) => {
  const id  = req.body.id;
  console.log('id: ',id);
  const userType = 'head';

db.query('select * from notification where id = ?',[id], (err2, result2) => {
    if (err2) {
      console.error(err2);
      res.status(500).json({ message: 'Internal server error' });
    } else{
      const title = result2[0].title;
      const body = result2[0].body;
      console.log(title, body);

db.query('select * from userdb where UserType = ?',[userType], (err, result) => {
  if (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } else{
    console.log(result);
    result.forEach((row) => {
      const employeeId = row.employee_id;
      // console.log('dep_id: ' + depId);
    db.query('INSERT INTO notification (title, body,receiver_id) VALUES (?, ?,?)',  [title,body,employeeId], (err1, result1) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        console.log("approved");
      }
    });
  });
  }
}) 
res.send('ok')

    }
  })

});

app.post('/approveSouthEventNotice', (req, res) => {
  const id  = req.body.id;
  console.log('id: ',id)
  const userType = 'head';

db.query('select * from notification where id = ?',[id], (err2, result2) => {
    if (err2) {
      console.error(err2);
      res.status(500).json({ message: 'Internal server error' });
    } else{
      const title = result2[0].title;
      const body = result2[0].body;
      console.log(title, body);

db.query('select employee_id from userdb where UserType = ?',[userType], (err, result) => {
  if (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } else{
    console.log(result);
    result.forEach((row) => {
      const employeeId = row.employee_id;
      // console.log('dep_id: ' + depId);
    db.query('INSERT INTO notification (title, body,receiver_id) VALUES (?, ?,?)',  [title,body,employeeId], (err1, result1) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        console.log("approved");
      }
    });
  });
  }
}) 
res.send('ok')

    }
  })

});

//dept head notifications
app.get('/deptHeadNotifications/:email', (req, res) => {
  const {email} = req.params;
  console.log('email: ',email);
  db.query('SELECT * FROM employee where email = ? ',[email], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      const employeeID = results[0].employee_id;
      console.log("employeeID: " + employeeID);
  db.query('SELECT * FROM notification where receiver_id = ? ORDER BY created_at DESC',[employeeID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json(result);
    } 
  });

}
});
});


app.get('/deptHeadNotification/:id', (req, res) => {
  const { id } = req.params

  const sql = 'SELECT * FROM notification WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Notification not found' });
    } else {
      const notification = results[0];
      res.json(notification);
    }
  });
});

//deny by dept head

app.post('/denyByDeptHead/:id', (req, res) => {
  const { id } = req.params

  const sql = 'DELETE FROM notification WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }else{
        res.send('deleted successfully')
    }
  })
})

//dept head notification ends



//advisor notification starts

app.post('/approveEventNoticeByHead', async(req, res) => {
  const id  = req.body.id;
  console.log(id)

  db.query('SELECT * FROM notification where id = ? ',  [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      const title = result[0].title;
      const body = result[0].body;
      console.log(title, body);
      const employeeID = result[0].receiver_id;
  db.query('SELECT * FROM userdb where employee_id = ? ',  [employeeID], (err1, result1) => {
    if (err1) {
      console.error(err1);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      const dept_id = result1[0].dep_id;
      db.query('SELECT * FROM userdb where dep_id = ? and usertype = ?',  [dept_id,'student advisor'], (err2, result2) => {
        if (err2) {
          console.error(err2);
          res.status(500).json({ message: 'Internal server error' });
        } else {
          const employeeID = result2[0].employee_id;
          db.query('INSERT INTO notification (title, body,receiver_id) VALUES (?, ?,?)',  [title,body,employeeID], (err3, result3) => {
            if (err3) {
              console.error(err3);
              res.status(500).json({ message: 'Internal server error' });
            } else {
      console.log("approved");
      // res.send("approved");
    }
  });
}
});
}
});
}
});
res.send("approved");
});


app.get('/advisorNotifications/:email', (req, res) => {
  const email = req.params.email;
  db.query('SELECT * FROM employee where email = ? ',[email], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      const employeeID = results[0].employee_id;
      console.log("employeeID: " + employeeID);
  db.query('SELECT * FROM notification where receiver_id = ? ORDER BY created_at DESC',[employeeID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json(result);
    } 
  });
}
});});



app.get('/advisorNotification/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'SELECT * FROM notification WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Notification not found' });
    } else {
      const notification = results[0];
      // res.render('AdvisorNotification', { notification : notification });
      res.json(notification);

    }
  });
});
// advisor ends here


//delete profile

app.post('/executiveDeleteProfile/:email', (req, res) => {
    const email = req.params.email;

    db.query('DELETE FROM userdb WHERE email = ? ',[email], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.send(result);
      }
    })
})


app.post('/pecDeleteProfile/:email', (req, res) => {
  const email = req.params.email;

  db.query('DELETE FROM userdb WHERE email = ? ',[email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.send(result);
    }
  })
})


app.post('/deptHeadDeleteProfile/:email', (req, res) => {
  const email = req.params.email;

  db.query('DELETE FROM userdb WHERE email = ? ',[email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.send(result);
    }
  })
})

app.post('/advisorDeleteProfile/:email', (req, res) => {
  const email = req.params.email;

  db.query('DELETE FROM userdb WHERE email = ? ',[email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.send(result);
    }
  })
})


//update results

app.get('/updateResults', (req, res) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: '2-digit',
  });

console.log('formatted: ',currentDate);
  db.query('SELECT * FROM fixture where time=? ',[currentDate], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
        console.log('db : ',results);

        // res.send(results);
        res.send(results)
    }
  })
})

app.post('/updateResults', async (req, res) => {
  const matches = req.body.matches;
  console.log(matches);

  try {
    for (const data of matches) {
      const { fixtureID, score1, score2, winner } = data;
      console.log('fixtureID:', fixtureID);
      console.log('winner:', winner);

      await new Promise((resolve, reject) => {
        db.query(
          "UPDATE fixture SET score1 = ?, score2 = ?, winner = ? WHERE fixtureID = ?",
          [score1, score2, winner, fixtureID],
          (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    }

    res.send('All rows updated successfully.');
  } catch (error) {
    res.status(500).send('An error occurred while updating rows.');
  }
});



//event registration by advisor
app.post('/eventRegistration/:email', async (req, res) => {
  const {email} = req.params;
  const id = req.body.id;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  db.query('SELECT * FROM notification where id = ? ',[id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      const title = results[0].title;
      console.log('title: ',results[0].title);

      const match = title.match(/Event Notice: (\w+)/);
      const finalTitle = match && match[1];

console.log('final title: ',finalTitle); 

  db.query('SELECT * FROM userdb where email = ? ',[email], (err1, result1) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      const deptID = result1[0].dep_id;
      console.log("deptID");

      db.query('INSERT INTO teams (event_name, dep_id,year) VALUES (?,?,?)',  [finalTitle,deptID,currentYear], (err2, result2) => {
        if (err2) {
          console.error(err2);
          res.status(500).json({ message: 'Internal server error' });
        } else {
          console.log(result2);
        }
      })

    }
  })
}
  });
  res.send('registered')
})

// team list submission by advisor

app.post('/teamlistInfo/:eventName/:email', async (req, res) => {
  const {eventName}  =req.params;
  const {email}  =req.params;

  const playerlist = req.body.playerlist;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  db.query('SELECT * FROM userdb where email = ? ',[email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      const dep_id = result[0].dep_id;
      console.log("dep_id: " + dep_id);

      db.query('SELECT * FROM department where dep_id = ? ',[dep_id], (err4, result4) => {
        if (err4) {
          console.error(err4);
          res.status(500).json({ message: 'Internal server error' });
        } else {
          const dep_name = result4[0].dep_name;
      const entries = Object.entries(playerlist)
      for (const [key, value] of entries) {
        if (key.startsWith('playerName')) {
          const index = key.substring(10); // Extract the index from the key
          const playerName = value;
          const registrationNumber = playerlist[`registrationNumber${index}`];

          let session = null;
          let hall = null;

          db.query('SELECT * FROM students where reg_no = ? ',[registrationNumber], (err1, result1) => {

              if (err1) {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
              } else {
                if(result1[0]){
                  session = result1[0].session;
                  hall = result1[0].hall;
                }
          
                

                console.log("session: " + session);

                const currentDate = new Date();
                const currentYear = currentDate.getFullYear().toString();
                    // Perform the database insertion
                    db.query('INSERT INTO players (name, event_name, dep_name, reg_no, session, hall, event_year) VALUES (?, ?, ?, ?, ?, ?, ?)',
                      [playerName, eventName, dep_name, registrationNumber,session, hall,currentYear ],
                      (err3, result3) => {
                        if (err3) {
                          console.log(err);
                        } else {
                          console.log('Insertion successful');
                        }
                  });
                  // }}
                
              }
            })
              }
      }
    }
          })
        
      }
    })
  })
    
  
// player verification function
//load players
app.get('/playerInfo/:eventName', async(req, res) => {
  const {eventName} = req.params
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  console.log(eventName, currentYear);
  db.query('SELECT * FROM players where event_name = ? and event_year = ? ',[eventName, currentYear], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      console.log(results)
      res.send(results)
    }
  })
})


//notify department about unregistered players**********************
let insertCount = 1;
app.post('/notifyDepartments/:eventName', async(req, res) => {
  const {eventName} = req.params
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  console.log(eventName, currentYear);

  const title = 'Player verification Issue '+eventName;
  const body = 'Your submitted playerlist has unregistered players. Please submit a proper playerlist to participate in the competition. Thanks'
  const notification = [{ id: insertCount, title, body }];
  insertCount++;

  db.query('SELECT DISTINCT dep_name FROM players WHERE hall IS NULL', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      console.log(results)

      for (const row of results) {
        console.log(row.dep_name);
        db.query('SELECT *  FROM department WHERE dep_name = ?', [row.dep_name],(err, result1) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
          } else {
            db.query('SELECT *  FROM userdb WHERE dep_id = ? and UserType = ?', [result1[0].dep_id,'student advisor'],(err, result2) => {
              if (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
              } else {
                let employeeID = result2[0].employee_id;
                console.log("employeeID : " + employeeID)
                db.query('INSERT INTO notification (title, body,receiver_id) VALUES (?, ?,?)',  [title,body,employeeID], (err3, result3) => {
                  if (err3) {
                    console.error(err3);
                    res.status(500).json({ message: 'Internal server error' });
                  } else {                               
                  console.log("approved");
                        db.query('DELETE FROM players WHERE dep_name = ?', [row.dep_name], (err3, results3) => {
                          if (err3) {
                            console.error(err3);
                            res.status(500).json({ message: 'Internal server error' });
                          }else{
                                console.log("teamlist deleted");
                          }
           })
          }
        });
              }
            })
          }
        })
      }

    }
  })
  // res.send("notifications sent");

})


// app.get('/advisorNotifications/:email', (req, res) => {
//   const email = req.params.email;
//   db.query('SELECT * FROM employee where email = ? ',[email], (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error' });
//     } else {
//       const employeeID = results[0].employee_id;
//       console.log("employeeID: " + employeeID);
//   db.query('SELECT * FROM notification where receiver_id = ? ORDER BY created_at DESC',[employeeID], (err, result) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error' });
//     } else {
//       res.json(result);
//     } 
//   });
// }
// });});



// app.get('/advisorNotification/:id', (req, res) => {
//   const { id } = req.params;

//   const sql = 'SELECT * FROM notification WHERE id = ?';
//   db.query(sql, [id], (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error' });
//     } else if (results.length === 0) {
//       res.status(404).json({ message: 'Notification not found' });
//     } else {
//       const notification = results[0];
//       // res.render('AdvisorNotification', { notification : notification });
//       res.json(notification);

//     }
//   });
// });