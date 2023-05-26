import React, { useState } from 'react'
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';


const OTP=()=> {
    const history = useNavigate();
    const [otp,setOTP] = useState();

    const getData =(data)=>{
        const fieldName = data.target.name;
        const fieldValue = data.target.value;

        setOTP(()=>{
            return {
                ...otp,
                [fieldName]:fieldValue
            }
        })
    }

    const verify =()=>{
        Axios.post('http://localhost:5050/authentication',{
            email : 'bsse1207@iit.du.ac.bd'
        }).then((response)=>{
            if(response.data[0].otp === otp){
                history('/Home');
            }
        })
    
    }
  return (
    <div>
        <Form>
    <Form.Group className="mb-3 col-lg-4" controlId="formBasicName">
            <Form.Label> OTP</Form.Label>
            <Form.Control type="name" name='name' onChange={getData} placeholder="Enter your name" />
        </Form.Group>
        <Button variant="primary" className='col-lg-4' onClick={verify} type="submit">
            Submit
        </Button>
    </Form>
</div>
  )
}

export default OTP