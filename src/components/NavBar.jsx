import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import logo from '../assets/img/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const NavLinkWithActiveCheck = ({ to, text, type }) => {
    const isActive = location.pathname === to && searchParams.get('type') === type;

    return (
      <Link
        to={`${to}?type=${type}`}
        className={`text-decoration-none me-3 text-dark ${isActive ? 'active' : ''}`}
      >
        <h5 className="">{text}</h5>
      </Link>
    );
  };

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand>
          <Link to={'/'}>
            <img src={logo} alt="logo" className="d-inline-block align-top" />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <NavLinkWithActiveCheck to={'/'} text="Home" type="home" />
            <NavLinkWithActiveCheck to={'/pinbadges'} text="Pin Badges" type="pinbadges" />
            <NavLinkWithActiveCheck to={'/product'} text="Thin Magnets" type="thinmagnets" />
            <NavLinkWithActiveCheck to={'/product'} text="N95 Masks" type="n95masks" />
            <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
              <h5 className="dropdown-toggle">Shop All</h5>
              {showDropdown && (
                <div className="dropdown-menu">
                  <NavLinkWithActiveCheck to={'/product'} text="Fridge Magnets" type="fridgemagnets" />
                  <NavLinkWithActiveCheck to={'/pinbadges'} text="Pin Badges" type="pinbadges" />
                  <NavLinkWithActiveCheck to={'/product'} text="Thin Magnets" type="thinmagnets" />
                  <NavLinkWithActiveCheck to={'/product'} text="Calender 2024" type="calender2024" />
                  <NavLinkWithActiveCheck to={'/product'} text="N95 Masks" type="n95masks" />
                  <NavLinkWithActiveCheck to={'/bulkorder'} text="Bulk Order" type="bulkorder" />
                </div>
              )}
            </div>
          </Nav>
          <Nav className="ms-auto">
            <Link to={'https://www.instagram.com/melonmagnets'} className="text-decoration-none me-4 text-dark">
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
            <Link to={''} className="text-decoration-none me-4 text-dark">
              <FontAwesomeIcon icon={faSearch} />
            </Link>
            <Link to={''} className="text-decoration-none text-dark">
              <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
