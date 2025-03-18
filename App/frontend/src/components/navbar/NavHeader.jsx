import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavHeader() {
  return (
    <Container fluid>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand className='nav-text' href='/'>Begonia Hybrid Database</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto justify-content-center">
                <Nav.Link className='nav-text' href='/species'>Species</Nav.Link>
                <Nav.Link className='nav-text' href='/hybridizations'>Hybridization Events</Nav.Link>
                <Nav.Link className='nav-text' href='/hybrids'>Hybrids</Nav.Link>
                <Nav.Link className='nav-text' href='/traits'>Traits</Nav.Link>
                <Nav.Link className='nav-text' href='/speciesTraits'>Species Traits</Nav.Link>
                <Nav.Link className='nav-text' href='/hybridsTraits'>Hybrid Traits</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Container>
  );
}

export default NavHeader;