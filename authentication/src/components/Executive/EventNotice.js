import React, { useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import { DropdownSubmenu, NavDropdownMenu } from "react-bootstrap-submenu";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ExecutiveHeader from './ExecutiveHeader'
import ViewEventNotice from './ViewEventNotice';
import './EventNotice.css'

const EventNotice = () => {

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [firstDate, setFirstDate] = useState('');
  const [secondDate, setSecondDate] = useState('');

  const handleFirstDateChange = (event) => {
    setFirstDate(event.target.value);
  };

  const handleSecondDateChange = (event) => {
    setSecondDate(event.target.value);
  };

  const [fvalue, setFiledValue] = useState({
    name: "",
    // startingDate: "",
    // deadline:"",

  })

  const getData = (data) => {
    const fieldName = data.target.name;
    const fieldValue = data.target.value;

    setFiledValue(() => {
      return {
        ...fvalue,
        [fieldName]: fieldValue
      }
    })

  }


  const addData = (data) => {
    data.preventDefault();


    const { name } = fvalue;
    const type = 'event';
    const year = new Date().getFullYear();


    Axios.post("http://localhost:5050/eventNoticeSubmit", {
      name: name,
      startingDate: firstDate,
      deadline: secondDate,
      type: type,
      year: year,
    }).then((response) => {
      if (response) {
        console.log(response);
        setShowForm(true);

      }
    }).catch((err) => {
      if (err) {
        console.log(err);
      }
    });


  }


  return (
    <>
      <Routes>
        <Route path="/ViewEventNotice" element={<ViewEventNotice />} />
      </Routes>
      <div className='half-width container mt-3 d-flex justify-content-center float-start' style={{ width: '30%', marginLeft: '200px' }}>
        <section>

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
                <Form.Control type="date" name='startingDate' value={firstDate} onChange={handleFirstDateChange} placeholder="Enter starting date of the event" style={{ backgroundColor: '#F7FFCF' }} />
              </Form.Group>

              <Form.Group className="mb-3 col-lg-12" controlId="formBasicEmail">
                <Form.Label style={{ color: 'white' }}>Registration deadline</Form.Label>
                <Form.Control type="date" name='deadline' max={firstDate} onChange={handleSecondDateChange} placeholder="Enter deadline date for registration" style={{ backgroundColor: '#F7FFCF' }} />
              </Form.Group>
              {error && <p style={{ color: 'red' }}>{error}</p>}

              <Button variant="primary" className='col-lg-6' onClick={addData} type="submit">
                Submit
              </Button>
            </Form>
          </div>
        </section>
      </div>

      <div className=' half-width container float-end' style={{ 'marginTop': '80px' }}>
        {showForm &&
          <div>
            <ViewEventNotice name={fvalue.name} firstDate={firstDate} lastDate={secondDate} />

          </div>
        }
      </div>
    </>
  )
}

export default EventNotice