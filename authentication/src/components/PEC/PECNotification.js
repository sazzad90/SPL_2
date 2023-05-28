import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const PECNotification = () => {
  const {email} = useParams()

  const sendEmail = () => {

     Axios.post("http://localhost:5050/sendEventNotice",{
    }).then((response)=>{
        if(response){
            console.log(response);
        }
    }).catch((err)=>{
        if(err){
            console.log(err);
        }
    });
  
}
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
<div>

      <ul style={{ listStyle: 'none',width: '100%', margin: 0, padding: 0  }}>
        {notifications?.map((notification) => (
          <li key={notification.id} style={{textDecoration: 'none'}}>
            <Link to={`/PECHome/${email}/PECNotification/SingleNotification/${notification.id}`} style={{ textDecoration: 'none' }}>
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




