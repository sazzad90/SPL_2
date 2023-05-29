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
import { useParams, Link } from 'react-router-dom';



const ExecutiveHeader = () => {
  const history = useNavigate();
  const { email } = useParams();

  const navigate = useNavigate();
  function handleDeleteProfile(email) {
    Axios.post(`http://localhost:5050/executiveDeleteProfile/${email}`, {
      email: email,
    }).then((response) => {
      if (response) {
        console.log(response);
        navigate("/login");
      }
    }).catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  return (
    <>
      <Navbar style={{ backgroundColor: '#032154' }} variant="dark" className="d-flex justify-content-between">
        <Container>
          <Navbar.Brand href="/">Executive Dashboard</Navbar.Brand>
          <Nav>
            <NavDropdown title="Profile" id="basic-nav-dropdown" className='rounded dropdown-hover'>
              <NavDropdown.Item as={Link} to={`/Home/${email}/DeleteProfile`} onClick={() => handleDeleteProfile(email)}>Delete Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to={`/Home/${email}/LogOut`}>Log out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

      <div className="d-flex body">

        <div className="sidebar">
          <Nav className="flex-column dropdown-menu rounded" style={{ backgroundColor: '#0A4770', height: '100%' }}>
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
                {/* <NavDropdown.Item as={Link} to={`/Home/${email}/PostEventNotice`}>Post</NavDropdown.Item> */}

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
            <Nav.Link as={Link} to={`/Home/${email}/Verification`} className='rounded' style={{ color: 'white' }}> Player verification</Nav.Link>
            <Nav.Link as={Link} to={`/Home/${email}/ExecutiveNotification`} className='rounded' style={{ color: 'white' }}> Notification</Nav.Link>
            <Nav.Link as={Link} to={`/Home/${email}/UpdateResults`} className='rounded' style={{ color: 'white' }}> Update results</Nav.Link>


          </Nav>
        </div>


      </div>



    </>
  );
}

export default ExecutiveHeader;
