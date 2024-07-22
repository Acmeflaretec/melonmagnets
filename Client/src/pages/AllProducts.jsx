import React, { useEffect, useState } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getallproductsapi } from '../services/allApi';
import { ServerURL } from '../services/baseUrl';
import '../App.css';
import './AllProducts.css'

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [sortOption, setSortOption] = useState('default');

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

  useEffect(() => {
    if (products.length > 0) {
      const sortProducts = () => {
        let sortedProducts = [...products];
        switch (sortOption) {
          case 'priceLowToHigh':
            sortedProducts.sort((a, b) => (a.sale_rate || a.sale1 || 0) - (b.sale_rate || b.sale1 || 0));
            break;
          case 'priceHighToLow':
            sortedProducts.sort((a, b) => (b.sale_rate || b.sale1 || 0) - (a.sale_rate || a.sale1 || 0));
            break;
          default:
            break;
        }
        setProducts(sortedProducts);
      };

      sortProducts();
    }
  }, [sortOption, products]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

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

  console.log(products);


  return (
    <div>
      {loading ? (
        <div className='d-flex justify-content-center align-items-center' style={{height: '60vh'}}>
          <div className='loader'></div>
        </div>
      ) : (
        <div className="container mt-3">
        <div className='col-md-4'>
            <Form.Group className="mb-3">
              <Form.Select onChange={handleSortChange} value={sortOption}>
                <option value="default">Sort by</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
              </Form.Select>
            </Form.Group>
        </div>
          <Row>
            {products.map((item) => (
              <Col
                key={item._id}
                xs={6}
                md={4}
                lg={4}
                className='mb-3'
                onClick={() => handleRedirect(item?.name, item?._id)}
                onMouseEnter={() => setHoveredProduct(item._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="card h-100 shadow">
                  <div className="card-img-container p-2">
                    <img
                      src={`${ServerURL}/uploads/${hoveredProduct === item._id && item.image[1] ? item.image[1] : item.image[0]}`}
                      className="card-img-top rounded allimage"
                      alt={item.name}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold mb-2">{truncateName(item.name, 20)}</h5>
                    <p className="card-text">Rs. {item.sale_rate?item.sale_rate:item.sale1}</p>
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