import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { AuthContext } from '../AuthContext';

const NavBar = () => {
  const { currentUser, logout } = useContext(AuthContext);
    
  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Rekt-Knekt</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {!currentUser ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to={`/profile/${currentUser.uid}`}>Profile</Nav.Link>
                <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
                <Button variant="link" onClick={logout}>Logout</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};



export default NavBar;