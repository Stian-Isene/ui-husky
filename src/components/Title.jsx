import React from 'react'
import { Container, Navbar } from 'react-bootstrap'
/*
Navigation bar that display connaction status and input menue
*/
function Title() {
  return (
    <Navbar bg="light" expand="lg" >
      <Container style={{ display:`flex`, alignItems:`center`, justifyContent:`center` }}>
        <Navbar.Brand href="/" style={{ fontSize:`26px`, fontWeight:`600` }}>Husky - dashboard</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Title;
