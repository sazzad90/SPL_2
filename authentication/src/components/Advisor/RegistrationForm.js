import React from 'react'
import { useParams } from 'react-router-dom';

const RegistrationForm = ()=> {
    const {email} = useParams();

  return (
    <div>form</div>
  )
}

export default RegistrationForm