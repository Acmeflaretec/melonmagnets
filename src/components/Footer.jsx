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
              <li><a href="#about">About us</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#refund">Cancellation & Refunds</a></li>
              <li><a href="#terms">Return Policy</a></li>
              <li><a href="#terms">Store Policies</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Quick links</h5>
            <ul className="list-unstyled">
              <li><a href="#styles">Fridge Magnets</a></li>
              <li><a href="#reviews">Pin Badges</a></li>
              <li><a href="#pet">Thin Magnets</a></li>
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
