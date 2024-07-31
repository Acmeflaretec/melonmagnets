import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './skeleton.css'; 

const ProductSkeleton = () => {
  return (
    <Container className="mt-4 mb-5">
      <Row>
        <Col md={6}>
          <div className="skeleton-image mb-4" style={{ height: '400px' }}></div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="skeleton-button" style={{ width: '40px', height: '40px' }}></div>
            <div className="d-flex">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="skeleton-thumbnail mx-1" style={{ width: '60px', height: '60px' }}></div>
              ))}
            </div>
            <div className="skeleton-button" style={{ width: '40px', height: '40px' }}></div>
          </div>
        </Col>
        <Col md={6}>
          <div className="skeleton-text mb-3" style={{ height: '30px', width: '70%' }}></div>
          <div className="skeleton-text mb-2" style={{ height: '24px', width: '40%' }}></div>
          <div className="skeleton-text mb-4" style={{ height: '20px', width: '30%' }}></div>
          <div className="skeleton-text mb-3" style={{ height: '24px', width: '50%' }}></div>
          <div className="d-flex mb-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="skeleton-button mx-1" style={{ width: '100px', height: '40px' }}></div>
            ))}
          </div>
          <div className="skeleton-text mb-3" style={{ height: '24px', width: '50%' }}></div>
          <Row className="mb-3">
            {[...Array(4)].map((_, index) => (
              <Col xs={4} sm={3} md={4} lg={3} className="mb-2" key={index}>
                <div className="skeleton-image" style={{ width: '90px', height: '90px' }}></div>
              </Col>
            ))}
          </Row>
          <div className="skeleton-button mb-2" style={{ height: '40px' }}></div>
          <div className="skeleton-button" style={{ height: '40px' }}></div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductSkeleton;