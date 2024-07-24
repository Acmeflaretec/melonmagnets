// import React, { useState, useEffect } from 'react';
// import { getCouponsApi, validateCouponApi } from '../services/allApi';
// import Swal from 'sweetalert2';

// const Coupon = ({ setDiscount, setDiscountCode }) => {
//     const [coupons, setCoupons] = useState([]);
//     const [selectedCoupon, setSelectedCoupon] = useState('');
//     const [discount, setDiscountAmount] = useState(0);

//     useEffect(() => {
//         const fetchCoupons = async () => {
//             const result = await getCouponsApi();
//             if (result.status === 200) {
//                 setCoupons(result.data.filter(coupon => coupon.status));
//             }
//         };

//         fetchCoupons();
//     }, []);

//     const handleApplyCoupon = async () => {
//         if (!selectedCoupon) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Validation Error',
//                 text: 'Please select a coupon.',
//             });
//             return;
//         }

//         const result = await validateCouponApi(selectedCoupon);
//         if (result.status === 200 && result.data.valid) {
//             setDiscount(result.data.discount);
//             setDiscountCode(selectedCoupon);
//             setDiscountAmount(result.data.discount);
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Coupon Applied',
//                 text: `Coupon applied successfully! You got a discount of ₹${result.data.discount}.`,
//             });
//         } else {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Invalid Coupon',
//                 text: result.data.message || 'The coupon is invalid or expired.',
//             });
//         }
//     };

//     return (
//         <div className="mb-4">
//             <label htmlFor="discountCode" className="form-label">
//                 Discount code
//             </label>
//             <div className="input-group">
//                 <select
//                     className="form-select"
//                     id="discountCode"
//                     value={selectedCoupon}
//                     onChange={(e) => setSelectedCoupon(e.target.value)}
//                 >
//                     <option value="">Select a coupon</option>
//                     {coupons.map((coupon) => (
//                         <option key={coupon._id} value={coupon.code}>
//                             <div>
//                                 <div style={{ display: 'flex', justifyContent: 'space-between  ' }}>
//                                     <span>{coupon.name}</span> <span>{coupon.discount}%</span>
//                                 </div>
//                                 <div>{coupon.code}</div>
//                             </div>
//                         </option>
//                     ))}
//                 </select>
//                 <button className="btn btn-warning" type="button" onClick={handleApplyCoupon}>
//                     Apply
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Coupon;

import React, { useState, useEffect } from 'react';
import { getCouponsApi, validateCouponApi } from '../services/allApi';
import { 
  Button, Typography, Box, Card, CardContent, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, Divider, Snackbar, IconButton,
  Grid, Avatar, CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';
import { FaTag, FaPercent, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { ServerURL } from '../services/baseUrl';

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
}));

const CouponImage = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  marginRight: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Coupon = ({ setDiscount, setDiscountCode, userId ,subtotal }) => {
    console.log('subtotal2',subtotal);
    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const result = await getCouponsApi();
            if (result.status === 200) {
                setCoupons(result.data.filter(coupon => coupon.status));
            }
        } catch (error) {
            showSnackbar('Failed to fetch coupons. Please try again.', 'error');
        }
        setLoading(false);
    };

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleSelectCoupon = (coupon) => {
        setSelectedCoupon(coupon);
        handleCloseDialog();
        handleApplyCoupon(coupon);
    };

    const handleApplyCoupon = async (coupon) => {
        setLoading(true);
        try {
            const result = await validateCouponApi(coupon._id, userId,subtotal);
            if (result.status === 200 && result.data.valid) {
                setDiscount(coupon.discount);
                setDiscountCode(coupon);
                showSnackbar(`Coupon applied! You get ${coupon.discount}% off.`, 'success');
            } else {
                showSnackbar(result.data.message || 'The coupon is invalid or expired.', 'error');
            }
        } catch (error) {
            showSnackbar('Failed to apply coupon. Please try again.', 'error');
        }
        setLoading(false);
    };

    const handleRemoveCoupon = () => {
        setSelectedCoupon(null);
        setDiscount(0);
        setDiscountCode(null);
        showSnackbar('Coupon removed successfully.', 'info');
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <StyledCard 
                onClick={handleOpenDialog}
                elevation={selectedCoupon ? 4 : 1}
            >
                <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                            <FaTag size={24} color="#FFB22C" style={{ marginRight: 16 }} />
                            <Typography variant="h6" component="div">
                                {selectedCoupon ? (
                                    <>
                                        <div className="fw-bold">{selectedCoupon.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'green' }}>
                                            {`save ${selectedCoupon.discount}% on this order`}
                                        </div>
                                    </>
                                ) : (
                                    'Apply coupon'
                                )}
                            </Typography>




                        </Box>
                        {selectedCoupon && (
                            <IconButton 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveCoupon();
                                }}
                                size="small"
                                color="error"
                            >
                                <FaTimes />
                            </IconButton>
                        )}
                    </Box>
                </CardContent>
            </StyledCard>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Typography variant="h5" component="div" fontWeight="bold">
                        Select a Coupon
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {loading ? (
                        <Box display="flex" justifyContent="center" my={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List>
                            {coupons.map((coupon, index) => (
                                <React.Fragment key={coupon._id}>
                                    <StyledListItem 
                                        button 
                                        onClick={() => handleSelectCoupon(coupon)}
                                        disabled={loading}
                                    >
                                        <Grid container alignItems="center" spacing={2}>
                                            {/* <Grid item>
                                                <CouponImage src={`${ServerURL}/uploads/${coupon.image}` || 'default-coupon-image.jpg'} alt={coupon.name}>
                                                    <FaPercent />
                                                </CouponImage>
                                            </Grid> */}
                                            <Grid item xs>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="h6" style={{color:'#FFB22C'}} fontWeight="bold">
                                                            {coupon.discount}% OFF
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body1" color="textPrimary">
                                                                {coupon.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Code: {coupon.code}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                            </Grid>
                                            <Grid item>
                                                <IconButton style={{color:'#FFB22C'}}>
                                                    <FaCheckCircle />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </StyledListItem>
                                    {index < coupons.length - 1 && <Divider variant="fullWidth" component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} style={{color:'red'}} variant="outlined">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert 
                    elevation={6} 
                    variant="filled" 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
        </>
    );
};

export default Coupon;