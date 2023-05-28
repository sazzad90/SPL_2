import React, {useState,useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';

const SingleNotification=() => {
    const {id} = useParams();
    const [showDenyForm, setShowDenyForm] = useState(false);
    const [showNorthForm, setShowNorthForm] = useState(false);
    const [showSouthForm, setShowSouthForm] = useState(false);
    const [showAllForm, setShowAllForm] = useState(false);

    const [notification, setNotification] = useState([]);

    useEffect(() => {
      const fetchNotification = async () => {
        const response = await axios.get(`http://localhost:5050/pecnotification/${id}`);
        setNotification(response.data);
        console.log(response.data);
        console.log(`${id}`)
      };
      
      fetchNotification();
    }, []);

let thirdWord;
    if (notification && notification.title) {
      const event = notification.title;
      const words = event.split(' ');
    
      // Ensure the array has at least three elements before accessing the third word
      if (words.length >= 3) {
         thirdWord = words[3];
        console.log(thirdWord); // Output: "Name"
      } else {
        console.log('Not enough words in the string.');
      }
    } else {
      console.log('Notification or title is undefined.');
    }

    
    const handleDeny = async() => {
      try {
        const response = await axios.post(`http://localhost:5050/denyEventNotice/${id}`,{
           eventName: thirdWord,
        });
        setShowDenyForm(true);
        console.log(response);
      } catch (error) {
          console.log(error)  
    }
    };

    const handleSendNorth =async () => {
      try {
        const response = await axios.post("http://localhost:5050/approveNorthEventNotice",{
            id:`${id}`,
        });
        setShowAllForm(true);
        console.log(response);
      } catch (error) {
      }

    };
  
    const handleSendSouth =async () => {
      try {
        const response = await axios.post("http://localhost:5050/approveSouthEventNotice",{
            id:`${id}`,
        });
        setShowAllForm(true);
        console.log(response);
      } catch (error) {
           

    };
  }
  
    const handleSendAll = async() => {
      try {
        const response = await axios.post("http://localhost:5050/approveAllEventNotice",{
            id:`${id}`,
        });
        setShowAllForm(true);
        console.log(response);
      } catch (error) {
          console.log(error)  
    }
    };
  

  return (
    <>

    <div className=' container  ml-4 d-flex justify-content-center'>
        <div className='row d-flex justify-content-center'>
            <div className='col-12 text-left mt-4' >
                <h2 className='text-center'>
                    {notification.title}
                </h2>
                <pre className='mt-4'>
                    {notification.body}
                </pre>
                <div className = "float-start ml-6 mt-4">
                <button type='button' className='btn btn-danger' onClick={handleDeny}>Deny</button>
                </div>
                <div className='float-end mt-4'>
                <DropdownButton id="send-dropdown" title="Send">
                      <Dropdown.Item>
                        <button type='button' className='btn btn-success' style={{width:'100%'}} onClick={handleSendNorth}>Send to North</button>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <button type='button' className='btn btn-success' style={{width:'100%'}} onClick={handleSendSouth}>Send to South</button>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <button type='button' className='btn btn-success' style={{width:'100%'}} onClick={handleSendAll}>Send to All</button>
                      </Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>

            <div style={{marginTop:'50px'}}>
                {showDenyForm &&
                <div class = "row d-flex justify-content-center">
                  <br/><br/>
                 <div className='alert alert-danger d-block justify-center text-center col-lg-6 mt-4'  role="alert" alignment="center">
                     Event notice is sent back to the executive for <strong> review</strong>
                    </div>
                    </div>
                }
                {showNorthForm &&

                  <div class = "row d-flex justify-content-center">
                  <br/><br/>
                  <div className='alert alert-success d-block justify-center text-center col-lg-6 mt-4'  role="alert" alignment="center">
                  Event notice is sent to the departments of <strong>north zone</strong> 
                    </div>
                    </div>
                  
                }
                {showSouthForm &&

                  <div class = "row d-flex justify-content-center">
                  <br/><br/>
                  <div className='alert alert-success d-block justify-center text-center col-lg-6 mt-4'  role="alert" alignment="center">
                  Event notice is sent to the departments of <strong>south zone</strong> 
                    </div>
                    </div>

                }
                {showAllForm &&
              <div class = "row d-flex justify-content-center">
              <br/><br/>
              <div className='alert alert-success d-block justify-center text-center col-lg-6 mt-4'  role="alert" alignment="center">
              Event notice is sent to <strong>all</strong> the departments
                </div>
                </div>

                }
        </div>
        </div>
        </div>
    </>
  )
}

export default SingleNotification