import React, {useState,useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ExecutiveSingle=() => {
    const navigate = useNavigate();
    const {id} = useParams();
    const {email} = useParams();
    const [showRegister, setShowRegister] = useState(false);
    const [noticeType,setNoticeType] = useState(false);
    const [eventName, setEventName] = useState('');


    const [notification, setNotification] = useState([]);

    useEffect(() => {
      const fetchNotification = async () => {
        const response = await axios.get(`http://localhost:5050/executiveNotification/${id}`);
        setNotification(response.data);
        }
      fetchNotification();
    }, []);
  return (
    <>
    <div className='container  ml-4 d-block'>
        <div className='row justify-content-center'>
            <div className='col-8 text-left mt-4 ml-10' >
                <h2 className='text-center'>
                    {notification.title}
                </h2>
                <pre className='mt-4'>
                    {notification.body}
                </pre>

            </div>  
            </div>
            </div>
    </>
  )
}

export default ExecutiveSingle