import React, { useState } from 'react';
import Topnav from '../components/Topnav';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function PinBadges() {
  const badges = [
    { id: 1, name: 'Hero Badge', price: 49, image: 'https://m.media-amazon.com/images/I/71CDEH-B1LL.jpg' },
    { id: 2, name: 'Destiny Believer Badge', price: 49, image: 'https://m.media-amazon.com/images/I/71CDEH-B1LL.jpg' },
    { id: 3, name: 'Dreamer Badge', price: 49, image: 'https://m.media-amazon.com/images/I/71CDEH-B1LL.jpg' },
    { id: 4, name: 'Hukum Bindani Combo Badge', price: 79, image: 'https://m.media-amazon.com/images/I/71CDEH-B1LL.jpg' }
  ];

  const [sortOrder, setSortOrder] = useState('bestselling');

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Sort badges based on the selected order
  const sortedBadges = sortOrder === 'bestselling'
    ? badges.slice().sort((a, b) => b.price - a.price)
    : badges.slice().sort((a, b) => a.price - b.price);

  return (
    <div>
      <Topnav />
      <NavBar />
      <div className="container mb-5 ">
        <h3 className='display-4 fw-bold'>Badges</h3>
        <div className="row mb-4">
          <div className="col-md-4">
            <label htmlFor="sortOrder" className="me-2">Sort by:</label>
            <select id="sortOrder" value={sortOrder} onChange={handleSortChange} className="form-select w-50">
              <option value="bestselling">Best Selling</option>
              <option value="priceasc">Price (Low to High)</option>
            </select>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {sortedBadges.map((badge) => (
            <div key={badge.id} className="col">
            <Link to={'/product'} className='text-decoration-none '>
                <div className="card h-100 shadow ">
                  <img src={badge.image} className="card-img-top" alt={badge.name} />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{badge.name}</h5>
                    <p className="card-text mb-auto">Rs. {badge.price}</p>
                  </div>
                </div>
            </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default PinBadges;