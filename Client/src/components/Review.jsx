



// import React, { useState, useEffect } from 'react';
// import { Button, Card, Col, Form, Modal, ProgressBar, Row } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Review.css';
// import { useSelector } from 'react-redux';
// import axiosInstance from '../axios'
// import { ServerURL } from '../services/baseUrl';



// function Review({ productId }) {
//   const userDetails = useSelector((state) => state.userDetails);
//   console.log('userDetails', userDetails);
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [newReview, setNewReview] = useState({
//     name: '',
//     rating: 0,
//     review: '',
//     images: null,
//   });
//   const [showAllReviews, setShowAllReviews] = useState(false);
//   const [reviews, setReviews] = useState([]);
//   const [canWriteReview, setCanWriteReview] = useState(false);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await axiosInstance.get(`/api/v1/reviews/${productId}`);
//         setReviews(response.data.data);
//       } catch (error) {
//         console.error('Error fetching reviews:', error);
//       }
//     };

//     const checkCanWriteReview = async () => {
//       try {
//         const response = await axiosInstance.get(`/api/v1/cart/user/${userDetails._id}/product/${productId}`);
//         setCanWriteReview(response.data.canWriteReview);
//       } catch (error) {
//         console.error('Error checking if user can write review:', error);
//       }
//     };

//     fetchReviews();
//     if (userDetails) {
//       checkCanWriteReview();
//     }
//   }, [productId, userDetails]);
//   console.log('canWriteReview', canWriteReview);

//   const handleOpenReviewModal = () => setShowReviewModal(true);
//   const handleCloseReviewModal = () => setShowReviewModal(false);

//   const handleReviewChange = (e) => {
//     // setNewReview({ ...newReview, [e.target.name]: e.target.value });
//     const { name, value, files } = e.target;
//     if (name === 'image') {
//       setNewReview({ ...newReview, images: files[0] });
//     } else {
//       setNewReview({ ...newReview, [name]: value });
//     }   
//   };

//   const handleSubmitReview = async () => {
//     const formData = new FormData();
//     formData.append('productId', productId);
//     formData.append('userId', userDetails._id);
//     formData.append('name', newReview.name);
//     formData.append('rating', newReview.rating);
//     formData.append('review', newReview.review);
//     if (newReview.images) {
//       formData.append('images', newReview.images);
//     }


//     try {
//       // const response = await axiosInstance.post(`/api/v1/reviews`, {
//       //   productId,
//       //   userId:userDetails._id,
//       //   ...newReview,
//       // }, {
//       //   headers: {
//       //     Authorization: `Bearer ${userDetails.token}`,
//       //   },
//       // });

//       const response = await axiosInstance.post('/api/v1/reviews', formData, {
//         headers: {
//           Authorization: `Bearer ${userDetails.token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setReviews([...reviews, response.data.data]);
//       setNewReview({ name: '', rating: 0, review: '', images: null, });
//       handleCloseReviewModal();
//     } catch (error) {
//       console.error('Error submitting review:', error);
//     }
//   };

//   const handleReadMore = () => {
//     setShowAllReviews(true);
//   };

//   const totalReviews = reviews.length;
//   const ratingCounts = [0, 0, 0, 0, 0];
//   reviews.forEach((review) => {
//     ratingCounts[review.rating - 1]++;
//   });

//   const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//   const averageRating = (totalRating / totalReviews).toFixed(1);

//   const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

//   return (
//     <div className="review-section mt-5">
//       <h1 className="text-center mb-4 fw-bold">Customer Reviews</h1>
//       <Row className="mb-4">
//         <Col md={4}>
//           <Card className="rating-summary-card">
//             <Card.Body>
//               <Card.Title className="fw-bold mb-3">Ratings & Reviews</Card.Title>
//               <Row>
//                 <Col lg={4} className="text-center">
//                   <div className="rating-summary">
//                     {/* <h1>{averageRating}</h1> */}
//                     <h1>{totalReviews > 0 ? averageRating : '0'}</h1>

//                     <div>
//                       {[...Array(5)].map((_, index) => (
//                         <i
//                           key={index}
//                           className={`fas fa-star ${index < Math.floor(averageRating) ? 'text-success' : 'text-muted'}`}
//                         />
//                       ))}
//                     </div>
//                     <small>{totalReviews} ratings</small>
//                   </div>
//                 </Col>
//                 <Col lg={8}>
//                   <div className="rating-bars">
//                     {[5, 4, 3, 2, 1].map((rating) => (
//                       <div key={rating} className="d-flex align-items-center mb-2">
//                         <span className="text-muted me-2 d-flex">
//                           <span className="fw-bold">{rating}</span> <i className="fas fa-star" />
//                         </span>
//                         <div className="progress-container flex-grow-1 mx-2">
//                           <ProgressBar
//                             now={(ratingCounts[rating - 1] / totalReviews) * 100}
//                             variant="success"
//                             className="progress-bar-custom"
//                           />
//                         </div>
//                         {/* <span>{((ratingCounts[rating - 1] / totalReviews) * 100).toFixed(0)}%</span> */}
//                         <span>
//                           {totalReviews > 0 ? `${((ratingCounts[rating - 1] / totalReviews) * 100).toFixed(0)}%` : '0%'}
//                         </span>

//                       </div>
//                     ))}
//                   </div>
//                 </Col>
//               </Row>
//               <Row className="mt-3">
//                 <Col>
//                   <div>
//                     <h5 className="fw-bold">Review this product</h5>
//                     <p className="text-muted">Help others make an informed decision</p>
//                   </div>
//                   <Button
//                     variant="outline-success"
//                     className="rounded-pill w-100 p-2 mt-2"
//                     onClick={handleOpenReviewModal}
//                     disabled={!canWriteReview}
//                   >
//                     Write a Review
//                   </Button>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={8}>
//           <Card>
//             <Card.Body>
//               <Card.Title>Reviews from customers</Card.Title>
//               {displayedReviews.map((review) => (
//                 <div key={review.id} className="mb-4">
//                   <div className="d-flex align-items-center justify-content-between mb-2">
//                     <div>
//                       {[...Array(5)].map((_, index) => (
//                         <i
//                           key={index}
//                           className={`fas fa-star ${index < review.rating ? 'text-success' : 'text-muted'}`}
//                         />
//                       ))}
//                     </div>
//                     <div>
//                       <span className="me-2 fw-bold">{review.name}</span>
//                       <small className="me-auto">{review.date}</small>
//                     </div>
//                   </div>
//                   <p>{review?.review}</p>
//                   {review?.image && (
//                     <div className="review-image">
//                       <img src={`${ServerURL}/uploads/${review.image[0]}`} alt="Review" />
//                     </div>
//                   )}
//                 </div>
//               ))}
//               {!showAllReviews && (
//                 <div className="text-center">
//                   <Button variant="outline-success" onClick={handleReadMore}>
//                     Read More Reviews
//                   </Button>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Modal show={showReviewModal} onHide={handleCloseReviewModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Write a Review</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="formName">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="name"
//                 value={newReview.name}
//                 onChange={handleReviewChange}
//                 placeholder="Enter your name"
//               />
//             </Form.Group>
//             <Form.Group controlId="formRating" className="mt-3">
//               <Form.Label>Rating</Form.Label>
//               <Form.Control
//                 as="select"
//                 name="rating"
//                 value={newReview.rating}
//                 onChange={handleReviewChange}
//               >
//                 <option value={0}>Select rating</option>
//                 <option value={1}>1 star</option>
//                 <option value={2}>2 stars</option>
//                 <option value={3}>3 stars</option>
//                 <option value={4}>4 stars</option>
//                 <option value={5}>5 stars</option>
//               </Form.Control>
//             </Form.Group>
//             <Form.Group controlId="formReview" className="mt-3">
//               <Form.Label>Review</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 name="review"
//                 value={newReview.review}
//                 onChange={handleReviewChange}
//                 rows={3}
//                 placeholder="Write your review"
//               />
//             </Form.Group>
//             <Form.Group controlId="reviewImage">
//               <Form.Label>Upload Image</Form.Label>
//               <Form.Control
//                 type="file"
//                 multiple
//                 name="image"
//                 onChange={handleReviewChange}
//                 accept="image/*"
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseReviewModal}>
//             Cancel
//           </Button>
//           <Button variant="success" onClick={handleSubmitReview}>
//             Submit Review
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default Review;







// Review.jsx
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Modal, ProgressBar, Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Review.css';
import { useSelector } from 'react-redux';
import axiosInstance from '../axios';
import { ServerURL } from '../services/baseUrl';

function Review({ productId }) {
  const userDetails = useSelector((state) => state.userDetails);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 0,
    review: '',
    images: [],
  });
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [canWriteReview, setCanWriteReview] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/reviews/${productId}`);
        setReviews(response.data.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const checkCanWriteReview = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/cart/user/${userDetails._id}/product/${productId}`);
        setCanWriteReview(response.data.canWriteReview);
      } catch (error) {
        console.error('Error checking if user can write review:', error);
      }
    };

    fetchReviews();
    if (userDetails) {
      checkCanWriteReview();
    }
  }, [productId, userDetails]);

  const handleOpenReviewModal = () => setShowReviewModal(true);
  const handleCloseReviewModal = () => setShowReviewModal(false);

  const handleReviewChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setNewReview({ ...newReview, images: [...files] });
    } else {
      setNewReview({ ...newReview, [name]: value });
    }
  };

  const handleSubmitReview = async () => {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('userId', userDetails._id);
    formData.append('name', newReview.name);
    formData.append('rating', newReview.rating);
    formData.append('review', newReview.review);
    newReview.images.forEach((image) => formData.append('images', image));

    try {
      const response = await axiosInstance.post('/api/v1/reviews', formData, {
        headers: {
          Authorization: `Bearer ${userDetails.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setReviews([...reviews, response.data.data]);
      setNewReview({ name: '', rating: 0, review: '', images: [] });
      handleCloseReviewModal();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleReadMore = () => {
    setShowAllReviews(true);
  };

  const totalReviews = reviews.length;
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((review) => {
    ratingCounts[review.rating - 1]++;
  });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : '0';

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  return (
    <Container fluid className="review-section py-5">
      <h2 className="text-center mb-4 fw-bold">Customer Reviews</h2>
      <Row className="g-4">
        <Col lg={4} md={6}>
          <Card className="rating-summary-card  shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Ratings & Reviews</Card.Title>
              <Row className="align-items-center mb-4">
                <Col xs={5} className="text-center">
                  <div className="rating-summary">
                    <h2 className="display-4 fw-bold mb-0">{averageRating}</h2>
                    <div className="star-rating mb-2">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`fas fa-star ${index < Math.floor(averageRating) ? 'text-warning' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <small className="text-muted">{totalReviews} ratings</small>
                  </div>
                </Col>
                <Col xs={7}>
                  <div className="rating-bars">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="d-flex align-items-center mb-2">
                        <span className="text-muted me-2 d-flex align-items-center">
                          <span className="fw-bold me-1">{rating}</span>
                          <i className="fas fa-star text-warning"></i>
                        </span>
                        <ProgressBar
                          now={(ratingCounts[rating - 1] / totalReviews) * 100}
                          variant="warning"
                          className="flex-grow-1 me-2"
                          style={{ height: '8px' }}
                        />
                        <span className="text-muted small">
                          {totalReviews > 0 ? `${((ratingCounts[rating - 1] / totalReviews) * 100).toFixed(0)}%` : '0%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
              <div className="mt-4">
                <h5 className="fw-bold">Review this product</h5>
                <p className="text-muted">Help others make an informed decision</p>
                <Button
                  variant="outline-primary"
                  className="rounded-pill w-100 p-2 mt-2"
                  onClick={handleOpenReviewModal}
                  disabled={!canWriteReview}
                >
                  Write a Review
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8} md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">Customer Reviews</Card.Title>
              {displayedReviews.map((review) => (
                <div key={review._id} className="mb-4 pb-4 border-bottom">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="star-rating">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`fas fa-star ${index < review.rating ? 'text-warning' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <div className="text-muted small">
                      <span className="fw-bold me-2">{review.name}</span>
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="mb-3">{review.review}</p>
                  {review.image && review.image.length > 0 && (
                    <div className="review-images d-flex flex-wrap gap-2">
                      {review.image.map((img, index) => (
                        <img
                          key={index}
                          src={`${ServerURL}/uploads/${img}`}
                          alt={`Review ${index}`}
                          className="img-thumbnail"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {!showAllReviews && reviews.length > 4 && (
                <div className="text-center mt-4">
                  <Button variant="outline-primary" onClick={handleReadMore}>
                    Read More Reviews
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showReviewModal} onHide={handleCloseReviewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newReview.name}
                onChange={handleReviewChange}
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group controlId="formRating" className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Select
                name="rating"
                value={newReview.rating}
                onChange={handleReviewChange}
              >
                <option value={0}>Select rating</option>
                <option value={1}>1 star</option>
                <option value={2}>2 stars</option>
                <option value={3}>3 stars</option>
                <option value={4}>4 stars</option>
                <option value={5}>5 stars</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formReview" className="mb-3">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                name="review"
                value={newReview.review}
                onChange={handleReviewChange}
                rows={3}
                placeholder="Write your review"
              />
            </Form.Group>
            <Form.Group controlId="formImages" className="mb-3">
              <Form.Label>Upload Images</Form.Label>
              <Form.Control
                type="file"
                name="images"
                multiple
                onChange={handleReviewChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReviewModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitReview}>
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Review;