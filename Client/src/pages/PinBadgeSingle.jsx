import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Image, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { addToCartApi, getAllCategoryApi, getallproductsByIdapi } from '../services/allApi';
import { ServerURL } from '../services/baseUrl';
import Review from './Review';
import '../App.css';
import { cartResponseContext } from '../context/ContextShare';

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
  const [loading, setLoading] = useState(true);
  const {toggleCart , setToggleCart} = useContext(cartResponseContext)

  const [cartItem, setCartItem] = useState({
    productId: '',
    quantity: 1,
    price: ''
  });

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

  const handleAddToCart = async () => {
    const reqBody = new FormData();
    reqBody.append('productId', productDetails._id);
    reqBody.append('quantity', 1);
    reqBody.append('price', productDetails.sale_rate);

    const reqHeader = {
      "Content-Type": "application/json"
    };
    const result = await addToCartApi(reqBody, reqHeader);
    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];

    cartData.push(result?.data?._id);

    localStorage.setItem('cartData', JSON.stringify(cartData));

    // Swal.fire({
    //   title: "Done",
    //   text: "Item added to cart",
    //   icon: "success"
    // });
    setToggleCart(prev => !prev); 
    setAlertMessage('');
    setShowAlert(false);
  };

  const visibleThumbnailCount = 5;
  const visibleThumbnailUrls = thumbnailUrls.slice(
    visibleStartIndex,
    visibleStartIndex + Math.min(visibleThumbnailCount, thumbnailUrls.length)
  );

  const getAllCategory = async () => {
    try {
      const category = await getAllCategoryApi();
      const backendCategoryName = "Pin Badges";
      const categoryData = category?.data?.data?.find(
        (item) => item.name.toLowerCase() === backendCategoryName?.toLowerCase()
      );

      if (categoryData) {
        const product = await getallproductsByIdapi(id);
        setProductDetails(product.data.data);
        setThumbnailUrls(product.data.data?.image);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const calculatePercentageOff = (originalPrice, salePrice) => {
    const discount = originalPrice - salePrice;
    const percentageOff = (discount / originalPrice) * 100;
    return Math.round(percentageOff); // Round to the nearest integer
  };

  return (
    <>
      {loading ? (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '60vh' }}>
          <div className='loader'></div>
        </div>
      ) : (
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
                        className={`img-thumbnail mx-1 ${visibleStartIndex + index === selectedThumbnailIndex ? 'border-primary' : ''
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
              <h4 className="text-danger"><span className='text-dark text-muted fw-bold'>Price :</span>₹{productDetails.sale_rate}</h4>
              <span className='m-1 text-muted text-decoration-line-through'>₹{productDetails.price}</span>
              <span className='text-success fw-bold bg-success-subtle p-1'>{calculatePercentageOff(productDetails.price, productDetails.sale_rate)}% off</span>
              <p className="mt-4">
                Add a touch of personality to your belongings with our premium collection of pin badges! Crafted with care and attention to detail.
              </p>
              <ul>
                <li><strong>High-Quality Materials:</strong> Made from durable metal with a smooth enamel finish, ensuring longevity and a polished look.</li>
                <li><strong>Unique Designs:</strong> A wide variety of designs to suit all tastes, from quirky and fun to elegant and sophisticated.</li>
                <li><strong>Secure Fastening:</strong> Equipped with a reliable pin back to keep your badge securely in place.</li>
                <li><strong>Perfect Size:</strong> Compact and lightweight, easy to wear without being bulky.</li>
                <li><strong>Versatile Use:</strong> Great for personal use or as thoughtful gifts for friends and family.</li>
              </ul>
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
      )}
    </>
  );
};

export default PinBadgeSingle;
