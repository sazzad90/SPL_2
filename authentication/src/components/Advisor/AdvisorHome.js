import React from 'react'
import { Routes,Route,useLocation } from 'react-router-dom';
import AdvisorHeader from './AdvisorHeader';
import AdvisorNotification from './AdvisorNotification';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import LogOut from './LogOut';
import AdvisorSingle from './AdvisorSingle';
import TeamListForm from './TeamListForm';

const AdvisorHome =()=> {
  const [profileData, setProfileData] = useState(null);
  const location = useLocation();

  const {email} = useParams();



  useEffect(() => {
    console.log(email)
   
     Axios.get(`http://localhost:5050/fetchProfile/${email}`,{}
     )
     .then((response) => {
     
      console.log(response.data);
      const name = response.data.name;
      const designation = response.data.designation;
      
      setProfileData(response.data);
})
.catch((err) => {
  console.log(err);
});

  }, []);


 const isNotificationSection = location.pathname.includes('/AdvisorNotification');
 const isRegistrationForm = location.pathname.includes('/RegistrationForm');


  return (
    <>
    <AdvisorHeader/>
    <Routes>
    <Route path="/AdvisorNotification/*" element={<AdvisorNotification/>} />
    <Route path="/RegistrationForm/*" element={<RegistrationForm/>} />
    <Route path="/LogOut" element={<LogOut/>} />
    <Route path='/AdvisorNotification/AdvisorSingle/:id/*' element={<AdvisorSingle/>} />
    <Route path='/AdvisorNotification/AdvisorSingle/:id/TeamListForm/:eventName' element={<TeamListForm/>} />

    </Routes>  

    <div className="d-flex">
      <div className="flex-grow-1 d-flex align-items-flex-start justify-content-center">
          {!isNotificationSection && !isRegistrationForm && profileData && 
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
        </div>         
    </>
  )
}

export default AdvisorHome