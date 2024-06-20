// src/Footer.js
import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer mt-5 ">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Menu</h5>
            <ul className="list-unstyled">
              <li><Link to={'/aboutus'}>About us</Link></li>
              <li><Link to={'/privacypolicy'}>Privacy Policy</Link></li>
              <li><Link to={'/cancellation'}>Cancellation & Refunds</Link></li>
              <li><Link to={'/returnpolicy'}>Return Policy</Link></li>
              <li><Link to={'/storepolicy'}>Store Policies</Link></li>
              <li><Link to={'/termsofservice'}>Terms of Service</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Quick links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to={'/fridgemagnets'} >Fridge Magnets</Link>
              </li>
              <li>
                <Link to={'/pinbagesmain'} >PinBadges</Link>
             </li>
              <li> 
                <Link to={'/thinmagnets'} >Thin Magnets</Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Let's connect!</h5>
            <p>Follow us on Instagram <br /><Link className='text-decoration-none text-dark' to={'https://www.instagram.com/melonmagnets'}>@melonmagnets</Link> </p>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <p className="text-center">&copy; 2024 MelonMagnets. Designed by <Link className='text-decoration-none text-dark ' to={'https://www.acmeflare.in/'}>Acmeflare</Link>.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
