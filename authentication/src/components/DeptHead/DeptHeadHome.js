import React from 'react'
import DeptHeadHeader from './DeptHeadHeader'
import DeptHeadNotification from './DeptHeadNotification';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import LogOut from './LogOut';
import DeptSingle from './DeptSingle';

const DeptHeadHome =()=> {
  const [profileData, setProfileData] = useState(null);
  const location = useLocation();

  const {email} = useParams();

  useEffect(() => {
   
     Axios.get(`http://localhost:5050/fetchProfile/${email}`,{})
     .then((response) => {
      console.log("response : " + response);
      setProfileData(response.data);
})
.catch((err) => {
  console.log(err);
});

  }, []);

  const isNotificationSection = location.pathname.includes('/DeptHeadNotification');

  return (
    <>
    <DeptHeadHeader/> 
    <Routes>
    <Route path="/DeptHeadNotification/*" element={<DeptHeadNotification/>} />
    <Route path="/LogOut" element={<LogOut/>} />
    <Route path="/DeptHeadNotification/DeptSingle/:id" element={<DeptSingle/>} /> 
    </Routes>

     <div className="flex-grow-1 d-flex align-items-flex-start justify-content-center">
          {!isNotificationSection &&  profileData &&
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
          }
          
        </div>        
    </>
  )
}

export default DeptHeadHome