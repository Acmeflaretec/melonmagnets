import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { getAllCategoryApi } from '../services/allApi';
import { ServerURL } from '../services/baseUrl';
import './PinBadges.css';

function PinBadges() {
  const [badges, setBadges] = useState([]);
  const [sortOrder, setSortOrder] = useState('bestselling');

  // Function to fetch all badges from API
  const getAllCategory = async () => {
    try {
      const category = await getAllCategoryApi();
      const categoryData = category?.data?.data?.find(
        (item) => item.name === "Pin Badges"
      );
      if (categoryData) {
        setBadges(categoryData.products);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Function to sort badges based on sortOrder
  const sortedBadges = useMemo(() => {
    if (sortOrder === 'bestselling') {
      return [...badges].sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'priceasc') {
      return [...badges].sort((a, b) => a.price - b.price);
    }
    // Return default sorted list (bestselling) if sortOrder is invalid
    return [...badges].sort((a, b) => b.price - a.price);
  }, [badges, sortOrder]);

  // Event handler for sorting dropdown change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div>
      <div className="container mb-5">
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
            <div key={badge._id} className="col">
              <Link to={`/pinbadges/${badge._id}`} className='text-decoration-none'>
                <div className="card h-100 shadow">
                  <div className="card-img-container p-2">
                    <img src={`${ServerURL}/uploads/${badge.image[0]}`} className="card-img-top" alt={badge.name} />
                  </div>
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
    </div>
  );
}


export default PinBadges;
