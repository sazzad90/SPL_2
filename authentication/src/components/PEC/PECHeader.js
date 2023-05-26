import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import "react-bootstrap-submenu/dist/index.css"
import { DropdownSubmenu, NavDropdownMenu} from "react-bootstrap-submenu";
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams,Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const PECHeader =()=> {
  const {email} = useParams();

  const navigate = useNavigate();
  function handleDeleteProfile (email) {
    Axios.post(`http://localhost:5050/pecDeleteProfile/${email}`,{
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
          <Navbar.Brand href="/">PEC Dashboard</Navbar.Brand>
          <Nav>
          <Nav.Link as={Link} to={`/PECHome/${email}/PECNotification`}> Notification</Nav.Link>

            <NavDropdown title="Profile" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to={`/PECHome/${email}/DeleteProfile`} onClick={() => handleDeleteProfile(email)}>Delete Profile</NavDropdown.Item>
            <NavDropdown.Item as={Link} to={`/PECHome/${email}/LogOut`}>Log out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

             </>
  )
}

export default PECHeader