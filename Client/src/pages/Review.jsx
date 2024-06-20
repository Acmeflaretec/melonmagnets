import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from 'react-bootstrap';

function Review() {
  const reviews = [
    
  ];

  const ratingCounts = {
    5: 3,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  const overallRating = 5.0;

  return (
    <div className="container mt-5">
      <div className="bg-light p-4 rounded shadow-sm">
        <h2 className="mb-4">Customer Reviews</h2>
        <Row>
        <Col md={8}>
            <Row>
               <Col md={6}>
                  <div className="d-flex align-items-center me-4">
                    <div className="display-4 mb-0">{overallRating.toFixed(1)}</div>
                    <div className="ms-3">
                      <div className="d-flex align-items-center">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className="text-warning fs-3">&#9733;</span>
                        ))}
                      </div>
                      <div>{reviews.length} reviews</div>
                    </div>
                  </div>
               </Col>
                <Col md={6}>
                  <div className="flex-grow-1">
                    {Object.entries(ratingCounts).sort((a, b) => b[0] - a[0]).map(([rating, count]) => (
                      <div key={rating} className="d-flex align-items-center mb-2">
                        <span className="me-2">{rating} Star</span>
                        <div className="progress flex-grow-1 me-2" style={{ height: '20px' }}>
                          <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${(count / 3) * 100}%` }} aria-valuenow={(count / 3) * 100} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </Col>
            </Row>
          </Col>
        <Col md={4} className='d-flex justify-content-center '>
       <div> <button className="btn btn-outline-dark ">Write a review</button></div>
        </Col>
        </Row>
        <div className="reviews mt-3 ">
          {reviews.map((review, index) => (
            <div key={index} className="card mb-3 shadow-sm">
              <div className="card-body">
                <div className="d-flex flex-column  mb-2">
                  <div className="me-2">
                    {Array(review.rating).fill().map((_, i) => (
                      <span key={i} className="text-warning">&#9733;</span>
                    ))}
                  </div>
                  <div className="fw-bold me-2">{review.name}</div>
                </div>
                <div className="mb-2">{review.comment}</div>
                {review.image && <img src={review.image} alt="Reviewer" className="rounded-circle" width="50" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Review;
