import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Axios from 'axios'
import './EventNotice.css'
import ViewTeamlistNotice from './ViewTeamlistNotice';

const TeamlistNotice =()=> {

    const [showForm, setShowForm] = useState(false);
    let startingDate;
  const [fvalue, setFiledValue] = useState({
    name: "",
    deadline:"",
    startingDate: ''
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
   const {name, deadline} = fvalue;
   const type = 'teamlist';
   const year = new Date().getFullYear();

  Axios.post("http://localhost:5050/teamlistNoticeSubmit",{
      name:name,
      deadline:deadline ,
      type:type,  
      year:year
  }).then((response)=>{
      if(response){
          console.log(response);

          setFiledValue((prevValues) => ({
            ...prevValues,
            startingDate: response.data.startingDate,
          }));

          console.log(fvalue.startingDate);
          setShowForm(true);
         
      }
  }).catch((err)=>{
      if(err){
          console.log(err);
      }
  });

 
}


  return (
    <div className='cotainer d-block justify-content-center'>
    <div className='half-width container mt-3 d-flex justify-content-center'>
                <section>
                    <div className='left_side mt-3'>
                        <h3 className='col-lg-12'>Team List Notice</h3><br />
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
                                <Form.Label>Deadline</Form.Label>
                                <Form.Control type="date" name='deadline' onChange={getData} placeholder="Enter deadline date for team list submission" />
                            </Form.Group>

                      
                            <Button variant="primary" className='col-lg-6' onClick={addData} type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                    
                </section>
                </div>

                

                <div className=' half-width container mt-3'>
                {showForm &&
                  <div>
                    <ViewTeamlistNotice name = {fvalue.name} firstDate = {fvalue.startingDate} lastDate = {fvalue.deadline} />
                    </div>
                    }
    
                </div>      
        </div>


  )
}

export default TeamlistNotice