import React, { useState } from 'react'
import { Routes,Route, useNavigate, useParams } from 'react-router-dom';
import './EventNotice.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const Verification =()=> {
  const {email} = useParams()
  // const {eventName} = useParams
  const [eventName, setEventName] = useState('');

  const navigate = useNavigate();
  const [fvalue, setFiledValue] = useState({
    name: "",

  })
  const getData = (data) =>{
    const fieldName = data.target.name;
    const fieldValue = data.target.value;
    setEventName(fieldValue);

    setFiledValue(()=>{
        return{
            ...fvalue,
            [fieldName]: fieldValue
        }
    })
}


const addData = (data) => {
  data.preventDefault();
   const {name} = fvalue;
   navigate(`/Home/${email}/Verification/PlayerList/${eventName}`) ;

}
  return (
    <>
    <div className='d-flex justify-content-center' style={{marginTop:'100px'}}>
    <div className='left_side mt-3 ml-10' style={{ backgroundColor: '#0A4770', padding: '20px', borderRadius: '10px',width:'30%' }}>
      <h3 className='col-lg-12' style={{ color: 'white', marginBottom: '20px' }}>Player Verification</h3>
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


        <Button variant="primary" className='col-lg-6' onClick={addData} type="submit">
          Submit
        </Button>
      </Form>
    </div>
    </div>
    </>
  )
}

export default Verification