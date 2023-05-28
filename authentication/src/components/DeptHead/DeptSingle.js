import React, {useState,useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';

const DeptSingle=() => {
    const {id} = useParams();
    const [showDenyForm, setShowDenyForm] = useState(false);
    const [showApproveForm, setShowApproveForm] = useState(false);


    const [notification, setNotification] = useState([]);

    useEffect(() => {
      const fetchNotification = async () => {
        const response = await axios.get(`http://localhost:5050/deptHeadNotification/${id}`);
        setNotification(response.data);
        console.log(response.data);
        console.log(`${id}`)
      };
      
      fetchNotification();
    }, []);

    const handleDeny = async() => {
        setShowDenyForm(true);
        try {
          const response = await axios.post(`http://localhost:5050/denyByDeptHead/${id}`,{
              id:`${id}`,
          });
          console.log(response);
        } catch (error) {
            console.log(error)  
      }

    };

   
  
    const handleApprove = async() => {  
      try {
        const response = await axios.post("http://localhost:5050/approveEventNoticeByHead",{
            id:`${id}`,
        });
        setShowApproveForm(true)  
        console.log(response);
      } catch (error) {
          console.log(error)  
    }

    };

  return (
    <>

    <div className='container  ml-4 d-block'>
        <div className='d-block justify-content-center'>
            <div className='d-block col-8 mt-4 ml-10' style={{marginLeft:'200px'}}>
                <h2 className='text-center'>
                    {notification.title}
                </h2>
                <pre className='mt-4'>
                    {notification.body}
                </pre>
            </div>
                <div className="float-start mt-4" style={{marginLeft:'200px'}}>
                <button type='button' className='btn btn-danger' onClick={handleDeny}>Deny</button>
                </div>
                <div className="float-end ml-6 mt-4" style={{marginRight:'250px'}}>
                <button type='button' className='btn btn-success ml-8' onClick={handleApprove}>Approve</button>
                </div>
              
     
            </div>

            <div style={{marginTop:'100px'}}>
                {showDenyForm &&
                <div class = "row justify-content-center" >
                  <br/><br/>
                 <div className='alert alert-danger d-block justify-center text-center col-lg-6 mt-4'  role="alert" alignment="center">
                     Event notice is  <strong> denied</strong>
                    </div>
                    </div>
                }

                {showApproveForm &&
                <div class = "row d-flex justify-content-center">
                  <br/><br/>
                 <div className='alert alert-success d-block justify-center text-center col-lg-6 mt-4'  role="alert" alignment="center">
                     Event notice is forwarded to <strong> student advisor</strong>
                    </div>
                    </div>
                }
        </div>
        </div>
    </>
  )
}

export default DeptSingle