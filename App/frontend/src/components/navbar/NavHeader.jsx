import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavHeader() {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          
          <Navbar.Brand href='/'>Begonia Hybrid Database</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href='/species'>Species</Nav.Link>
                <Nav.Link href='/hybridizations'>Hybridization Events</Nav.Link>
                <Nav.Link href='/hybrids'>Hybrids</Nav.Link>
                <Nav.Link href='/traits'>Traits</Nav.Link>
                <Nav.Link href='/speciesTraits'>Species Traits</Nav.Link>
                <Nav.Link href='/hybridsTraits'>Hybrid Traits</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavHeader;