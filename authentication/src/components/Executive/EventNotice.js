import React, { useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import { DropdownSubmenu, NavDropdownMenu} from "react-bootstrap-submenu";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Axios from 'axios';
import { Routes,Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ExecutiveHeader from './ExecutiveHeader'
import ViewEventNotice from './ViewEventNotice';
import './EventNotice.css'

const EventNotice = () => {
    
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");

    const [fvalue, setFiledValue] = useState({
      name: "",
      startingDate: "",
      deadline:"",

    })

  const getData = (data) =>{
      const fieldName = data.target.name;
      const fieldValue = data.target.value;

      setFiledValue(()=>{
          return{
              ...fvalue,
              [fieldName]: fieldValue
          }
      })

  }
  const addData = (data) => {
    data.preventDefault();


     const {name, startingDate, deadline} = fvalue;
     const type = 'event';
     const year = new Date().getFullYear();
     if (new Date(deadline) <= new Date(startingDate)) {
      // The registration deadline is higher or equal to the event starting date
      setError("Registration deadline should be before the event starting date");
      return;
    }

    Axios.post("http://localhost:5050/eventNoticeSubmit",{
        name:name,
        startingDate:startingDate,
        deadline:deadline,
        type:type,  
        year:year,
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

   
}


  return (
    <>
    <Routes>
      <Route path="/ViewEventNotice" element={<ViewEventNotice/>} />
    </Routes>
     <div className='half-width container mt-3 d-flex justify-content-center float-start' style={{width:'30%', marginLeft:'200px'}}>
                <section>
                    {/* <div className='left_side mt-3'>
                        <h3 className='col-lg-12'>Event Notice</h3>
                        <Form>
                            <Form.Group className="mb-3 col-lg-12" controlId="formBasicName">
                            <label htmlFor="dropdown">Event name</label><br/>
                                <select id="dropdown" name='name'  onChange={getData}>
                                    <option value="">choose an event name</option>
                                    <option value="Football">Football</option>
                                    <option value="Cricket">Cricket</option>
                                    <option value="Basketball">Basketball</option>
                                    <option value="Volleyball">Volleyball</option>
                                </select>
                                </Form.Group>

                            <Form.Group className="mb-3 col-lg-12" controlId="formBasicEmail">
                                <Form.Label>Starting date</Form.Label>
                                <Form.Control type="date" name='startingDate' onChange={getData} placeholder="Enter starting date of the event" />
                            </Form.Group>
                            <Form.Group className="mb-3 col-lg-12" controlId="formBasicEmail">
                                <Form.Label>Deadline</Form.Label>
                                <Form.Control type="date" name='deadline' onChange={getData} placeholder="Enter deadline date for registration" />
                            </Form.Group>

                      
                            <Button variant="primary" className='col-lg-6' onClick={addData} type="submit">
                                Submit
                            </Button>
                        </Form>

                    </div> */}
                    
    <div className='left_side mt-3 ml-10 w-100' style={{ backgroundColor: '#0A4770', padding: '20px', borderRadius: '10px', }}>
      <h3 className='col-lg-12' style={{ color: 'white', marginBottom: '20px' }}>Event Notice</h3>
      <Form>
        <Form.Group className="mb-3 col-lg-12" controlId="formBasicName">
          <Form.Label htmlFor="dropdown" style={{ color: 'white' }}>Event name</Form.Label>
          <br />
          <select id="dropdown" name='name' className='rounded form-control' onChange={getData} style={{ backgroundColor: '#F7FFCF', transition: 'all 0.3s' }}>
            <option value="">choose an event name</option>
            <option value="Football">Football</option>
            <option value="Cricket">Cricket</option>
            <option value="Basketball">Basketball</option>
            <option value="Volleyball">Volleyball</option>
          </select>
        </Form.Group>

        <Form.Group className="mb-3 col-lg-12" controlId="formBasicEmail">
          <Form.Label style={{ color: 'white' }}>Event starting date</Form.Label>
          <Form.Control type="date" name='startingDate' onChange={getData} placeholder="Enter starting date of the event" style={{ backgroundColor: '#F7FFCF' }} />
        </Form.Group>

        <Form.Group className="mb-3 col-lg-12" controlId="formBasicEmail">
          <Form.Label style={{ color: 'white' }}>Registration deadline</Form.Label>
          <Form.Control type="date" name='deadline' onChange={getData} placeholder="Enter deadline date for registration" style={{ backgroundColor: '#F7FFCF' }} />
        </Form.Group>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Button variant="primary" className='col-lg-6' onClick={addData} type="submit">
          Submit
        </Button>
      </Form>
    </div>
                </section>
                </div> 
                
                <div className=' half-width container float-end' style = {{'marginTop':'80px'}}>
                {showForm &&
                    <div>
                    <ViewEventNotice name = {fvalue.name} firstDate = {fvalue.startingDate} lastDate = {fvalue.deadline} />
                   
                    </div>
                }
                 </div>
    </>
  )
}

export default EventNotice