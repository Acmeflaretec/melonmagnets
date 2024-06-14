import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Image, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import uploadimg from '../assets/img/upload.png';
import { addToCartApi, getAllCategoryApi } from '../services/allApi';
import { ServerURL } from '../services/baseUrl';
import Review from './Review';
import Swal from 'sweetalert2';

const Product = () => {
  const { id } = useParams();
  const defaultCategory = id ? id : "fridgemagnets";
  const [saveTheDateSize, setSaveTheDateSize] = useState('4 Images');
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [image, setImage] = useState([]);
  const [selectedImageFilenames, setSelectedImageFilenames] = useState([]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const uploadedFiles = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({ url: URL.createObjectURL(file), file: file }));

    const maxPhotos = getMaxPhotos();
    const selectedFiles = uploadedFiles.slice(0, maxPhotos);

    setUploadedPhotos((prevPhotos) => [...prevPhotos, ...selectedFiles]);
    setSelectedImageFilenames(selectedFiles.map((file) => file.file));
    setImage(files);
  };


  const handleThumbnailClick = (index) => {
    setSelectedThumbnailIndex(index);
  };

  const handlePrevThumbnail = () => {
    setVisibleStartIndex((prevIndex) =>
      prevIndex === 0 ? thumbnailUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextThumbnail = () => {
    setVisibleStartIndex((prevIndex) =>
      prevIndex === thumbnailUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

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

  const handleAddToCart = async() => {
    const requiredPhotos = getMaxPhotos();
    if (uploadedPhotos.length !== requiredPhotos) {
      setAlertMessage(`Please upload exactly ${requiredPhotos} images.`);
      setShowAlert(true);
      return;
    }
    setAlertMessage('');
    setShowAlert(false);

    const reqBody = new FormData()
    reqBody.append('productId',productDetails._id)
    reqBody.append('quantity',1)
    reqBody.append('price',getMaxPhotos(saveTheDateSize)===9?productDetails.type3:getMaxPhotos(saveTheDateSize)===6?productDetails.type2:productDetails.type1)
    // reqBody.append('image', image, image.name);

    // uploadedPhotos.file?.map((item) => {
    //   console.log(item);
    //   reqBody.append('images', item, item.name);
    // });

    Array.from(image).forEach((file) => {
      reqBody.append('images', file);
    });

    const reqHeader ={
      "Content-Type":"multipart/form-data"
    }

    const result = await addToCartApi(reqBody,reqHeader)
    console.log(result);
    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];

    cartData.push(result?.data?._id);

    localStorage.setItem('cartData', JSON.stringify(cartData))

    
    Swal.fire({
      title: "Done",
      text: "Item added to cart",
      icon: "success"
    });
    setAlertMessage('');
    setShowAlert(false);
    setUploadedPhotos([])
  };

  const visibleThumbnailCount = 5;
  const visibleThumbnailUrls = thumbnailUrls.slice(
    visibleStartIndex,
    visibleStartIndex + Math.min(visibleThumbnailCount, thumbnailUrls.length)
  );

  const idMapping = {
    fridgemagnets: 'fridge magnets',
    pinbadges: 'pin badges',
    thinmagnets: 'thin magnets'
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
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, [defaultCategory]);

  return (
    <>
      <Container className="mt-4 mb-5">
        {showAlert && <Alert variant="danger">{alertMessage}</Alert>}
        <Row>
          <Col md={6}>
            <div className="mb-4">
              <Image
                src={`${ServerURL}/uploads/${thumbnailUrls[selectedThumbnailIndex]}`}
                fluid
                style={{ width: '100%' }}
                className="rounded shadow"
              />
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Button
                variant="outline-secondary"
                onClick={handleNextThumbnail}
                disabled={
                  visibleStartIndex === thumbnailUrls.length - visibleThumbnailUrls.length
                }
              >
                <i className="fa-solid fa-arrow-left"></i>
              </Button>
              <div className="d-flex overflow-hidden">
                <div className="d-flex flex-nowrap">
                  {visibleThumbnailUrls.map((url, index) => (
                    <Image
                      key={visibleStartIndex + index}
                      src={`${ServerURL}/uploads/${url}`}
                      alt={`Thumbnail ${visibleStartIndex + index + 1}`}
                      className={`img-thumbnail mx-1 ${
                        visibleStartIndex + index === selectedThumbnailIndex
                          ? 'border-primary'
                          : ''
                      }`}
                      onClick={() => handleThumbnailClick(visibleStartIndex + index)}
                      style={{ width: '60px', height: '60px', cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>
              <Button
                variant="outline-secondary"
                onClick={handlePrevThumbnail}
                disabled={visibleStartIndex === 0 && visibleThumbnailUrls.length === thumbnailUrls.length}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </Button>
            </div>
          </Col>
          <Col md={6}>
            <h2 className="fw-bold">{productDetails.name}</h2>
            <h4 className="text-danger">₹{getMaxPhotos(saveTheDateSize)===9?productDetails.type3:getMaxPhotos(saveTheDateSize)===6?productDetails.type2:productDetails.type1}</h4>

            <h5>Select Size:</h5>
            <div className="d-flex mb-3">
              {['9 Images', '6 Images', '4 Images'].map((size) => (
                <Button
                  key={size}
                  variant={saveTheDateSize === size ? 'dark' : 'light'}
                  className="mx-1"
                  onClick={() => {
                    setSaveTheDateSize(size);
                    setUploadedPhotos([]);
                  }}
                >
                  {size}
                </Button>
              ))}
            </div>
            <h5>Upload Photos:</h5>
            <Row className="mb-3">
              {uploadedPhotos.length > 0
                ? uploadedPhotos.map((photo, idx) => (
                    <Col xs={4} className="mb-2" key={idx}>
                      <div className="border p-1">
                        <Image src={photo.url} fluid style={{ width: '100%', height: 'auto' }} />
                      </div>
                    </Col>
                  ))
                : [...Array(getMaxPhotos())].map((_, idx) => (
                    <Col xs={3} className="mb-2" key={idx}>
                      <div className="border p-1">
                        <Image src={uploadimg} style={{ width: '100%' }} fluid />
                      </div>
                    </Col>
                  ))}
            </Row>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              accept="image/*"
              className="d-none"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="btn btn-outline-warning w-100 mb-2 text-dark rounded-pill">
              Upload Photos
            </label>
            <Button
              variant="warning"
              className="w-100 rounded-pill"
              onClick={handleAddToCart}
            >
              Add To Cart
            </Button>
          </Col>
        </Row>
        <Row>
          <Review />
        </Row>
      </Container>
    </>
  );
};

export default Product;
