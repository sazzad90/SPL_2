import React from 'react'
import Header from './Header'
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PostEventNotice.css'

import { useState, useEffect } from 'react';
import axios from 'axios';
const Fixture =()=> {  

  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:5050/publishFixture')
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setShowForm(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (
  <>
    <Header/>

    <div>
  {showForm && 
       <div>
       <h2 style={{ textAlign: 'center' }}>Fixtures</h2>
       <Table striped bordered hover>
         <thead>
           <tr>
             <th style={{ textAlign: 'center' }}>Team 1</th>
             <th style={{ textAlign: 'center' }}>Date</th>
             <th style={{ textAlign: 'center' }}>Team 2</th>
             
           </tr>
         </thead>
         <tbody>
           {data.map(f => (
             <tr key={f.fixtureID}>
               <td style={{ textAlign: 'center' }}>{f.team1}</td>
               <td style={{ textAlign: 'center' }}>{f.time}<br/>{f.matchTime}</td>
               <td style={{ textAlign: 'center' }}>{f.team2}</td>
 
             </tr>
           ))}
         </tbody>
       </Table>
     </div>
  }
  </div>


  </>
    
  )
}

export default Fixture