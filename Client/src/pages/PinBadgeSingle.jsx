import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Image, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import uploadimg from '../assets/img/upload.png';
import { getAllCategoryApi, getallproductsByIdapi } from '../services/allApi';
import { ServerURL } from '../services/baseUrl';
import Review from './Review';
import Swal from 'sweetalert2';

const PinBadgeSingle = () => {
  const { id } = useParams();
  const [saveTheDateSize, setSaveTheDateSize] = useState('4 Images');
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [image, setImage] = useState([]);
  const [selectedImageFilenames, setSelectedImageFilenames] = useState([]);



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



  const handleAddToCart = () => {
    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
    const existingItemIndex = cartData.findIndex(item => item.productDetails.name === productDetails.name);

    if (existingItemIndex !== -1) {
      // Item already exists, update the quantity and total price
      cartData[existingItemIndex].quantity += 1;
      cartData[existingItemIndex].totalPrice = cartData[existingItemIndex].quantity * cartData[existingItemIndex].productDetails.price;
    } else {
      // Add the new cart item to the existing cart data
      const newCartItem = {
        selectedImageFilenames: selectedImageFilenames,
        productDetails: productDetails,
        quantity: 1,
        totalPrice: productDetails.price
      };
      cartData.push(newCartItem);
    }

    localStorage.setItem('cartData', JSON.stringify(cartData));
    Swal.fire({
        title: "Done",
        text: "Item added to cart",
        icon: "success"
      });
  };

  const visibleThumbnailCount = 5;
  const visibleThumbnailUrls = thumbnailUrls.slice(
    visibleStartIndex,
    visibleStartIndex + Math.min(visibleThumbnailCount, thumbnailUrls.length)
  );


  const getAllCategory = async () => {
    try {
      const category = await getAllCategoryApi();
      const backendCategoryName = "Pin Badges"
      const categoryData = category?.data?.data?.find(
        (item) => item.name.toLowerCase() === backendCategoryName?.toLowerCase()
      );

      if (categoryData) {
          const product = await getallproductsByIdapi(id)
          setProductDetails(product.data.data)
          setThumbnailUrls(product.data.data?.image)
          console.log(product.data.data);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <>
      <Container className="mt-4 mb-5">
        {showAlert && <Alert variant="danger">{alertMessage}</Alert>}
        <Row>
          <Col md={6}>
            <div className="mb-4">
              <Image
                src={`${ServerURL}/uploads/${thumbnailUrls[selectedThumbnailIndex]}`}
                fluid
                style={{ width: '100%' }}
                className="rounded shadow"
              />
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Button
                variant="outline-secondary"
                onClick={handleNextThumbnail}
                disabled={
                  visibleStartIndex === thumbnailUrls.length - visibleThumbnailUrls.length
                }
              >
                <i className="fa-solid fa-arrow-left"></i>
              </Button>
              <div className="d-flex overflow-hidden">
                <div className="d-flex flex-nowrap">
                  {visibleThumbnailUrls.map((url, index) => (
                    <Image
                      key={visibleStartIndex + index}
                      src={`${ServerURL}/uploads/${url}`}
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
                onClick={handlePrevThumbnail}
                disabled={visibleStartIndex === 0 && visibleThumbnailUrls.length === thumbnailUrls.length}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </Button>
            </div>
          </Col>
          <Col md={6}>
            <h2 className="fw-bold">{productDetails.name}</h2>
            <h4 className="text-danger"><span className='text-dark text-muted fw-bold'>Price :</span>₹{productDetails.price}</h4>
            <span className='m-1 text-muted text-decoration-line-through'>₹999</span>
            <span className='text-success fw-bold bg-success-subtle p-1'>70% off</span>
            {/* <p className='fw-bold mt-3 mb-3'>quantity:</p> */}
            <Button
              variant="warning"
              className="w-100 rounded-pill mt-4"
              onClick={handleAddToCart}
            >
              Add To Cart
            </Button>
          </Col>
        </Row>
        <Row>
          <Review />
        </Row>
      </Container>
    </>
  );
};

export default PinBadgeSingle;
