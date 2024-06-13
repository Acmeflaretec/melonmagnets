import Box from 'components/Box'
import PropTypes from "prop-types";
import Typography from 'components/Typography'
import React from 'react'

const ImageList = ({ data }) => {
    console.log(data);
    const image = null
    const fileInputRef = React.useRef(null);
    const handleFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setData(prev => ({ ...prev, image: file }));
    };

    const handleChange = (e) => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    return (
        <Box
            sx={{
                width: 200,
                height: 110,
                cursor: "pointer",
                backgroundColor: "#D3D3D3",
                "&:hover": {
                    backgroundColor: "#424242",
                    opacity: [0.9, 0.8, 0.7],
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
            onClick={handleFileSelect}
        >
            {data ? (
                <img
                    style={{ width: 240, height: 192, padding: 22 }}
                    src={typeof (data) == 'object' ? URL.createObjectURL(data) : `${process.env.REACT_APP_API_URL}/uploads/${data}`}
                />
            ) : (
                <React.Fragment>
                    <svg
                        width="56"
                        height="56"
                        viewBox="0 0 56 56"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M20.9994 51.3346H34.9994C46.666 51.3346 51.3327 46.668 51.3327 35.0013V21.0013C51.3327 9.33464 46.666 4.66797 34.9994 4.66797H20.9994C9.33268 4.66797 4.66602 9.33464 4.66602 21.0013V35.0013C4.66602 46.668 9.33268 51.3346 20.9994 51.3346Z"
                            stroke="#CDCDCD"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M21.0007 23.3333C23.578 23.3333 25.6673 21.244 25.6673 18.6667C25.6673 16.0893 23.578 14 21.0007 14C18.4233 14 16.334 16.0893 16.334 18.6667C16.334 21.244 18.4233 23.3333 21.0007 23.3333Z"
                            stroke="#CDCDCD"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M6.23047 44.2186L17.7338 36.4953C19.5771 35.2586 22.2371 35.3986 23.8938 36.8219L24.6638 37.4986C26.4838 39.0619 29.4238 39.0619 31.2438 37.4986L40.9505 29.1686C42.7705 27.6053 45.7105 27.6053 47.5305 29.1686L51.3338 32.4353"
                            stroke="#CDCDCD"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <Typography sx={{ mt: 1, fontSize: 13 }}>
                        Upload Thumbnail
                    </Typography>
                </React.Fragment>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </Box>
    )
}
ImageList.propTypes = {
    data: PropTypes.string.isRequired,
  };
  
export default ImageList