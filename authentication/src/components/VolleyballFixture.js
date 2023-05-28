import React from 'react'
import Header from './Header'
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PostEventNotice.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

const VolleyballFixture =()=> {  
  const [showForm, setShowForm] = useState(false);
  const [showForm1, setShowForm1] = useState(false);

  const [data, setData] = useState([]);
  
const eventType = 'Volleyball'
  useEffect(() => {
    axios.get('http://localhost:5050/publishVolleyballFixture')
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        if(response.data.length != 0) {
            setShowForm(true);
          }       })
      .catch((error) => {
        console.log(error);
      });

      console.log('data: ',data);
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
            <React.Fragment key={f.fixtureID}>
            <tr>
              <td style={{ textAlign: 'center',  border: f.team1 === f.winner ? '2px solid green' : '1px solid black'}}>{f.team1}</td>
              <td style={{ textAlign: 'center', borderRight:'1px solid black' }}>{f.time}<br/>{f.matchTime}</td>
              <td style={{ textAlign: 'center', border: f.team2 === f.winner ? '2px solid green' : '1px solid black' }}>{f.team2}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center' }}>{f.score1}</td>
              <td style={{ textAlign: 'center' }}></td>
              <td style={{ textAlign: 'center' }}>{f.score2}</td>
            </tr>
          </React.Fragment>

           ))}

         </tbody>


       </Table>
     </div>
  }
    {!showForm &&
                    <div class = "row d-flex justify-content-center">
                    <br/><br/>
                   <div className='alert alert-success d-block justify-center text-center col-lg-6 mt-4'  role="alert" alignment="center">
                       Event is yet to be started
                      </div>
                      </div>
                }
  </div>


  </>
    
  )
}

export default VolleyballFixture