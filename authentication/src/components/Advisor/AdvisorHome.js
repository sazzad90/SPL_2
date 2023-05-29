import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import AdvisorHeader from './AdvisorHeader';
import AdvisorNotification from './AdvisorNotification';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import LogOut from './LogOut';
import AdvisorSingle from './AdvisorSingle';
import TeamListForm from './TeamListForm';

const AdvisorHome = () => {
  const [profileData, setProfileData] = useState(null);
  const location = useLocation();

  const { email } = useParams();



  useEffect(() => {
    console.log(email)

    Axios.get(`http://localhost:5050/fetchProfile/${email}`, {}
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
      <AdvisorHeader />
      <Routes>
        <Route path="/AdvisorNotification/*" element={<AdvisorNotification />} />
        <Route path="/RegistrationForm/*" element={<RegistrationForm />} />
        <Route path="/LogOut" element={<LogOut />} />
        <Route path='/AdvisorNotification/AdvisorSingle/:id/*' element={<AdvisorSingle />} />
        <Route path='/AdvisorNotification/AdvisorSingle/:id/TeamListForm/:eventName' element={<TeamListForm />} />

      </Routes>

      <div className="d-flex">
        <div className="flex-grow-1 d-flex align-items-flex-start justify-content-center" style={{ backgroundColor: 'lightcyan' }}>
          {!isNotificationSection && !isRegistrationForm && profileData &&
            <div className="container mt-4 d-flex justify-content-center" style={{ width: '60%' }}>
              <img style={{ height: '55%', width: '55%', marginTop: '50px', display: 'block' }} src="https://deltamar.sites.uu.nl/wp-content/uploads/sites/307/2017/09/Dhaka_University_logo-740x537.png" />

              <table className="table" style={{ maxWidth: '600px', maxHeight: '200px', marginTop: '30px' }}>
                <tbody>
                  <tr style={{ borderColor: 'white' }}>
                    <td colSpan={2}><h2>User Information</h2></td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td style={{ textTransform: 'uppercase' }}>{profileData.name}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{profileData.email}</td>
                  </tr>
                  <tr>
                    <th>Department</th>
                    <td style={{ textTransform: 'uppercase' }}>{profileData.department}</td>
                  </tr>
                  <tr>
                    <th>Designation</th>
                    <td style={{ textTransform: 'uppercase' }}>{profileData.designation}</td>
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