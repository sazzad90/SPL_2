import React from 'react'
import EventNotice from './EventNotice';
import TeamlistNotice from './TeamlistNotice';
import ExecutiveHeader from './ExecutiveHeader';
import { Routes, Route, useLocation } from 'react-router-dom';
import Verification from './Verification';
import ForwardEventNotice from './ForwardEventNotice';
import ForwardTeamlistNotice from './ForwardTeamlistNotice';
import PostEventNotice from './PostEventNotice';
import GroupStage from './GroupStage';
import KnockOut from './KnockOut';
import ExecutiveNotification from './ExecutiveNotification'
import Fixture from './Fixture';
import KnockOutFixture from './KnockOutFixture';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import LogOut from './LogOut';
import UpdateResults from './UpdateResults';

const Home = () => {

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

  const isEventNoticeSection = location.pathname.includes('/EventNotice');
  const isTeamlistNoticeSection = location.pathname.includes('/TeamlistNotice');
  const isGroupStageSection = location.pathname.includes('/GroupStage');
  const isFixtureSection = location.pathname.includes('/GroupStage/Fixture');
  const isKnockOutSection = location.pathname.includes('/KnockOut');
  const isKnockOutFixtureSection = location.pathname.includes('/KnockOut/KnockOutFixture');
  const isVerificationSection = location.pathname.includes('/Verification');
  const isForwardEventNoticeSection = location.pathname.includes('/ForwardEventNotice');
  const isForwardTeamlistNoticeSection = location.pathname.includes('/ForwardTeamlistNotice');
  const isPostEventNoticeSection = location.pathname.includes('/PostEventNotice');
  const isExecutiveNotificationSection = location.pathname.includes('/ExecutiveNotification');
  const isNotificationSection = location.pathname.includes('/ExecutiveNotification');
  const isUpdateResults = location.pathname.includes('/UpdateResults');







  return (
    <>
    <ExecutiveHeader/>
    <Routes>
      <Route path="/EventNotice/*" element={<EventNotice/>} />
      <Route path="/TeamlistNotice/*" element={<TeamlistNotice/>} />
      <Route path="/GroupStage/*" element={<GroupStage/>} />
      <Route path="/GroupStage/Fixture" element={<Fixture/>} />
      <Route path="/KnockOut/*" element={<KnockOut/>} />
      <Route path="/KnockOut/KnockOutFixture" element={<KnockOutFixture/>} />
      <Route path="/Verification" element={<Verification/>} />
      <Route path="/ForwardEventNotice" element={<ForwardEventNotice/>} />
      <Route path="/ForwardTeamlistNotice" element={<ForwardTeamlistNotice/>} />
      <Route path="/PostEventNotice" element={<PostEventNotice/>} />
      <Route path="/ExecutiveNotification/*" element={<ExecutiveNotification/>} />
      <Route path="/UpdateResults/*" element={<UpdateResults/>} />

      <Route path="/LogOut" element={<LogOut/>} />

      
    </Routes>  
   
    <div className="flex-grow-1 d-flex justify-content-center">
          {!isNotificationSection && !isEventNoticeSection && !isTeamlistNoticeSection &&
          !isGroupStageSection && !isFixtureSection && !isKnockOutSection    && !isKnockOutFixtureSection &&
          !isVerificationSection && !isForwardEventNoticeSection   && !isForwardTeamlistNoticeSection   &&
          !isPostEventNoticeSection   && !isExecutiveNotificationSection && !isUpdateResults && profileData && 
            <div className="container mt-4 d-flex justify-content-center" style = {{width:'40%'}}>
              <img style ={{height:'50%', width:'50%', marginTop:'50px', display:'block'}} src = "https://deltamar.sites.uu.nl/wp-content/uploads/sites/307/2017/09/Dhaka_University_logo-740x537.png"/>         
            <table className="table" style={{maxWidth : '400px', maxHeight:'200px',}}>
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
          
          // : (
          //   <p>Loading...</p>
          // )
          }
          
        </div>
    </>
  )
}

export default Home
