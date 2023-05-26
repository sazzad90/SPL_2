import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Axios from 'axios';
import { Routes,Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParams,Link } from 'react-router-dom';


const KnockOut =()=>{
    const {email} = useParams();

  const history = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [fvalue, setFiledValue] = useState({
    eventName:"",
      startingDate: ""

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
     const { eventName,startingDate} = fvalue;

   // console.log(name, date);

    Axios.post("http://localhost:5050/knockOutfixtureInfo",{
        eventName:eventName,
        startingDate:startingDate,

    }).then((response)=>{
        if(response){
            console.log(response);          
            history(`/Home/${email}/KnockOut/KnockOutFixture`);
        }
    }).catch((err)=>{
        if(err){
            console.log(err);
        }
    });
}


  return (
    <>


     <div className='half-width container mt-3 d-flex justify-content-center' >
     <section>
         <div className='left_side mt-3'>
             <h3 className='text-center col-lg-12'>Fixture Form</h3>
             <Form>
             <Form.Group className="mb-3 col-lg-12" controlId="formBasicName">
                            <label htmlFor="dropdown">Event name</label><br/>
                                <select id="dropdown" name='eventName'  onChange={getData}>
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
                 
          
                 <Button variant="primary" className='col-lg-7' onClick={addData} type="submit">
                 Generate 
                 </Button>
             </Form>
             </div>
             </section>
             </div>


    


</>

  )
}

export default KnockOut