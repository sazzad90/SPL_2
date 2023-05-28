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
const Header = () => {
    const {eventType} = useNavigate()
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home"><strong>DU</strong> sports management system</Navbar.Brand>
                    {/* <Nav className="me-auto">
                        <Nav.Link  href="/Register">Sign up</Nav.Link>
                    </Nav>
                    <Nav className="me-auto">
                        <Nav.Link href="/Login">Sign in</Nav.Link>
                    </Nav> */}
                    <Nav className="ml-auto"> {/* Add 'ml-auto' class to align links to the right */}
                        {/* <Nav.Link href="/Fixture">Fixture</Nav.Link> */}
                        <NavDropdown title="Fixture" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to={'/Fixture'}>Football</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={'/CricketFixture'}>Cricket</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={'/BasketballFixture'}>Basketball</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={'/VolleyballFixture'}>Volleyball</NavDropdown.Item>

                            </NavDropdown>
                        <Nav.Link href="/Register">Sign up</Nav.Link>
                        <Nav.Link href="/Login">Sign in</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default Header