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
import Swal from 'sweetalert2';
import { Select, MenuItem, Button, Typography, FormControl, InputLabel, Grid } from '@mui/material';

const Coupon = ({ setDiscount, setDiscountCode,userId }) => {
    
    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState('');

    useEffect(() => {
        const fetchCoupons = async () => {
            const result = await getCouponsApi();
            if (result.status === 200) {
                setCoupons(result.data.filter(coupon => coupon.status));
            }
        };

        fetchCoupons();
    }, []);

    const valueSetting = (e)=>{
        setSelectedCoupon(e.target.value)
    }

    const handleApplyCoupon = async () => {
        if (!selectedCoupon.code) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please select a coupon.',
            });
            return;
        }

        const result = await validateCouponApi(selectedCoupon._id,userId);
        if (result.status === 200 && result.data.valid) {
            setDiscount(result.data.discount);
            setDiscountCode(selectedCoupon);
            Swal.fire({
                icon: 'success',
                title: 'Coupon Applied',
                text: `Coupon applied successfully! You got a discount of ₹${result.data.discount}.`,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Coupon',
                text: result.data.message || 'The coupon is invalid or expired.',
            });
        }
    };

    return (
        <div className="mb-4">
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={8} >
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="discountCode-label">Discount code</InputLabel>
                        <Select
                            labelId="discountCode-label"
                            id="discountCode"
                            value={selectedCoupon.code}
                            // onChange={(e) => setSelectedCoupon(e.target.value)}
                            onChange={valueSetting}
                            label="Discount code"
                        >
                            <MenuItem value="">
                                <em>Select a coupon</em>
                            </MenuItem>
                            {coupons.map((coupon) => (
                                <MenuItem key={coupon._id} value={coupon}>
                                    <div>
                                        <Typography variant="body1" display="flex" justifyContent="space-between">
                                            <span>{coupon.name}</span> - <span>{coupon.discount}%</span>
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {coupon.code}
                                        </Typography>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} >
                    <Button
                    style={{height:50,backgroundColor:'#ffc107'}}
                        variant="contained"
                        // color="warning"
                        fullWidth
                        onClick={handleApplyCoupon}
                    >
                        Apply
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default Coupon;
