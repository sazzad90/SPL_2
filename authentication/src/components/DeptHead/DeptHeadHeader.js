import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import "react-bootstrap-submenu/dist/index.css"
import { DropdownSubmenu, NavDropdownMenu} from "react-bootstrap-submenu";
import { useParams,Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';


const DeptHeadHeader =()=> {
  const {email} = useParams();
  const navigate = useNavigate();
  function handleDeleteProfile (email) {
    Axios.post(`http://localhost:5050/deptHeadDeleteProfile/${email}`,{
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
          <Navbar.Brand href="/">Dept. Head Dashboard</Navbar.Brand>
          <Nav>
          <Nav.Link as={Link} to={`/DeptHeadHome/${email}/DeptHeadNotification`}> Notification</Nav.Link>

            <NavDropdown title="Profile" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to={`/DeptHeadHome/${email}/DeleteProfile`} onClick={() => handleDeleteProfile(email)}>Delete Profile</NavDropdown.Item>
            <NavDropdown.Item as={Link} to={`/DeptHeadHome/${email}/LogOut`}>Log out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

  </>

  )
}

export default DeptHeadHeader