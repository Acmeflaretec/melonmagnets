import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getallproductsapi } from '../services/allApi';
import { ServerURL } from '../services/baseUrl';
import '../App.css';

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getAllProducts = async () => {
    getallproductsapi()
      .then((data) => {
        setProducts(data.data.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const nameToRouteMapping = {
    'fridge magnets': '/fridgemagnets',
    'save the date': '/savethedate'
  };

  const handleRedirect = (name, id) => {
    const lowerCaseName = name.toLowerCase().replace(/\s+/g, '');
    const route = Object.keys(nameToRouteMapping).find(
      key => key.replace(/\s+/g, '').toLowerCase() === lowerCaseName
    );
    
    if (route) {
      navigate(nameToRouteMapping[route]);
    } else {
      navigate(`/pinbadges/${id}`);
    }
  };

  const truncateName = (name, maxLength) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength) + '...';
  };

  return (
    <div>
      {loading ? (
        <div className='d-flex justify-content-center align-items-center' style={{height: '60vh'}}>
          <div className='loader'></div>
        </div>
      ) : (
        <div className="container mt-3">
          <Row>
          {products.map((item) => (
            <Col key={item._id} xs={6} md={4} lg={4} className='mb-3' onClick={() => handleRedirect(item?.name, item?._id)}>
                <div className="card h-100 shadow">
                  <div className="card-img-container p-2">
                    <img src={`${ServerURL}/uploads/${item.image[0]}`} className="card-img-top rounded" alt={item.name} />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold mb-2">{item.name}</h5>
                    <p className="card-text ">Rs. {item.sale_rate}</p>
                  </div>
                </div>
            </Col>
          ))}
        </Row>
        </div>
      )}
    </div>
  );
}

export default AllProducts;
