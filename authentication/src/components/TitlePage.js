import React from 'react'
import Header from './Header'
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PostEventNotice.css'

import { useState, useEffect } from 'react';
import axios from 'axios';
const TitlePage =()=> {  

  const [showForm, setShowForm] = useState(false);

  const [event, setEvent] = useState('');
  const [date, setDate] = useState('');

  //   useEffect(() => {
  //   axios.get('http://localhost:5050/removePost')
  //     .then(res => {
  //       setShowForm(res.data.showPost);
  //       console.log("1: ",res.data.showPost)
  //     })
  //     .catch(err => console.log(err));
  // }, []);

  

  useEffect(() => {
    axios.get('http://localhost:5050/eventNotice')
      .then(res => {
       
       setEvent(res.data.event);
       setDate(res.data.date);
       setShowForm(true);

        console.log("2: ",showForm);
        console.log(' notice posted.')
      })
      .catch(err => console.log(err));
  }, []);





  return (
  <>
    <Header/>
    <div>
    
    <Carousel>
      
      {/* <Carousel.Item>
        <img
          className="d-block w-100"
          style={{ width: '40%', height: '40%' }}
          src="https://lh3.googleusercontent.com/p/AF1QipMKRRXtkJIh4_Syu-Z2P6BZAEsg6qeLLhimG7x6=s1360-w1360-h1020"

          
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Dhaka University</h3>
        </Carousel.Caption>
      </Carousel.Item> */}
      <Carousel.Item>
        <img
          className="d-block w-100"
          src = "https://eng.campuslive24.com/uploads/shares/2019/4/DU-2019-04-28-18-56-05.jpg"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>Inter department football competition</h3>
          <p>Department of Statistics</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="http://chokkor.com/wp-content/uploads/2019/02/Curzon-Hall-960x630.jpg"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Dhaka University</h3>
          <p>Curzon_Hall</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>

    </div>

    <div>
  {showForm && 
   <div>
    <div className="bg-warning d-flex justify-content-center flex-column align-items-center"><h2>Upcoming Event</h2></div>
    <div className="d-flex text-success justify-content-center flex-column align-items-center">
    <h3>Inter Department {event} Competition</h3>
    <h4>Starting Date : {date}</h4>
    </div>
 </div>
  }
  </div>


  </>
    
  )
}

export default TitlePage