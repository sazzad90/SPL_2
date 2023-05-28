import React from 'react'
import  { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const AdvisorNotification =()=> {
  const {email} = useParams();

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
      const fetchNotifications = async () => {
        const response = await Axios.get(`http://localhost:5050/advisorNotifications/${email}`);
        setNotifications(response.data);
        console.log([response.data])
      };
      fetchNotifications();
    }, []);




  return (
    <>
    <div>

    <ul style={{ listStyle: 'none',width: '100%', margin: 0, padding: 0  }}>
       {notifications.map((notification) => (
        <li key={notification.id} style={{textDecoration: 'none'}}>
          <Link to={`/AdvisorHome/${email}/AdvisorNotification/AdvisorSingle/${notification.id}`} style={{ textDecoration: 'none' }}>
          <div class="d-grid">
            <button type="button" class="btn btn-outline-secondary btn-block" style={{fontFamily: 'Proxima Nova',color:'black',textAlign:'left',paddingLeft:'80px'}}><strong>  {notification.title}</strong></button>
          </div>
           </Link>
        </li>
      ))} 
    </ul>
  </div>
  </>
  )
}

export default AdvisorNotification