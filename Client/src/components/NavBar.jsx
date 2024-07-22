import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';
import { Badge, Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import './NavBar.css';
import Cart from '../pages/Cart';
import { getCartItemApi } from '../services/allApi';
import { cartResponseContext, removeCartContext } from '../context/ContextShare';
import { setUserDetails, clearUserDetails } from '../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../axios'


const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { toggleCart, setToggleCart } = useContext(cartResponseContext);
  const { removeCart, setRemoveCart } = useContext(removeCartContext)


  const dispatch = useDispatch();
  const userDetails = useSelector(state => state.userDetails);
  // console.log('userDetails',userDetails);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/auth/user');
       // console.log(response.data.data)
        dispatch(setUserDetails(response.data.data));
      } catch (error) {
        console.log('errr', error);
        dispatch(clearUserDetails());
      }
    };
    fetchData();
  }, []);


  const logoutUser = () => {
    dispatch(clearUserDetails());

    localStorage.removeItem('Tokens');
    window.location.reload();
    navigate('/')
  };





  const location = useLocation();
  const activePath = location.pathname;

  const handleDropdownEnter = () => {
    setShowDropdown(true);
  };

  const handleDropdownLeave = () => {
    setShowDropdown(false);
  };

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const handleCartClick = () => {
    handleCloseOffcanvas();
    setShowCart(!showCart);
    setToggleCart(!toggleCart);  // Ensure toggleCart is toggled properly
  };

  const getLinkClass = (path) => {
    return activePath === path || (activePath === '/' && path === '/fridgemagnets') ? 'nav-link active-link' : 'nav-link';
  };

  const getCartItems = async () => {
    const ids = JSON.parse(localStorage.getItem('cartData')) || [];
    const params = new URLSearchParams();
    ids.forEach(id => params.append('id', id));
    const result = await getCartItemApi(params.toString());
    setCartItems(result?.data);
  };

  useEffect(() => {
    getCartItems();
  }, [toggleCart, removeCart]);

  useEffect(() => {
    if (toggleCart) {
      setShowCart(true);
    } else {
      setShowCart(false);
    }
  }, [toggleCart]);

  return (
    <>
      {/* Large Screen Navbar */}
      <Navbar expand="lg" className='p-0 m-0 d-none d-lg-flex mt-3 shadow-sm'>
        <Container>
          <Navbar.Brand>
            <Link to={'/'}>
              <img src={logo} alt="logo" className="d-inline-block align-top" style={{ mixBlendMode: 'multiply' }} />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Link to={'/fridgemagnets'} className={getLinkClass('/fridgemagnets')}>Fridge Magnets</Link>
              <Link to={'/pinbagesmain'} className={getLinkClass('/pinbagesmain')}>Pin Badges</Link>
              <Link to={'/savethedate'} className={getLinkClass('/savethedate')}>Save The Date</Link>
              <div
                className="dropdown"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <Link to={'/allproducts'} className='text-decoration-none'>
                  <h5 className="dropdown-toggle nav-link shopall" style={{ marginRight: '10px' }}>Shop All</h5>
                </Link>
                {showDropdown && (
                  <div className="dropdown-menu show">
                    <Link to={'/fridgemagnets'} className="dropdown-item">Fridge Magnets</Link>
                    <Link to={'/pinbagesmain'} className="dropdown-item">Pin Badges</Link>
                    <Link to={'/savethedate'} className="dropdown-item">Save The Date</Link>
                    <Link to={'/bulkorder'} className="dropdown-item">Bulk order</Link>
                  </div>
                )}
              </div>
            </Nav>
            <Nav className="ms-auto">
              {/* <Link to={'https://www.instagram.com/melonmagnets'} className="nav-link text-decoration-none  text-dark">
                <FontAwesomeIcon icon={faInstagram} />
              </Link> */}
              {userDetails ? (<button className="nav-link text-decoration-none text-dark position-relative me-3" onClick={handleCartClick}>
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartItems?.length > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {cartItems?.length}
                  </Badge>
                )}
              </button>) : (<Link to={'/login'}>
              <button className="nav-link text-decoration-none text-dark position-relative me-3" ><FontAwesomeIcon icon={faShoppingCart} /></button></Link>) }
              
              {userDetails ? (
  <button 
    className='btn btn-light' 
    onClick={logoutUser} 
    title="Logout"
  >
    <i className="fa-solid fa-arrow-right-to-bracket"></i>
  </button>
) : (
  <Link to={'/login'}>
    <button 
      className='btn btn-light'
      title="Login"
    >
      <i className="fa-solid fa-power-off"></i>
    </button>
  </Link>
)}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas show={showCart} onHide={handleCartClick} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>CART</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body onClick={handleCloseOffcanvas}>
          <Cart />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Offcanvas Navbar for Small Screens */}
      <Navbar expand="lg" className="bg-light p-0 m-0 d-lg-none">
        <Container>
          <Navbar.Brand>
            <Link to={'/'}>
              <img src={logo} alt="logo" className="d-inline-block align-top" style={{ mixBlendMode: 'multiply' }} />
            </Link>
          </Navbar.Brand>
          <div className="d-flex align-items-center">
          {userDetails ? (<button className="nav-link text-decoration-none text-dark position-relative me-3" onClick={handleCartClick}>
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartItems?.length > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {cartItems?.length}
                  </Badge>
                )}
              </button>) : (<Link to={'/login'}>
              <button className="nav-link text-decoration-none text-dark position-relative me-3" ><FontAwesomeIcon icon={faShoppingCart} /></button></Link>) }
              
              {userDetails ? (<button className='btn btn-light' title="Logout" onClick={logoutUser} ><i className="fa-solid fa-arrow-right-to-bracket"></i></button>
              ) : (
              <Link to={'/login'}> <button className='btn btn-light' title="Login"><i className="fa-solid fa-power-off"></i></button></Link>
               )}
            <Navbar.Toggle aria-controls="navbar-offcanvas" onClick={handleShowOffcanvas} />
          </div>
          <Navbar.Offcanvas
            id="navbar-offcanvas"
            aria-labelledby="navbar-offcanvas-label"
            placement="start"
            show={showOffcanvas}
            onHide={handleCloseOffcanvas}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="navbar-offcanvas-label">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="offcanvas-nav">
              <Nav className="flex-column">
                <Link to={'/fridgemagnets'} className={getLinkClass('/fridgemagnets')} onClick={handleCloseOffcanvas}>Fridge Magnets</Link>
                <Link to={'/pinbagesmain'} className={getLinkClass('/pinbagesmain')} onClick={handleCloseOffcanvas}>Pin Badges</Link>
                <Link to={'/savethedate'} className={getLinkClass('/savethedate')} onClick={handleCloseOffcanvas}>Save The Date</Link>
                <Link to={'/bulkorder'} className={getLinkClass('/bulkorder')} onClick={handleCloseOffcanvas}>Bulk order</Link>
                <Link to={'/allproducts'} className={getLinkClass('/allproducts')} onClick={handleCloseOffcanvas}>Shop All</Link>
              </Nav>
              <div className="offcanvas-footer">
                <div className="social-icons">
                  <Link to={'https://www.instagram.com/melonmagnets'} className="nav-link text-dark" onClick={handleCloseOffcanvas}>
                    <FontAwesomeIcon icon={faInstagram} />
                  </Link>
                  <Link to={'https://www.linkedin.com/company/melonmagnets'} className="nav-link text-dark" onClick={handleCloseOffcanvas}>
                    <FontAwesomeIcon icon={faLinkedin} />
                  </Link>
                  <Link to={'/'} className="nav-link text-dark" onClick={handleCloseOffcanvas}>
                    <FontAwesomeIcon icon={faFacebook} />
                  </Link>
                </div>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
