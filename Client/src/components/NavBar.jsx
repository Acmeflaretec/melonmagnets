import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import './NavBar.css';
import Cart from '../pages/Cart';

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const location = useLocation();
  const activePath = location.pathname;

  const handleDropdownEnter = () => {
    setShowDropdown(true);
  };

  const handleDropdownLeave = () => {
    setShowDropdown(false);
  };

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const handleCartClick = () => {
    handleCloseOffcanvas()
    setShowCart(!showCart);
  }

  const getLinkClass = (path) => {
    return activePath === path || (activePath === '/' && path === '/fridgemagnets') ? 'nav-link active-link' : 'nav-link';
  };

  return (
    <>
      {/* Large Screen Navbar */}
      <Navbar expand="lg" className='p-0 m-0 d-none d-lg-flex mt-3 shadow-sm'>
        <Container>
          <Navbar.Brand>
            <Link to={'/'}>
              <img src={logo} alt="logo" className="d-inline-block align-top" style={{ mixBlendMode: 'multiply' }} />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Link to={'/fridgemagnets'} className={getLinkClass('/fridgemagnets')}>Fridge Magnets</Link>
              <Link to={'/pinbagesmain'} className={getLinkClass('/pinbagesmain')}>Pin Badges</Link>
              <Link to={'/thinmagnets'} className={getLinkClass('/thinmagnets')}>Thin Magnets</Link>
              <div 
                className="dropdown" 
                onMouseEnter={handleDropdownEnter} 
                onMouseLeave={handleDropdownLeave}
              >
                <h5 className="dropdown-toggle nav-link shopall" style={{ marginRight: '10px' }}>Shop All</h5>
                {showDropdown && (
                  <div className="dropdown-menu show">
                    <Link to={'/fridgemagnets'} className="dropdown-item">Fridge Magnets</Link>
                    <Link to={'/pinbagesmain'} className="dropdown-item">Pin Badges</Link>
                    <Link to={'/thinmagnets'} className="dropdown-item">Thin Magnets</Link>
                    {/* <Link to={'/bulkorder'} className="dropdown-item">Bulk order</Link> */}
                  </div>
                )}
              </div>
            </Nav>
            <Nav className="ms-auto">
              <Link to={'https://www.instagram.com/melonmagnets'} className="nav-link text-decoration-none me-2 text-dark">
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
             
              <button className="nav-link text-decoration-none text-dark" onClick={handleCartClick}>
                <FontAwesomeIcon icon={faShoppingCart}  />
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas show={showCart} onHide={handleCartClick} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>CART</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body onClick={handleCloseOffcanvas}>
          <Cart/>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Offcanvas Navbar for Small Screens */}
      <Navbar expand="lg" className="bg-light p-0 m-0 d-lg-none">
        <Container>
          <Navbar.Brand>
            <Link to={'/'}>
              <img src={logo} alt="logo" className="d-inline-block align-top" style={{ mixBlendMode: 'multiply' }} />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-offcanvas" onClick={handleShowOffcanvas} />
          <Navbar.Offcanvas
            id="navbar-offcanvas"
            aria-labelledby="navbar-offcanvas-label"
            placement="start"
            show={showOffcanvas}
            onHide={handleCloseOffcanvas}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="navbar-offcanvas-label">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="offcanvas-nav">
              <Nav className="flex-column">
                <Link to={'/fridgemagnets'} className={getLinkClass('/fridgemagnets')} onClick={handleCloseOffcanvas}>Fridge Magnets</Link>
                <Link to={'/pinbagesmain'} className={getLinkClass('/pinbagesmain')} onClick={handleCloseOffcanvas}>Pin Badges</Link>
                <Link to={'/thinmagnets'} className={getLinkClass('/thinmagnets')} onClick={handleCloseOffcanvas}>Thin Magnets</Link>
                {/* <Link to={'/bulkorder'} className={getLinkClass('/bulkorder')} onClick={handleCloseOffcanvas}>Bulk order</Link> */}
              </Nav>
              <div className="offcanvas-footer">
                <div className="social-icons">
                  <Link to={'https://www.instagram.com/melonmagnets'} className="nav-link text-dark" onClick={handleCloseOffcanvas}>
                    <FontAwesomeIcon icon={faInstagram} />
                  </Link>
                 
                  <button className="nav-link text-decoration-none text-dark" onClick={handleCartClick} >
                    <FontAwesomeIcon icon={faShoppingCart}  />
                  </button>
                </div>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
