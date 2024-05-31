import React, { useState } from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import Review from './Review';
import Topnav from '../components/Topnav';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Product = () => {
  const [saveTheDateSize, setSaveTheDateSize] = useState('2.75 x 3.5 in');
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const thumbnailUrls = [
    'https://m.media-amazon.com/images/I/71CDEH-B1LL.jpg',
    'https://m.media-amazon.com/images/I/61NZJpYe0nL._AC_UF894,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/71-+WakO6tL._AC_UF894,1000_QL80_.jpg',
    // Add more thumbnail URLs here
  ];

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const uploadedFiles = Array.from(files).map((file) => URL.createObjectURL(file));
    setUploadedPhotos((prevPhotos) => [...prevPhotos, ...uploadedFiles]);
  };

  const handleThumbnailClick = (index) => {
    setSelectedThumbnailIndex(index);
  };

  const handlePrevThumbnail = () => {
    setVisibleStartIndex((prevIndex) =>
      prevIndex === 0 ? thumbnailUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextThumbnail = () => {
    setVisibleStartIndex((prevIndex) =>
      prevIndex === thumbnailUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const visibleThumbnailCount = 5;
  const visibleThumbnailUrls = thumbnailUrls.slice(
    visibleStartIndex,
    visibleStartIndex + Math.min(visibleThumbnailCount, thumbnailUrls.length)
  );


  return (
    <>
      <Topnav/>
      <NavBar/>
      <Container className="mt-4 mb-5">
        <Row>
        <Col md={6}>
            <div className="mb-4">
              <Image
                src={thumbnailUrls[selectedThumbnailIndex]}
                fluid
                style={{ width: '100%' }}
                className="rounded shadow"
              />
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Button
                variant="outline-secondary"
                onClick={handlePrevThumbnail}
                disabled={visibleStartIndex === 0 && visibleThumbnailUrls.length === thumbnailUrls.length}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </Button>
              <div className="d-flex overflow-hidden">
                <div className="d-flex flex-nowrap">
                  {visibleThumbnailUrls.map((url, index) => (
                    <Image
                      key={visibleStartIndex + index}
                      src={url}
                      alt={`Thumbnail ${visibleStartIndex + index + 1}`}
                      className={`img-thumbnail mx-1 ${
                        visibleStartIndex + index === selectedThumbnailIndex
                          ? 'border-primary'
                          : ''
                      }`}
                      onClick={() => handleThumbnailClick(visibleStartIndex + index)}
                      style={{ width: '60px', height: '60px', cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>
              <Button
                variant="outline-secondary"
                onClick={handleNextThumbnail}
                disabled={
                  visibleStartIndex === thumbnailUrls.length - visibleThumbnailUrls.length
                }
              >
                <i className="fa-solid fa-arrow-right"></i>
              </Button>
            </div>
          </Col>
          <Col md={6}>
            <h2 className="fw-bold">FRIDGE MAGNETS</h2>
            <h4 className="text-danger">₹350</h4>
            <h5>Select Size:</h5>
            <div className="d-flex mb-3">
              {['9 Images', '12 Images', '15 Images'].map((size) => (
                <Button
                  key={size}
                  variant={saveTheDateSize === size ? 'dark' : 'light'}
                  className="mx-1"
                  onClick={() => setSaveTheDateSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
            <h5>Upload Photos:</h5>
            <Row className="mb-3">
              {uploadedPhotos.length > 0
                ? uploadedPhotos.map((photo, idx) => (
                    <Col xs={4} className="mb-2" key={idx}>
                      <div className="border p-1">
                        <Image src={photo} fluid style={{ width: '100%', height: 'auto' }} />
                      </div>
                    </Col>
                  ))
                : [...Array(12)].map((_, idx) => (
                    <Col xs={3} className="mb-2" key={idx}>
                      <div className="border p-1">
                        <Image src="https://via.placeholder.com/50" style={{ width: '100%' }} fluid />
                      </div>
                    </Col>
                  ))}
            </Row>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              accept="image/*"
              className="d-none"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="btn btn-outline-warning w-100 mb-2 text-dark rounded-pill">
              Upload Photos
            </label>
            <Button variant="warning" className="w-100 rounded-pill">
              Add To Cart
            </Button>
          </Col>
        </Row>
        <Row>
          <Review/>
        </Row>
      </Container>
      <Footer/>
    </>
  );
};

export default Product;
