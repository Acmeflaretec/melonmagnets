



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
import { Button, Card, Col, Form, Modal, ProgressBar, Row, Container, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Review.css';
import { useSelector } from 'react-redux';
import axiosInstance from '../axios';
import { ServerURL } from '../services/baseUrl';
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";


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
  const [previewReview, setPreviewReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/reviews/${productId}`);
        const sortedReviews = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReviews(sortedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const checkCanWriteReview = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/cart/user/${userDetails._id}/product/${productId}`);
        console.log("rewiew response", response.data);
        setCanWriteReview(response.data.canWriteReview);
      } catch (error) {
        console.error('Error checking if user can write review:', error);
      }
    };

    fetchReviews();
    if (userDetails) {
      console.log('userDetails existing');
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
    setIsLoading(true);
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

      setReviews([response.data.data, ...reviews]);
      setNewReview({ name: '', rating: 0, review: '', images: [] });
      handleCloseReviewModal();
      alert('your review is added')
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadMore = () => {
    setShowAllReviews(true);
  };

  const handleImagePreview = (review, imageSrc) => {
    setPreviewReview({ ...review, currentImage: imageSrc });
  };

  const totalReviews = reviews.length;
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((review) => {
    ratingCounts[review.rating - 1]++;
  });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRatings = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : '0';
  const averageRating = (averageRatings % 1 === 0) ? Math.round(averageRatings) : averageRatings;

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  const preventManualInput = (e) => {
    e.preventDefault();
  };

  const handleRatingChange = (event, newValue) => {
    setNewReview({ ...newReview, rating: newValue });
  };
  return (
    <Container fluid className="review-section py-5 mt-3">
      <h2 className="text-center mb-4 fw-bold">Customer Reviews</h2>
      <Row className="g-4">
        <Col lg={4} md={6}>
          <Card className="rating-summary-card shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Ratings & Reviews</Card.Title>
              <Row className="align-items-center mb-4">
                <Col xs={5} className="text-center">
                  <div className="rating-summary">
                    {/* <h2 className="display-4 fw-bold mb-0">{Math.round(averageRating)}</h2> */}
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
                  variant="outline-success"
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
                          className="img-thumbnail cursor-pointer"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          onClick={() => handleImagePreview(review, `${ServerURL}/uploads/${img}`)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {!showAllReviews && reviews.length > 4 && (
                <div className="text-center mt-4">
                  <Button variant="outline-success" onClick={handleReadMore}>
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
            {/* <Form.Group controlId="formRating" className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={newReview.rating}
                onChange={handleReviewChange}
                placeholder="Enter your rating (1-5)"
                min="1"
                max="5"
                step="1"
                onKeyPress={preventManualInput}
                onPaste={preventManualInput}
              />
            </Form.Group> */}
            <Form.Group controlId="formRating" className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Box component="fieldset" mb={3} borderColor="transparent">
                <Rating
                  name="simple-controlled"
                  value={newReview.rating}
                  onChange={handleRatingChange}
                />
              </Box>
            </Form.Group>
            <Form.Group controlId="formReview" className="mb-3">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="review"
                value={newReview.review}
                onChange={handleReviewChange}
                placeholder="Write your review here"
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
          <Button variant="primary" disabled={isLoading} onClick={handleSubmitReview}>
            Submit Review
            {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'Submit Review'
                  )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={previewReview !== null}
        onHide={() => setPreviewReview(null)}
        size="lg"
        centered
        className="review-preview-modal"
      >
        <Modal.Body className="p-0">
          <Row className="g-0">
            <Col md={7} className="preview-image-container">
              <div className="position-relative h-100">
                <img
                  src={previewReview?.currentImage}
                  alt="Preview"
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: 'contain', maxHeight: '80vh' }}
                />

              </div>
            </Col>
            <Col md={5} className="bg-light">
              <Button
                variant="light"
                className="position-absolute top-0 end-0 m-2"
                onClick={() => setPreviewReview(null)}
                aria-label="Close"
              >
                <i className="fas fa-times"></i>
              </Button>
              <div className="p-4 d-flex flex-column h-100">
                <div className="mb-4">
                  <h4 className="fw-bold text-primary mb-1">{previewReview?.name}</h4>
                  <p className="text-muted small mb-2">
                    {previewReview && new Date(previewReview.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <div className="d-flex align-items-center mb-3">
                    <div className="star-rating me-2">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`fas fa-star ${index < (previewReview?.rating || 0) ? 'text-warning' : 'text-secondary'}`}
                        />
                      ))}
                    </div>
                    <span className="text-muted fw-bold">{previewReview?.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="mb-4 flex-grow-1 overflow-auto">
                  <h5 className="fw-bold mb-3">Review</h5>
                  <p className="text-muted">{previewReview?.review}</p>
                </div>
                {previewReview?.image && previewReview.image.length > 1 && (
                  <div>
                    <h5 className="fw-bold mb-3">Images</h5>
                    <div className="d-flex flex-wrap gap-2 justify-content-start">
                      {previewReview.image.map((img, index) => (
                        <div key={index} className="position-relative thumbnail-wrapper">
                          <img
                            src={`${ServerURL}/uploads/${img}`}
                            alt={`Review ${index + 1}`}
                            className={`img-thumbnail cursor-pointer preview-thumbnail ${previewReview.currentImage === `${ServerURL}/uploads/${img}` ? 'active' : ''}`}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            onClick={() => setPreviewReview({ ...previewReview, currentImage: `${ServerURL}/uploads/${img}` })}
                          />
                          {previewReview.currentImage === `${ServerURL}/uploads/${img}` && (
                            <div className="active-indicator"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

    </Container>
  );
}

export default Review;
