// src/Footer.js
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

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
                <Link to={'/savethedate'} >Save The Date</Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Let's connect!</h5>
            <p>
            Stay in touch with us for exclusive offers, new arrivals, and more!
            </p>
            {/* <p>Follow us on Instagram <br /><Link className='text-decoration-none text-dark' to={''}>@melonmagnets</Link> </p> */}
            <div className="social-media-icons mt-2">
            <ul className="list-unstyled d-flex">
      <li className="me-3">
        <a href="/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook fa-xl"></i>
        </a>
      </li>
      <li className="me-3">
        <a href="https://www.instagram.com/melonmagnets" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram fa-xl"></i>
        </a>
      </li>
      <li>
        <a href="https://www.linkedin.com/company/melonmagnets" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin fa-xl"></i>
        </a>
      </li>
    </ul>
            </div>
          </Col>
        </Row>
        <Row className="mt-5">
         
          <Col>
          <div> 
            <img src="visa.png" alt=""  width={50}/>
            <img src="money.png" alt=""  width={50}/>
            <img src="google-pay.png" alt=""  width={50}/>
            <img src="icons8-paytm-120.png" className='ms-2' alt=""  width={50}/>
            <img src="icons8-bhim-upi-100.png" alt="" className='ms-2' width={40}/>
          </div>
          </Col>

        </Row>
        <Row className="mt-5">
         
          <Col>
            <p className="text-center">&copy; 2024 MelonMagnets. Designed by <Link className='text-decoration-none fw-bold text-dark' to={'https://www.acmeflare.in/'}>Acmeflare</Link>.</p>
          </Col>

        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
