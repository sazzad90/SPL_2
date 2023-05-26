import React, { useState } from 'react';
import Axios from 'axios';
import { Button } from 'react-bootstrap';


const PostEventNotice =()=> {

  const [message, setMessage] = useState('');

  const [event, setEvent] = useState('');
  const [date, setDate] = useState('');
 
  let  eventName,firstDate;


  const handleFetchData = () => {
    Axios.post('http://localhost:5050/forwardEventNotice', {})
      .then((response) => {
        if (response) {
          console.log(response.data);
            eventName = response.data.name;
            firstDate = response.data.startingDate;
                    
          setEvent(
             `${eventName}`
            );
            setDate(
              `${firstDate}`
              );

        }
      })
      .catch((err) => {
        console.log(err);
      });
  };



  const handlePostNotice = () => {
    handleFetchData();
    Axios.post('http://localhost:5050/eventNotice', {//message:message
                                                       event:event,
                                                       date:date
                                                       })
      .then((response) => {
        if (response) {
            console.log('notice ready for posting');
            console.log(event)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const removeNotice =()=>{
  //   Axios.post('http://localhost:5050/removePost', {})
  //     .then((response) => {
  //       if (response) {
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  return (
    <div className='d-flex justify-content-center align-items-center flex-column'>
      <br></br>
      <br></br>
      <h2>Upcoming Event</h2>
      <br></br>
      <h4>Inter Department {event} Competition</h4>
      <h4>Starting Date: {date}</h4>
      {/* <button onClick={handlePostNotice} >Post Notice</button> */}
      <br></br>
      <Button variant="primary" onClick={handlePostNotice} type="submit">Post Notice</Button>
      {/* <Button variant="primary" onClick={removeNotice} type="submit">Remove Notice</Button> */}
    </div>
  );
}

export default PostEventNotice;
