import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import ConnectionStatus from './ConnectionStatus';
import RobotState from './RobotState'
import SendData from './SendData';
import StartRobot from './StartRobot';
import ResetData from './ResetData';
import TypeOfNav from './TypeOfNav';
import { useLocation } from 'react-router-dom';
import LoadPath from './LoadPath';

/*
Navigation bar that display connaction status and input menue
*/
function Header() {
  const { pathname } = useLocation();
  return (
    <Navbar bg="light" expand="lg" >
      <Container>
        <ConnectionStatus />
        <RobotState />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* This is a conditional hides buttons when not in showing root('/'). 
          If MapComp is moved from root this condition most change to reflect that or the buttons will not appear */}
          {pathname === '/' ?
            <Nav className="ms-auto">
              <Nav.Link href="/" style={{color:`black`}}>Map</Nav.Link>
              <Nav.Link href="/remote-control">Remote Control</Nav.Link>
              <Nav.Link href="http://192.168.131.1:8080">File Browser</Nav.Link>
              
                <LoadPath />
                <TypeOfNav />
                <SendData />
                <StartRobot />
                <ResetData />
              
            </Nav>
            :
            <Nav className="ms-auto">
              <Nav.Link href="/">Map</Nav.Link>
              <Nav.Link href="/remote-control" style={{color:`black`}}>Remote Control</Nav.Link>
              <Nav.Link href="http://192.168.131.1:8080">File Browser</Nav.Link>
            </Nav>
          }
          
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default Header;
