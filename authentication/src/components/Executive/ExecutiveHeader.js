import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import "react-bootstrap-submenu/dist/index.css";
import { DropdownSubmenu, NavDropdownMenu } from "react-bootstrap-submenu";
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useEffect, useState } from 'react';
import './header.css'; // Import the CSS file
import { useParams,Link } from 'react-router-dom';



const ExecutiveHeader = () => {
  const history = useNavigate();
  const {email} = useParams();

  const navigate = useNavigate();
  function handleDeleteProfile (email) {
    Axios.post(`http://localhost:5050/executiveDeleteProfile/${email}`,{
      email:email,
  }).then((response)=>{
      if(response){
          console.log(response);
          navigate("/login");         
      }
  }).catch((err)=>{
      if(err){
          console.log(err);
      }
  });
  }

  return (
    <>
      <Navbar style = {{backgroundColor: '#032154'}} variant="dark" className="d-flex justify-content-between">
        <Container>
          <Navbar.Brand href="/">Executive Dashboard</Navbar.Brand>
          <Nav>
            <NavDropdown title="Profile" id="basic-nav-dropdown" className='rounded dropdown-hover'>
            <NavDropdown.Item as={Link} to={`/Home/${email}/DeleteProfile`}  onClick={() => handleDeleteProfile(email)}>Delete Profile</NavDropdown.Item>
            <NavDropdown.Item as={Link} to={`/Home/${email}/LogOut`}>Log out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>


{/* <div className="d-flex">
  <div className="sidebar bg-dark rounded">
    <Nav className="flex-column" style={{ height: '100vh' }}>
      <NavDropdown title="Create Notice" id="basic-nav-dropdown">
        <NavDropdown.Item href="/Home/EventNotice" style={{ borderRadius: '10px' }}>
          Event notice
        </NavDropdown.Item>
        <NavDropdown.Item href="/Home/TeamlistNotice" style={{ borderRadius: '10px' }}>
          Teamlist notice
        </NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="Forward Notice" id="basic-nav-dropdown">
        <DropdownSubmenu href="#action/3.7" title="Event notice">
          <NavDropdown.Item href="/Home/ForwardEventNotice" style={{ borderRadius: '10px' }}>
            Forward
          </NavDropdown.Item>
          <NavDropdown.Item href="/Home/PostEventNotice" style={{ borderRadius: '10px' }}>
            Post
          </NavDropdown.Item>
        </DropdownSubmenu>
        <DropdownSubmenu href="#action/3.7" title="Team list notice">
          <NavDropdown.Item href="/Home/ForwardTeamlistNotice" style={{ borderRadius: '10px' }}>
            Forward
          </NavDropdown.Item>
        </DropdownSubmenu>
      </NavDropdown>
      <NavDropdown title="Fixturing" id="basic-nav-dropdown">
        <NavDropdown.Item href="/Home/GroupStage" style={{ borderRadius: '10px' }}>
          Group stage
        </NavDropdown.Item>
        <NavDropdown.Item href="/Home/KnockOut" style={{ borderRadius: '10px' }}>
          Knock out
        </NavDropdown.Item>
      </NavDropdown>
      <Nav.Link href="/Home/Verification" style={{ borderRadius: '10px' }}>
        Player verification
      </Nav.Link>
      <Nav.Link href="/Home/ExecutiveNotification" style={{ borderRadius: '10px' }}>
        Notification
      </Nav.Link>
    </Nav>
  </div>
</div> */}

{/* <div className="d-flex" style={{ height: '100vh' }}>
  <div className="sidebar bg-dark rounded d-flex flex-column">
    <Nav className="flex-grow-1 d-grid">
      <NavDropdown title="Create Notice" id="basic-nav-dropdown" className="grid-item text-white"> 
        <NavDropdown.Item href="/Home/EventNotice">Event notice</NavDropdown.Item>
        <NavDropdown.Item href="/Home/TeamlistNotice" >Teamlist notice</NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="Forward Notice" id="basic-nav-dropdown" className="grid-item">
        <DropdownSubmenu href="#action/3.7" title="Event notice">
          <NavDropdown.Item href="/Home/ForwardEventNotice">Forward</NavDropdown.Item>
          <NavDropdown.Item href="/Home/PostEventNotice">Post</NavDropdown.Item>
        </DropdownSubmenu>
        <DropdownSubmenu href="#action/3.7" title="Team list notice">
          <NavDropdown.Item href="/Home/ForwardTeamlistNotice">Forward</NavDropdown.Item>
        </DropdownSubmenu>
      </NavDropdown>
      <NavDropdown title="Fixturing" id="basic-nav-dropdown" className="grid-item text-light">
        <NavDropdown.Item href="/Home/GroupStage">Group stage</NavDropdown.Item>
        <NavDropdown.Item href="/Home/KnockOut">Knock out</NavDropdown.Item>
      </NavDropdown>
      <Nav.Link href="/Home/Verification" className="grid-item text-light">Player verification</Nav.Link>
      <Nav.Link href="/Home/ExecutiveNotification" className="grid-item text-light">Notification</Nav.Link>
    </Nav>
  </div>

  <div className="flex-grow-1 d-flex align-items-flex-start justify-content-center">
          {profileData ? (
            <div className="container mt-4 d-flex justify-content-center">
            <table className="table" style={{maxWidth : '400px', maxHeight:'200px'}}>
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
                  <th>User Type</th>
                  <td>{profileData.designation}</td>
                </tr>
              </tbody>
            </table>
          </div>
          ): (
            <p>Loading...</p>
          )}
          
        </div>

</div> */}

<div className="d-flex body">
  
  <div className="sidebar">
    <Nav className="flex-column dropdown-menu rounded vh-100" style = {{backgroundColor: '#0A4770'}}>
      <NavDropdown title="Create Notice" id="basic-nav-dropdown" className='rounded dropdown-hover ml-auto'>
        {/* <NavDropdown.Item href="/Home/`${email}`/EventNotice">Event notice</NavDropdown.Item> */}

        <NavDropdown.Item as={Link} to={`/Home/${email}/EventNotice`}>Event notice</NavDropdown.Item>

        {/* <NavDropdown.Item href="/Home/:email/TeamlistNotice">Teamlist notice</NavDropdown.Item> */}
        <NavDropdown.Item as={Link} to={`/Home/${email}/TeamlistNotice`}>Teamlist notice</NavDropdown.Item>

      </NavDropdown>
      <NavDropdown title="Forward Notice" id="basic-nav-dropdown" className='rounded dropdown-hover'>
        <DropdownSubmenu href="#action/3.7" title="Event notice">
          {/* <NavDropdown.Item href="/Home/:email/ForwardEventNotice">Forward</NavDropdown.Item>
          <NavDropdown.Item href="/Home/:email/PostEventNotice">Post</NavDropdown.Item> */}
          <NavDropdown.Item as={Link} to={`/Home/${email}/ForwardEventNotice`}>Forward</NavDropdown.Item>
          <NavDropdown.Item as={Link} to={`/Home/${email}/PostEventNotice`}>Post</NavDropdown.Item>

        </DropdownSubmenu>
        <DropdownSubmenu href="#action/3.7" title="Team list notice">
          {/* <NavDropdown.Item href="/Home/:email/ForwardTeamlistNotice">Forward</NavDropdown.Item> */}
          <NavDropdown.Item as={Link} to={`/Home/${email}/ForwardTeamlistNotice`}>Forward</NavDropdown.Item>

        </DropdownSubmenu>
      </NavDropdown>
      <NavDropdown title="Fixturing" id="basic-nav-dropdown" className='rounded dropdown-hover'>
        {/* <NavDropdown.Item href="/Home/:email/GroupStage">Group stage</NavDropdown.Item>
        <NavDropdown.Item href="/Home/:email/KnockOut">Knock out</NavDropdown.Item> */}

        <NavDropdown.Item as={Link} to={`/Home/${email}/GroupStage`}>Group stage</NavDropdown.Item>
        <NavDropdown.Item as={Link} to={`/Home/${email}/KnockOut`}>Knock out</NavDropdown.Item>

      </NavDropdown>
      <Nav.Link as={Link} to={`/Home/${email}/Verification`} className='rounded' style = {{color :'white'}}> Player verification</Nav.Link>
      <Nav.Link as={Link} to={`/Home/${email}/ExecutiveNotification`} className='rounded' style = {{color :'white'}}> Notification</Nav.Link>
      <Nav.Link as={Link} to={`/Home/${email}/UpdateResults`} className='rounded' style = {{color :'white'}}> Update results</Nav.Link>


    </Nav>
  </div>


</div>



    </>
  );
}

export default ExecutiveHeader;
