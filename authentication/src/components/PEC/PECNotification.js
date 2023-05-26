import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Routes,Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ViewEventNoticeList from './ViewEventNoticeList';

const PECNotification = () => {
  const [showForm, setShowForm] = useState(false);
  const history = useNavigate();

  const [message, setMessage] = useState('');

  const ENDPOINT = 'http://localhost:8000';

  useEffect(() => {
    const socket = io(ENDPOINT);

    // Listen for messages from the server
    socket.on('admin-notification', (data) => {
      setMessage(data);
    });

    // Clean up the WebSocket connection
    return () => {
      socket.disconnect();
    };
  }, [message]);


  const sendEmail = () => {

     Axios.post("http://localhost:5050/sendEventNotice",{
    }).then((response)=>{
        if(response){
            console.log(response);
            setShowForm(true);
            //history(`/ViewEventNoticeList`);
            
        }
    }).catch((err)=>{
        if(err){
            console.log(err);
        }
    });
  
}


    ////////////////

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
      const fetchNotifications = async () => {
        const response = await Axios.get('http://localhost:5050/PECnotifications');
        setNotifications(response.data);
      };
  
      fetchNotifications();
    }, []);

  return (
    <>
    <Routes>
      <Route path="/ViewEventNoticeList" element={<ViewEventNoticeList/>} />
    </Routes>



<div>

      <ul style={{ listStyle: 'none',width: '100%', margin: 0, padding: 0  }}>
        {notifications.map((notification) => (
          <li key={notification.id} style={{textDecoration: 'none'}}>
            <Link to={`http://localhost:5050/pecnotification/${notification.id}`} style={{ textDecoration: 'none' }}>
            <div class="d-grid">
              <button type="button" class="btn btn-outline-secondary btn-block" style={{fontFamily: 'Proxima Nova',color:'black',textAlign:'left',paddingLeft:'80px'}}><strong>  {notification.title}</strong></button>
            </div>
             </Link>
          </li>
        ))}
      </ul>
    </div>
    </>  
  );
};

export default PECNotification;




