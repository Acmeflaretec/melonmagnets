import React, { useState, useEffect } from 'react';
import { getCouponsApi, validateCouponApi } from '../services/allApi';
import { 
  Button, Typography, Box, Card, CardContent, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, Divider, Snackbar, IconButton,
  Grid, Avatar, CircularProgress, useMediaQuery, useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';
import { FaTag, FaPercent, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { ServerURL } from '../services/baseUrl';

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

const CouponImage = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  marginRight: theme.spacing(2),
  boxShadow: theme.shadows[2],
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  padding: theme.spacing(2),
}));

const Coupon = ({ setDiscount, setDiscountCode, userId, subtotal }) => {
    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            const result = await validateCouponApi(coupon._id, userId, subtotal);
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

    const handleRemoveCoupon = (e) => {
        e.stopPropagation();
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
            <StyledCard onClick={handleOpenDialog} elevation={selectedCoupon ? 4 : 1}>
                <CardContent style={{ padding: 0 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                            <FaTag size={24} color="#FFB22C" style={{ marginRight: 16 }} />
                            <Box>
                                <Typography variant="subtitle1" component="div" fontWeight="bold">
                                    {selectedCoupon ? selectedCoupon.name : 'Apply coupon'}
                                </Typography>
                                {selectedCoupon && (
                                    <Typography variant="body2" color="success.main">
                                        Save {selectedCoupon.discount}% on this order
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        {selectedCoupon && (
                            <IconButton 
                                onClick={handleRemoveCoupon}
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
                    <Typography variant="h6" component="div" fontWeight="bold">
                        Select a Coupon
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    {loading ? (
                        <Box display="flex" justifyContent="center" my={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List disablePadding>
                            {coupons.map((coupon, index) => (
                                <React.Fragment key={coupon._id}>
                                    <StyledListItem 
                                        button 
                                        onClick={() => handleSelectCoupon(coupon)}
                                        disabled={loading}
                                    >
                                        <Grid container alignItems="center" spacing={2}>
                                            <Grid item>
                                                {/* <CouponImage style={{backgroundColor: '#FFB22C'}}>
                                                    <FaPercent />
                                                </CouponImage> */}
                                            </Grid>
                                            <Grid item xs>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="h6" color="primary" fontWeight="bold">
                                                            {coupon.discount}% OFF
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body1" color="textPrimary">
                                                                {coupon.name}
                                                            </Typography>
                                                            {/* <Typography variant="body2" color="textSecondary">
                                                                Code: {coupon.code}
                                                            </Typography> */}
                                                        </>
                                                    }
                                                />
                                            </Grid>
                                            <Grid item>
                                                <IconButton color="primary">
                                                    <FaCheckCircle />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </StyledListItem>
                                    {index < coupons.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="error" variant="outlined">
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