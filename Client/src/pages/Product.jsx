import React, { useContext, useEffect, useState } from 'react';
import { Button, CloseButton, Col, Container, Image, Row } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';
import uploadimg from '../assets/img/upload.png';
import { addToCartApi, getAllCategoryApi } from '../services/allApi';
import { ServerURL } from '../services/baseUrl';
// import Review from './Review';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import '../App.css';
import video from '../assets/img/video.png';
import Review from '../components/Review';
import { cartResponseContext } from '../context/ContextShare';
import RenderImage from './RenderImage';

const Product = () => {
  const userDetails = useSelector((state) => state.userDetails);
  const { id } = useParams();
  const defaultCategory = id ? id : "fridgemagnets";
  const [saveTheDateSize, setSaveTheDateSize] = useState('4 Images');
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleCart, setToggleCart } = useContext(cartResponseContext);
  const [cartLoading, setCartLoading] = useState(false)
  const fileInputRef = React.useRef(null);
  const visibleThumbnailCount = 5;
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    const validImages = files.filter(file => validImageTypes.includes(file.type));
    const invalidImages = files.filter(file => !validImageTypes.includes(file.type));

    if (invalidImages.length > 0) {
      setAlertMessage('Only image files (jpg, png, gif) are allowed.');
      setShowAlert(true);
    } else {
      setAlertMessage('');
      setShowAlert(false);
    }

    const images = [...image, ...validImages];
    if (images.length > getMaxPhotos()) {
      setAlertMessage(`Maximum ${getMaxPhotos()} images are allowed.`);
      setShowAlert(true);
      images.length = getMaxPhotos();
    }

    setImage(images);
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = (index) => {
    const updatedImages = image.filter((_, i) => i !== index);
    setImage(updatedImages);
  };

  useEffect(() => {
    const images = [...image];
    if (images?.length > getMaxPhotos()) {
      images.length = getMaxPhotos();
      setAlertMessage(`Maximum ${getMaxPhotos()} images are allowed.`);
      setShowAlert(true);
    }
    setImage(images);
  }, [saveTheDateSize]);

  useEffect(() => {
    getAllCategory();
  }, [defaultCategory]);
  
  useEffect(() => {
    if (productDetails && productDetails.stock === 0) {
      setIsOutOfStock(true);
    } else {
      setIsOutOfStock(false);
    }
  }, [productDetails]);

  const handleThumbnailClick = (index) => {
    setSelectedThumbnailIndex(index);
  };

  useEffect(() => {
    let timer;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const getMaxPhotos = () => {
    switch (saveTheDateSize) {
      case '9 Images':
        return 9;
      case '6 Images':
        return 6;
      case '4 Images':
        return 4;
      default:
        return 4;
    }
  };

  

  const handleAddToCart = async () => {
    const requiredPhotos = getMaxPhotos();
    if (image.length !== requiredPhotos) {
      setAlertMessage(`Please upload exactly ${requiredPhotos} images.`);
      setShowAlert(true);
      return;
    }
    setAlertMessage('');
    setShowAlert(false);
    setCartLoading(true)
    const reqBody = new FormData();
    reqBody.append('productId', productDetails._id);
    // reqBody.append('userId', userDetails._id);

    reqBody.append('quantity', 1);
    reqBody.append('price', getPrice());
    reqBody.append('salePrice', getSalePrice());

    Array.from(image).forEach((file) => {
      reqBody.append('images', file);
    });

    const reqHeader = {
      "Content-Type": "multipart/form-data"
    };

    const result = await addToCartApi(reqBody, reqHeader);
    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
    result?.data?._id && cartData.push(result?.data?._id);
    localStorage.setItem('cartData', JSON.stringify(cartData));
    setCartLoading(false)
    setToggleCart(prev => !prev);
    setAlertMessage('');
    setShowAlert(false);
    setImage([]);
  };

  const idMapping = {
    fridgemagnets: 'fridge magnets',
    pinbadges: 'pin badges',
    souvneir: ' souvneir',
    savethedate: 'save the date'
  };

  const getAllCategory = async () => {
    try {
      const category = await getAllCategoryApi();
      const backendCategoryName = idMapping[defaultCategory?.toLowerCase()];
      const categoryData = category?.data?.data?.find(
        (item) => item.name.toLowerCase() === backendCategoryName?.toLowerCase()
      );

      if (categoryData) {
        setThumbnailUrls(categoryData?.products?.[0]?.image);
        setProductDetails(categoryData?.products?.[0]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, [defaultCategory]);

  const calculatePercentageOff = (originalPrice, salePrice) => {
    const discount = originalPrice - salePrice;
    const percentageOff = (discount / originalPrice) * 100;
    return Math.round(percentageOff);
  };

  const getPrice = () => {
    switch (saveTheDateSize) {
      case '9 Images':
        return productDetails?.type3;
      case '6 Images':
        return productDetails?.type2;
      case '4 Images':
        return productDetails?.type1;
      default:
        return productDetails?.type1;
    }
  };

  const getSalePrice = () => {
    switch (saveTheDateSize) {
      case '9 Images':
        return productDetails?.sale3;
      case '6 Images':
        return productDetails?.sale2;
      case '4 Images':
        return productDetails?.sale1;
      default:
        return productDetails?.sale1;
    }
  };

  const updateVisibleStartIndex = (newSelectedIndex) => {
    if (newSelectedIndex < visibleStartIndex) {
      setVisibleStartIndex(Math.floor(newSelectedIndex / visibleThumbnailCount) * visibleThumbnailCount);
    } else if (newSelectedIndex >= visibleStartIndex + visibleThumbnailCount) {
      setVisibleStartIndex(Math.floor(newSelectedIndex / visibleThumbnailCount) * visibleThumbnailCount);
    }
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


  const originalPrice = getPrice();
  const salePrice = getSalePrice();
  const percentageOff = calculatePercentageOff(originalPrice, salePrice);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextThumbnail,
    onSwipedRight: handlePrevThumbnail,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // console.log(productDetails)

  return (
    <>
      {loading ? (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '60vh' }}>
          <div className='loader'></div>
        </div>
      ) : (
        <Container className="mt-4 mb-5">
          <Row>
            <Col md={6}>
            <div className="mb-4 position-relative" {...swipeHandlers}>
            <RenderImage image={thumbnailUrls?.[selectedThumbnailIndex]}/>
            {isOutOfStock && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
                  style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
                <h2 className="text-white bg-danger p-2">Out of Stock</h2>
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
                  {thumbnailUrls?.slice(visibleStartIndex, visibleStartIndex + visibleThumbnailCount).map((url, index) =>{
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
                  )})}
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
              <h4 className="text-danger">₹ {salePrice}</h4>
              <span className='m-1 text-muted text-decoration-line-through'>₹{originalPrice}</span>
              <span className='text-success fw-bold bg-success-subtle p-1'>{percentageOff}% off</span>
              <h5>Select Size:</h5>
              <div className="d-flex mb-3">
                {['9 Images', '6 Images', '4 Images'].map((size) => (
                  <Button
                    key={size}
                    variant={saveTheDateSize === size ? 'dark' : 'light'}
                    className="mx-1"
                    onClick={() => setSaveTheDateSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
              <h5>Upload Photos:</h5>
              <Row className="mb-1">
                {image?.length > 0 &&
                  image?.map((img, idx) => (
                    <Col xs={4} sm={3} md={4} lg={3} className="mb-2" key={idx}>
                      <div className="image-container">
                        <Image
                          fluid
                          style={{ width: 90, height: 90, borderRadius: '16px', border: 'solid 1px #D3D3D3' }}
                          src={typeof img === 'object' ? URL.createObjectURL(img) : `${ServerURL}/uploads/${img}`}
                        />
                        <CloseButton
                          onClick={() => handleRemoveImage(idx)}
                          className="close-button"
                        />
                      </div>
                    </Col>
                  ))}
                {[...Array(getMaxPhotos() <= image?.length ? 0 : getMaxPhotos() - image?.length)].map((_, idx) => (
                  <Col xs={4} sm={3} md={4} lg={3} className="mb-2" key={idx}>
                    <div>
                      <Image
                        src={uploadimg}
                        fluid
                        onClick={handleFileSelect}
                        style={{
                          width: 90,
                          height: 90,
                          borderRadius: '16px',
                          border: 'solid 1px #D3D3D3',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
              <Row className='mb-2' style={{ minHeight: '24px' }}>
                {showAlert && <span style={{ fontSize: '14px', color: 'red' }}>{alertMessage}</span>}
              </Row>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                accept="image/jpeg, image/png, image/gif"
                className="d-none"
                id="file-upload"
              />
              <button className="btn btn-outline-warning w-100 mb-2 text-dark rounded-pill" disabled={image.length === getMaxPhotos()}>
                <label htmlFor="file-upload">
                  Upload Photos
                </label>
              </button>
              {isOutOfStock ? (
              <Button 
                variant="secondary"
                className="w-100 rounded-pill"
                disabled
              >
                Out of Stock
              </Button>
            ) : (
              // userDetails ? (
                <Button
                  variant="warning"
                  className="w-100 rounded-pill"
                  onClick={handleAddToCart}
                  disabled={cartLoading || image.length !== getMaxPhotos()}
                >
                  {cartLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      <span className="sr-only">Loading...</span> Uploading Photos to cart...
                    </>
                  ) : 'Add To Cart'}
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
)}
            </Col>
          </Row>
          <Row>
            <Col className='mt-5'>
              <h2>Product Details</h2>
              <p>
                {productDetails.description}
              </p>
            </Col>
          { isHomePage&&
           <Col md={12} className='mt-4'>
            <iframe
              width="100%"
              height="400px"
              src={`${import.meta.env.VITE_APP_Video_URL}?autoplay=1&mute=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </Col>}
          </Row>
          <Row>
            <Review productId={productDetails._id}/>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Product;





// import React, { useEffect, useState } from 'react';
// import { Alert, Button, Col, Container, Image, Row } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
// import uploadimg from '../assets/img/upload.png';
// import { addToCartApi, getAllCategoryApi } from '../services/allApi';
// import { ServerURL } from '../services/baseUrl';
// import Review from './Review';
// import Swal from 'sweetalert2';

// const Product = () => {
//   const { id } = useParams();
//   const defaultCategory = id ? id : "fridgemagnets";
//   const [saveTheDateSize, setSaveTheDateSize] = useState('4 Images');
//   const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
//   const [visibleStartIndex, setVisibleStartIndex] = useState(0);
//   const [uploadedPhotos, setUploadedPhotos] = useState([]);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [thumbnailUrls, setThumbnailUrls] = useState([]);
//   const [productDetails, setProductDetails] = useState({});
//   const [image, setImage] = useState([]);
//   const [selectedImageFilenames, setSelectedImageFilenames] = useState([]);

//   const handleFileUpload = (event) => {
//     const files = event.target.files;
//     const uploadedFiles = Array.from(files)
//       .filter((file) => file.type.startsWith('image/'))
//       .map((file) => ({ url: URL.createObjectURL(file), file: file }));

//     const maxPhotos = getMaxPhotos();
//     const selectedFiles = uploadedFiles.slice(0, maxPhotos);

//     setUploadedPhotos((prevPhotos) => [...prevPhotos, ...selectedFiles]);
//     setSelectedImageFilenames(selectedFiles.map((file) => file.file));
//     setImage(files);
//   };


//   const handleThumbnailClick = (index) => {
//     setSelectedThumbnailIndex(index);
//   };

//   const handlePrevThumbnail = () => {
//     setVisibleStartIndex((prevIndex) =>
//       prevIndex === 0 ? thumbnailUrls.length - 1 : prevIndex - 1
//     );
//   };

//   const handleNextThumbnail = () => {
//     setVisibleStartIndex((prevIndex) =>
//       prevIndex === thumbnailUrls.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const getMaxPhotos = () => {
//     switch (saveTheDateSize) {
//       case '9 Images':
//         return 9;
//       case '6 Images':
//         return 6;
//       case '4 Images':
//         return 4;
//       default:
//         return 4;
//     }
//   };

//   const handleAddToCart = async() => {
//     const requiredPhotos = getMaxPhotos();
//     if (uploadedPhotos.length !== requiredPhotos) {
//       setAlertMessage(`Please upload exactly ${requiredPhotos} images.`);
//       setShowAlert(true);
//       return;
//     }
//     setAlertMessage('');
//     setShowAlert(false);

//     const reqBody = new FormData()
//     reqBody.append('productId',productDetails._id)
//     reqBody.append('quantity',1)
//     reqBody.append('price',getMaxPhotos(saveTheDateSize)===9?productDetails.type3:getMaxPhotos(saveTheDateSize)===6?productDetails.type2:productDetails.type1)
//     // reqBody.append('image', image, image.name);

//     // uploadedPhotos.file?.map((item) => {
//     //   console.log(item);
//     //   reqBody.append('images', item, item.name);
//     // });

//     Array.from(image).forEach((file) => {
//       reqBody.append('images', file);
//     });

//     const reqHeader ={
//       "Content-Type":"multipart/form-data"
//     }

//     const result = await addToCartApi(reqBody,reqHeader)
//     console.log(result);
//     const cartData = JSON.parse(localStorage.getItem('cartData')) || [];

//     cartData.push(result?.data?._id);

//     localStorage.setItem('cartData', JSON.stringify(cartData))

    
//     Swal.fire({
//       title: "Done",
//       text: "Item added to cart",
//       icon: "success"
//     });
//     setAlertMessage('');
//     setShowAlert(false);
//     setUploadedPhotos([])
//   };

//   const visibleThumbnailCount = 5;
//   const visibleThumbnailUrls = thumbnailUrls.slice(
//     visibleStartIndex,
//     visibleStartIndex + Math.min(visibleThumbnailCount, thumbnailUrls.length)
//   );

//   const idMapping = {
//     fridgemagnets: 'fridge magnets',
//     pinbadges: 'pin badges',
//     savethedate: 'save the date'
//   };

//   const getAllCategory = async () => {
//     try {
//       const category = await getAllCategoryApi();
//       const backendCategoryName = idMapping[defaultCategory?.toLowerCase()];
//       const categoryData = category?.data?.data?.find(
//         (item) => item.name.toLowerCase() === backendCategoryName?.toLowerCase()
//       );

//       if (categoryData) {
//         setThumbnailUrls(categoryData?.products?.[0]?.image);
//         setProductDetails(categoryData?.products?.[0]);
//       }
//     } catch (error) {
//       console.error('Error fetching category data:', error);
//     }
//   };

//   useEffect(() => {
//     getAllCategory();
//   }, [defaultCategory]);

//   return (
//     <>
//       <Container className="mt-4 mb-5">
//         {showAlert && <Alert variant="danger">{alertMessage}</Alert>}
//         <Row>
//           <Col md={6}>
//             <div className="mb-4">
//               <Image
//                 src={`${ServerURL}/uploads/${thumbnailUrls[selectedThumbnailIndex]}`}
//                 fluid
//                 style={{ width: '100%' }}
//                 className="rounded shadow"
//               />
//             </div>
//             <div className="d-flex justify-content-between align-items-center">
//               <Button
//                 variant="outline-secondary"
//                 onClick={handleNextThumbnail}
//                 disabled={
//                   visibleStartIndex === thumbnailUrls.length - visibleThumbnailUrls.length
//                 }
//               >
//                 <i className="fa-solid fa-arrow-left"></i>
//               </Button>
//               <div className="d-flex overflow-hidden">
//                 <div className="d-flex flex-nowrap">
//                   {visibleThumbnailUrls.map((url, index) => (
//                     <Image
//                       key={visibleStartIndex + index}
//                       src={`${ServerURL}/uploads/${url}`}
//                       alt={`Thumbnail ${visibleStartIndex + index + 1}`}
//                       className={`img-thumbnail mx-1 ${
//                         visibleStartIndex + index === selectedThumbnailIndex
//                           ? 'border-primary'
//                           : ''
//                       }`}
//                       onClick={() => handleThumbnailClick(visibleStartIndex + index)}
//                       style={{ width: '60px', height: '60px', cursor: 'pointer' }}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <Button
//                 variant="outline-secondary"
//                 onClick={handlePrevThumbnail}
//                 disabled={visibleStartIndex === 0 && visibleThumbnailUrls.length === thumbnailUrls.length}
//               >
//                 <i className="fa-solid fa-arrow-right"></i>
//               </Button>
//             </div>
//           </Col>
//           <Col md={6}>
//             <h2 className="fw-bold">{productDetails.name}</h2>
//             <h4 className="text-danger">₹{getMaxPhotos(saveTheDateSize)===9?productDetails.type3:getMaxPhotos(saveTheDateSize)===6?productDetails.type2:productDetails.type1}</h4>

//             <h5>Select Size:</h5>
//             <div className="d-flex mb-3">
//               {['9 Images', '6 Images', '4 Images'].map((size) => (
//                 <Button
//                   key={size}
//                   variant={saveTheDateSize === size ? 'dark' : 'light'}
//                   className="mx-1"
//                   onClick={() => {
//                     setSaveTheDateSize(size);
//                     setUploadedPhotos([]);
//                   }}
//                 >
//                   {size}
//                 </Button>
//               ))}
//             </div>
//             <h5>Upload Photos:</h5>
//             <Row className="mb-3">
//               {uploadedPhotos.length > 0
//                 ? uploadedPhotos.map((photo, idx) => (
//                     <Col xs={4} className="mb-2" key={idx}>
//                       <div className="border p-1">
//                         <Image src={photo.url} fluid style={{ width: '100%', height: 'auto' }} />
//                       </div>
//                     </Col>
//                   ))
//                 : [...Array(getMaxPhotos())].map((_, idx) => (
//                     <Col xs={3} className="mb-2" key={idx}>
//                       <div className="border p-1">
//                         <Image src={uploadimg} style={{ width: '100%' }} fluid />
//                       </div>
//                     </Col>
//                   ))}
//             </Row>
//             <input
//               type="file"
//               multiple
//               onChange={handleFileUpload}
//               accept="image/*"
//               className="d-none"
//               id="file-upload"
//             />
//             <label htmlFor="file-upload" className="btn btn-outline-warning w-100 mb-2 text-dark rounded-pill">
//               Upload Photos
//             </label>
//             <Button
//               variant="warning"
//               className="w-100 rounded-pill"
//               onClick={handleAddToCart}
//             >
//               Add To Cart
//             </Button>
//           </Col>
//         </Row>
//         <Row>
//           <Review />
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default Product;
