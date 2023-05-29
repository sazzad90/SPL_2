import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import PECNotification from './PECNotification';
import PECHeader from './PECHeader';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import LogOut from './LogOut';
import SingleNotification from './SingleNotification';

const PECHome = () => {
  const [profileData, setProfileData] = useState(null);
  const location = useLocation();

  const { email } = useParams();
  useEffect(() => {
    console.log(email)
    Axios.get(`http://localhost:5050/fetchProfile/${email}`, {}
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
      <PECHeader />
      <Routes>
        <Route path="/PECNotification/*" element={<PECNotification />} />
        <Route path="/LogOut" element={<LogOut />} />
        <Route path="/PECNotification/SingleNotification/:id" element={<SingleNotification />} />
      </Routes>

      <div className="d-flex" style={{ backgroundColor: 'lightcyan' }}>
        <div className="flex-grow-1 d-flex align-items-flex-start justify-content-center">
          {!isNotificationSection && profileData &&
            <div className="container mt-4 d-flex justify-content-center" style={{ width: '60%' }}>
              <img style={{ height: '50%', width: '50%', marginTop: '50px', display: 'block' }} src="https://deltamar.sites.uu.nl/wp-content/uploads/sites/307/2017/09/Dhaka_University_logo-740x537.png" />

              <table className="table" style={{ maxWidth: '600px', maxHeight: '200px', marginTop: '20px' }}>
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