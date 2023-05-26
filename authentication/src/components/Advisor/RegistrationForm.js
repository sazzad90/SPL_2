import React from 'react'
import { useParams } from 'react-router-dom';

const registrationForm = ()=> {
    const {email} = useParams();

  return (
    <div>form</div>
  )
}

export default registrationForm