import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Axios from 'axios';
import { Routes,Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParams,Link } from 'react-router-dom';


const GroupStage =()=>{
    const {email} = useParams();

  const history = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [fvalue, setFiledValue] = useState({
      eventName:"",
      startingDate: "",
      groupNumber: ""
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
     const {eventName,groupNumber} = fvalue;

   // console.log(name, date);

    Axios.post("http://localhost:5050/fixtureInfo",{
        eventName:eventName,
        groupNumber:groupNumber,
    }).then((response)=>{
        if(response){
            console.log('eventid: ',response.data.eventID);          
            setShowForm(true);
            history(`/Home/${email}/GroupStage/Fixture`);
        }
    }).catch((err)=>{
        if(err){
            console.log(err);
        }
    });
}


  return (
    <>

     <div className='half-width container mt-3 d-flex justify-content-center'>
     <section>
     
         <div className='mt-3 d-flex justify-content-center'> 
             <Form>
             <h3 className='text-center'>Fixture Form</h3>
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

                 {/* <Form.Group className="mb-3 col-lg-12" controlId="formBasicEmail">
                    <Form.Label>Starting date</Form.Label>
                     <Form.Control type="date" name='startingDate' onChange={getData} placeholder="Enter starting date of the event" />
                 </Form.Group> */}
                 
                 <Form.Group className="mb-3 col-lg-12" controlId="formBasicName">
                     <Form.Label>Number of Groups</Form.Label>
                     <Form.Control type="number" name='groupNumber' onChange={getData} placeholder="Set number of groups" />
                 </Form.Group>
          
                 <Button variant="primary" className='col-lg-5' onClick={addData} type="submit">
                 Generate 
                 </Button>
             </Form>
             </div>
             </section>
             </div>

        {/* {showForm && 
            <div><div className='alert alert-success mt-3'  role="alert" alignment="center">
            Fixture information are submitted successfully. To generate fixture click 'Generate fixture' button.
          </div> 
          <Button variant="primary" className='col-lg-1.5 ml-3' onClick={generate} type="submit">
          Generate fixture
      </Button></div>
          } */}

    


</>

  )
}

export default GroupStage