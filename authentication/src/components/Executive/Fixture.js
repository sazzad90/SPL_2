
import Button from 'react-bootstrap/Button';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

const Fixture =()=> {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5050/data')
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const addData = () => {
    //  data.preventDefault();
  
      axios.post("http://localhost:5050/publishFixture",{
  
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
  }

  return (
    <>

    <div className='d-flex justify-content-center'>
        
        <h2>Fixtures</h2>
      
    </div>
    <div className='d-flex w-70 justify-content-center'>
      {/* <h2 style={{ textAlign: 'center' }}>Fixtures</h2> */}
      <Table striped bordered hover>
        <thead>
            <tr>
            <th style={{ textAlign: 'center' }}>Team 1</th>
            {/* <th style={{ textAlign: 'center' }}>Date</th> */}
            <th style={{ textAlign: 'center' }}>Time</th>
            <th style={{ textAlign: 'center' }}>Team 2</th>
            
          </tr>
        </thead>
        <tbody>
          {data.map(f => (
            <tr key={f.fixtureID}>
              <td style={{ textAlign: 'center' }}>{f.team1}</td>
              <td style={{ textAlign: 'center' }}>{f.time} <br/> {f.matchTime}</td>
              <td style={{ textAlign: 'center' }}>{f.team2}</td>

            </tr>
          ))}
        </tbody>
      </Table>
    </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '25px'}}>
        <Button variant="primary" className='col-lg-1' onClick={addData} type="submit"> Publish </Button>
        </div>


        <div>
                {showForm &&
                <div class = "row">
                  <br/><br/>
                <div class = "col-lg-4">  </div>
                 <div className='alert alert-success d-flex justify-content-center col-lg-4 mt-4'  role="alert" alignment="center">
                     Fixture has successfully been published
                    </div>
                    <div class = "col-lg-4">  </div>
                    </div>
                }
       </div>
        </>
  );
}

export default Fixture;
