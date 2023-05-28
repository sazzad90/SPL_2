import React, {useState,useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdvisorSingle=() => {
    const navigate = useNavigate();
    const {id} = useParams();
    const {email} = useParams();
    const [showRegister, setShowRegister] = useState(false);
    const [noticeType,setNoticeType] = useState(false);
    const [eventName, setEventName] = useState('');


    const [notification, setNotification] = useState([]);

    useEffect(() => {
      const fetchNotification = async () => {
        const response = await axios.get(`http://localhost:5050/deptHeadNotification/${id}`);
        setNotification(response.data);
        const title1 = response.data.title;
        const title2 = response.data.title;

        console.log('title: ',title1);

        const firstWord = title1.split(" ")[1];
        console.log('firstWord: ',firstWord);
        if(firstWord === 'Event'){
          setNoticeType(true);
        }

        const match = title2.split(" ")[3];
    //    const finalTitle = match && match[1];
        console.log('final:',match);
        setEventName(match);
      }; 
      fetchNotification();
    }, []);

    const handleTeamlist = async() => { 
      navigate(`/AdvisorHome/${email}/AdvisorNotification/AdvisorSingle/${id}/TeamListForm/${eventName}`) 
    //   try {
    //     const response = await axios.post(`http://localhost:5050/eventRegistration/${email}`,{
    //         id : `${id}`
    //     });
    //     setShowRegister(true)  
    //     console.log(response);
    //   } catch (error) {
    //       console.log(error)  
    // }

    };


    const handleApprove = async() => {  
      setShowRegister(true);
    try {
      const response = await axios.post(`http://localhost:5050/eventRegistration/${email}`,{
          id : `${id}`
      });
      setShowRegister(true)  
      console.log(response);
    } catch (error) {
        console.log(error)  
  }

  };

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
                <div className='d-flex justify-content-end'>
                {noticeType && (
        <button type='button' style={{marginRight:'250px'}} className='btn btn-success ml-8' onClick={handleApprove}>
          Register
        </button>
                      
      )}

      {!noticeType && (
        <button type='button' className='btn btn-success ml-8' onClick={handleTeamlist}>
          Teamlist Form
        </button>
      )}
                </div>
  
            </div>

            <div>
                      {showRegister && noticeType &&
                      <div class = "row d-flex justify-content-center">
                        <br/><br/>
                       <div className='alert alert-success d-block justify-center text-center col-lg-6 mt-4'  role="alert" alignment="center">
                           <strong>Registration</strong> is successfully completed.
                          </div>
                          </div>
                      }
              </div>
        </div>
    </>
  )
}

export default AdvisorSingle