import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Image, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { addToCartApi, getAllCategoryApi, getallproductsByIdapi } from '../services/allApi';
import { ServerURL } from '../services/baseUrl';
import Review from '../components/Review';
import BackButton from '../components/BackButton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../App.css';
import { cartResponseContext } from '../context/ContextShare';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import RenderImage from './RenderImage';
import video from '../assets/img/video.png';

const PinBadgesSingle = () => {
  const userDetails = useSelector((state) => state.userDetails);
  const { id } = useParams();
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOutOfStock, setIsOutOfStock] = useState(true);
  const { toggleCart, setToggleCart } = useContext(cartResponseContext);
  const [categoryName, setCategoryName] = useState('');

  const visibleThumbnailCount = 5;

  const idMapping = {
    pinbadges: 'pin badges',
    souvenir: 'souvenir',
  };

  const handleThumbnailClick = (index) => {
    setSelectedThumbnailIndex(index);
  };

  const handlePrevThumbnail = () => {
    setSelectedThumbnailIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? thumbnailUrls.length - 1 : prevIndex - 1;
      updateVisibleStartIndex(newIndex);
      return newIndex;
    });
  };

  const handleNextThumbnail = () => {
    setSelectedThumbnailIndex((prevIndex) => {
      const newIndex = prevIndex === thumbnailUrls.length - 1 ? 0 : prevIndex + 1;
      updateVisibleStartIndex(newIndex);
      return newIndex;
    });
  };

  const updateVisibleStartIndex = (newSelectedIndex) => {
    if (newSelectedIndex < visibleStartIndex) {
      setVisibleStartIndex(Math.floor(newSelectedIndex / visibleThumbnailCount) * visibleThumbnailCount);
    } else if (newSelectedIndex >= visibleStartIndex + visibleThumbnailCount) {
      setVisibleStartIndex(Math.floor(newSelectedIndex / visibleThumbnailCount) * visibleThumbnailCount);
    }
  };

  const handleAddToCart = async () => {
    const reqBody = new FormData();
    reqBody.append('productId', productDetails._id);
    // reqBody.append('userId', userDetails._id);
    reqBody.append('quantity', 1);
    reqBody.append('price', productDetails.price);
    reqBody.append('salePrice', productDetails.sale_rate);
    const reqHeader = {
      "Content-Type": "application/json"
    };
    const result = await addToCartApi(reqBody, reqHeader);
    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
    result?.data?._id && cartData.push(result?.data?._id);

    localStorage.setItem('cartData', JSON.stringify(cartData));

    setToggleCart(prev => !prev);
    setAlertMessage('');
    setShowAlert(false);
  };

  const getAllCategory = async () => {
    try {
      const category = await getAllCategoryApi();
      const backendCategoryName = idMapping[id.toLowerCase()] || 'pin badges';
      const categoryData = category?.data?.data?.find(
        (item) => item.name.toLowerCase() === backendCategoryName?.toLowerCase()
      );

      if (categoryData) {
        setCategoryName(categoryData.name);
        const product = await getallproductsByIdapi(id);
        setProductDetails(product.data.data);
        setThumbnailUrls(product.data.data?.image);

        if (product.data.data.stock !== undefined && product.data.data.stock !== null) {
          setIsOutOfStock(product.data.data.stock === 0);
        } else {
          setIsOutOfStock(true);
        }

        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, [id]);

  const calculatePercentageOff = (originalPrice, salePrice) => {
    const discount = originalPrice - salePrice;
    const percentageOff = (discount / originalPrice) * 100;
    return Math.round(percentageOff);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextThumbnail,
    onSwipedRight: handlePrevThumbnail,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });


  // console.log(productDetails.category.name);

  return (
    <>
      {loading ? (
        <Container className="mt-4 mb-5">
          <Row>
            <Col md={6}>
              <Skeleton height={400} />
              <div className="d-flex justify-content-between align-items-center mt-4">
                <Skeleton circle={true} height={60} width={60} />
                <Skeleton circle={true} height={60} width={60} />
                <Skeleton circle={true} height={60} width={60} />
                <Skeleton circle={true} height={60} width={60} />
                <Skeleton circle={true} height={60} width={60} />
              </div>
            </Col>
            <Col md={6}>
              <Skeleton height={40} width={`60%`} />
              <Skeleton height={30} width={`30%`} className="mt-2" />
              <Skeleton height={20} width={`20%`} className="mt-2" />
              <Skeleton count={5} className="mt-3" />
              <Skeleton height={50} width={`100%`} className="mt-4" />
            </Col>
          </Row>
          <Row>
            <Skeleton height={200} width={`100%`} className="mt-4" />
          </Row>
        </Container>
      ) : (
        <Container className="mt-4 mb-5">
          <BackButton />
          {showAlert && <Alert variant="danger">{alertMessage}</Alert>}
          <Row>
            <Col md={6}>
              <div className="mb-4 position-relative" {...swipeHandlers}>
                <RenderImage image={thumbnailUrls?.[selectedThumbnailIndex]} />
                {isOutOfStock && (
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <h3 className="text-white">Out of Stock</h3>
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  variant="outline-secondary"
                  onClick={handlePrevThumbnail}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </Button>
                <div className="d-flex overflow-hidden">
                  {thumbnailUrls.slice(visibleStartIndex, visibleStartIndex + visibleThumbnailCount).map((url, index) => {
                    const extension = url.split('.').pop().toLowerCase();
                    return (
                      <Image
                        key={index + visibleStartIndex}
                        src={extension === 'mp4' || extension === 'avi' || extension === 'mov' ? video : `${ServerURL}/uploads/${url}`}
                        alt={`Thumbnail ${index + visibleStartIndex + 1}`}
                        className={`img-thumbnail mx-1 ${index + visibleStartIndex === selectedThumbnailIndex ? 'border-primary' : ''}`}
                        onClick={() => handleThumbnailClick(index + visibleStartIndex)}
                        style={{ width: '60px', height: '60px', cursor: 'pointer' }}
                      />
                    )
                  })}
                </div>
                <Button
                  variant="outline-secondary"
                  onClick={handleNextThumbnail}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </Button>
              </div>
            </Col>
            <Col md={6}>
              <h2 className="fw-bold mt-3">{productDetails?.name}</h2>
              <h4 className="text-danger"><span className='text-dark text-muted fw-bold'>Price :</span>₹{productDetails.sale_rate}</h4>
              <span className='m-1 text-muted text-decoration-line-through'>₹{productDetails.price}</span>
              <span className='text-success fw-bold bg-success-subtle p-1'>{calculatePercentageOff(productDetails.price, productDetails.sale_rate)}% off</span>
              <p className="mt-4">
                {productDetails.category.name.toLowerCase() === 'pin badges' 
                  ? "Add a touch of personality to your belongings with our premium collection of pin badges! Crafted with care and attention to detail."
                  : "Bring home a piece of your favorite destination with our exclusive souvenir collection! Each item is carefully selected to capture the essence of your travels."}
              </p>
              <ul>
                {productDetails.category.name.toLowerCase() === 'pin badges' ? (
                  <>
                    <li><strong>High-Quality Materials:</strong> Made from durable metal with a smooth enamel finish, ensuring longevity and a polished look.</li>
                    <li><strong>Unique Designs:</strong> A wide variety of designs to suit all tastes, from quirky and fun to elegant and sophisticated.</li>
                    <li><strong>Secure Fastening:</strong> Equipped with a reliable pin back to keep your badge securely in place.</li>
                    <li><strong>Perfect Size:</strong> Compact and lightweight, easy to wear without being bulky.</li>
                    <li><strong>Versatile Use:</strong> Great for personal use or as thoughtful gifts for friends and family.</li>
                  </>
                ) : (
                  <>
                    <li><strong>Authentic Memorabilia:</strong> Genuine souvenirs from various destinations around the world.</li>
                    <li><strong>High-Quality Craftsmanship:</strong> Each item is carefully made to ensure durability and longevity.</li>
                    <li><strong>Diverse Selection:</strong> From miniature landmarks to local handicrafts, our collection caters to all preferences.</li>
                    <li><strong>Perfect Keepsakes:</strong> Ideal for preserving travel memories or gifting to loved ones.</li>
                    <li><strong>Cultural Significance:</strong> Many items reflect the unique cultural heritage of their origin.</li>
                  </>
                )}
              </ul>
              {isOutOfStock ? (
                <Button
                  variant="secondary"
                  className="w-100 rounded-pill"
                  disabled
                >
                  Out of Stock
                </Button>
              ) : 
              // userDetails ? (
                <Button
                  variant="warning"
                  className="w-100 rounded-pill mt-4"
                  onClick={handleAddToCart}
                >
                  Add To Cart
                </Button>
              // ) : (
              //   <Link to={'/login'}>
              //     <Button 
              //       variant="warning"
              //       className="w-100 rounded-pill"
              //     >
              //       Add To Cart
              //     </Button>
              //   </Link>
              // )
              }
            </Col>
          </Row>
          <Row>
            <Review productId={productDetails._id} />
          </Row>
        </Container>
      )}
    </>
  );
};

export default PinBadgesSingle;
