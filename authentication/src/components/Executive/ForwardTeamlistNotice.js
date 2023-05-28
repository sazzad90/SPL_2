

import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import io from 'socket.io-client';
import { Button } from 'react-bootstrap';

const ENDPOINT = 'http://localhost:8000';

const ForwardTeamlistNotice = () => {
  const [showForm, setShowForm] = useState(false);
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  let  eventName,firstDate,lastDate;

 

  const handleFetchData =  () => {
    Axios.post('http://localhost:5050/forwardTeamlistNotice', {})
      .then((response) => {
        if (response) {
          console.log(response.data);
            eventName = response.data.name;
            firstDate = response.data.startingDate;
            lastDate = response.data.deadline;

            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10);
          setTitle(' Teamlist Notice: '+eventName+'  '  +formattedDate);
          setBody(
            `Greetings,\n\nThere will be an Inter department ${eventName} competition from ${firstDate}.\nWe are delighted to invite you to participate in this competition. You are requested to\nfill up the teamlist form before the deadline date ${lastDate}\n\nThanks,\nDirector\nPhysical Education Center\nUniversity of Dhaka`
            );
            setId()
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleFetchData();
  }, []);
  
  console.log(body);

  const handleForwardNotification = async (event) => {
    event.preventDefault();

    const socket = io(ENDPOINT);

  try {
    const response = await Axios.post('http://localhost:5050/PECnotifications', {
      title,
      body
    }).then((response)=>{
      if(response){
          console.log(response);
          
          setShowForm(true);
         
      }
  }).catch((err)=>{
      if(err){
          console.log(err);
      }
  });
  } catch (error) {
    console.error(error);
    alert('Error sending notification');
  }

  };


  return (
    <>
    <div>
      <br/><br/>

      <div class = "row">
      <div class = "col-lg-3">  </div>
      <div class = "col-lg-8">
        <pre>{body}</pre>
        <br/>

        <div class =  "d-flex">
        <Button variant="primary" onClick={handleForwardNotification} type="submit">Send to PEC Head</Button>
        </div>

        </div>
        <div class = "col-lg-1">  </div>
        </div>     
    </div>

    
    <div>
                {showForm &&
                <div class = "row">
                  <br/><br/>
                <div class = "col-lg-4">  </div>
                 <div className='alert alert-success d-flex justify-content-center col-lg-4 mt-4'  role="alert" alignment="center">
                     Teamlist notice is forwarded successfully to Head of PEC
                    </div>
                    <div class = "col-lg-4">  </div>
                    </div>
                }
       </div>
    </>
  );
};

export default ForwardTeamlistNotice;




   

