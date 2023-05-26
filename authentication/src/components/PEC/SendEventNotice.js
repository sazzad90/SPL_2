import React from 'react'
import { useState } from 'react';
import Axios from 'axios';

const SendEventNotice =()=> {
    const [showForm, setShowForm] = useState(false);

        Axios.post("http://localhost:5050/sendEventNotice",{
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

  return (
    <>
    {showForm &&
        <div class="alert alert-success" role="alert" alignment="center">
   Email is successfully sent.
 </div> 


}
</>

  );
}


 

export default SendEventNotice