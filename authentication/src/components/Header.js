import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
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
                        <Nav.Link href="/Fixture">Fixture</Nav.Link>
                        <Nav.Link href="/Register">Sign up</Nav.Link>
                        <Nav.Link href="/Login">Sign in</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default Header