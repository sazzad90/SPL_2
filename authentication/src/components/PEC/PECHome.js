import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import PECNotification from './PECNotification';
import PECHeader from './PECHeader';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import LogOut from './LogOut';
import SingleNotification from './SingleNotification';

const PECHome =()=> {
  const [profileData, setProfileData] = useState(null);
  const location = useLocation();

  const {email} = useParams();
  useEffect(() => {
    console.log(email)
     Axios.get(`http://localhost:5050/fetchProfile/${email}`,{}
     )
     .then((response) => {
      console.log(response.data);
      setProfileData(response.data);
})
.catch((err) => {
  console.log(err);
});

  }, []);


 const isNotificationSection = location.pathname.includes('/PECNotification');

  return (
    <>
    <PECHeader/> 
    <Routes>
    <Route path="/PECNotification/*" element={<PECNotification/>} />
    <Route path="/LogOut" element={<LogOut/>} />
    <Route path="/PECNotification/SingleNotification/:id" element={<SingleNotification/>} /> 
    </Routes>

 <div className="d-flex">
      <div className="flex-grow-1 d-flex align-items-flex-start justify-content-center">
          {!isNotificationSection && profileData && 
            <div className="container mt-4 d-flex justify-content-center">
            <table className="table" style={{maxWidth : '400px', maxHeight:'200px'}}>
              <tbody>
                <tr style={{borderColor : 'white'}}>
                  <td colSpan={2}><h2>User Information</h2></td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{profileData.name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{profileData.email}</td>
                </tr>
                <tr>
                  <th>User type</th>
                  <td>{profileData.designation}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          // ): (
          //   <p>Loading...</p>
          // )
        }
          
        </div>
        </div>
   
            
    </>
  )
}

export default PECHome