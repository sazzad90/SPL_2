import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Table } from 'antd';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PlayerList =()=> {
  const navigate = useNavigate()
    const {email} = useParams()
    const {eventName} = useParams()
    const [data, setData] = useState([]);

useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        // Perform your database query here
        const response = await axios.get(`http://localhost:5050/playerInfo/${eventName}`);
        console.log(response);

        // const jsonData = await response.json();
        console.log('r: ',response.data);
        setData(response.data);
        console.log("data: ", data);

      } catch (error) {
        console.log('Error fetching data from the database:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit =async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:5050/notifyDepartments/${eventName}`);
      console.log(response);
    } catch (error) {
      console.log('Error fetching data from the database:', error);
    }
    // navigate(`/Home/${email}/Verification/PlayerList/${eventName}/UnverifiedPlayers`) ;

  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Reg. no',
      dataIndex: 'reg_no',
      key: 'reg_no',
    },
    
    {
      title: 'Dept. name',
      dataIndex: 'dep_name',
      key: 'dep_name',
    },
    {
      title: 'Hall',
      dataIndex: 'hall',
      key: 'hall',
    },
  
    {
      title: 'Session',
      dataIndex: 'session',
      key: 'session',
    },


  ];




  const hasNullOutput = (rowData) => {
    // Check if any of the row data fields are null
    const values = Object.values(rowData);
    return values.some((value) => value === null);
  };

  return (
    <>
      <div className="d-flex justify-content-end">
        <Table style={{ width: '88%' }} dataSource={data} columns={columns} rowClassName={(record) => (hasNullOutput(record) ? 'null-row' : '')} />
      </div>
      <div className="d-flex justify-content-end" style={{ marginRight: '40px' }}>
        <Button type="submit" onClick={handleSubmit}>
          Notify departments
        </Button>
      </div>
      <style>
        {`
          .null-row {
            background-color: lightcyan;
          }
        `}
      </style>
    </>
  );

  // return (
  // <>
  
  //       <div className='d-flex justify-content-end'>
  //       <Table style = {{width:'88%'}} dataSource={data} columns={columns} />
        
  //       </div>
  //       <div className='d-flex justify-content-end' style = {{marginRight:'40px'}}>
  //       <Button type="submit" onClick={handleSubmit}>
  //     Notify departments
  //   </Button>
  //   </div>


  // </>
  // )
}

export default PlayerList