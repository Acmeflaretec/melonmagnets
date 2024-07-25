
import { Box, Button, Grid, Typography } from "@mui/material";
import Input from 'components/Input';
import PageLayout from 'layouts/PageLayout';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useGetCouponById, useUpdateCoupon, useDeletecoupons } from 'queries/ProductQuery';
import { useParams } from 'react-router-dom';
// import { DesktopDatePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';


const EditCoupon = () => {
   const { id } = useParams();
   const [details, setDetails] = useState({});
   const { data: res, isLoading } = useGetCouponById({ id });
   const navigate = useNavigate();

   useEffect(() => {
      if (res?.data) {
         setDetails(res.data);
         console.log(res.data)
      }
   }, [res]);

   const { mutateAsync: updateCoupon, isLoading: loading } = useUpdateCoupon();
   const { mutateAsync: deletecoupons, isLoading: deleting } = useDeletecoupons()

   const handleChange = (e) => {
      setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   // const fileInputRef = React.useRef(null);

   const handleSubmit = () => {
      try {
         const formData = new FormData();
         for (const key in details) {
            if (details.hasOwnProperty(key)) {
               formData.append(key, details[key]);
            }
         }

         updateCoupon(formData)
            .then((res) => {
               if (res) {
                  toast.success(res?.message ?? "Coupon updated successfully");
                  navigate('/coupons')
               }
            })
            .catch((err) => {
               toast.error(err?.message ?? "Something went wrong");
            });
      } catch (error) {
         console.error(error);
      }
   };

   const handleDelete = () => {
      deletecoupons(details)
         .then((res) => {
            if (res) {
               navigate('/coupons')
               toast.success(res?.message ?? "coupon deleted Successfully");
            }
         })
         .catch((err) => {
            toast.error(err?.message ?? "Something went wrong");
         });
   };



   return (
      <PageLayout title={'Edit Coupon'}>
         {isLoading ? (
            <Typography fontSize={14} sx={{ paddingX: 5 }}>Loading...</Typography>
         ) : (
            <Grid container spacing={5} display={'flex'} direction={'row'} p={8}>
               <Grid item container spacing={2} xs={12} sm={12} md={6} py={5}>
                  <Grid item xs={12} sm={6}>
                     <Input
                        required
                        placeholder="Coupon name"
                        id="name"
                        name="name"
                        value={details?.name || ''}
                        onChange={handleChange}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Input
                        required
                        type='number'
                        placeholder="Discount Percentage"
                        id="discount"
                        name="discount"
                        value={details?.discount || ''}
                        onChange={handleChange}
                     />
                  </Grid>
                  {/* <Grid item xs={12} sm={12}>
                     <DesktopDatePicker
                        label="Validity Date"
                        inputFormat="MM/DD/YYYY"
                        value={details?.validity || null}
                        onChange={(date) => setDetails(prev => ({ ...prev, validity: date }))}
                        renderInput={(params) => <Input {...params} />}
                     />
                  </Grid> */}

                  <Grid item xs={12} sm={12}>
                     <Input
                        placeholder="validity"
                        type='date'
                        name="validity"
                        value={details?.validity || ''}
                        onChange={handleChange}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Input
                        type='number'
                        required
                        placeholder="Minimum Value"
                        id="minValue"
                        name="minValue"
                        label="Minimum Value"
                        value={details?.minValue || ''}
                        onChange={handleChange}
                        fullWidth
                        autoComplete="minValue"
                        variant="outlined"
                     />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                     <Input
                        type='number'
                        required
                        placeholder="Maximum Value"
                        id="maxValue"
                        name="maxValue"
                        label="Maximum Value"
                        value={details?.maxValue || ''}
                        onChange={handleChange}
                        fullWidth
                        autoComplete="maxValue"
                        variant="outlined"
                     />
                  </Grid>

                  <Grid item xs={12} sm={12} mt={'auto'}>
                     <Button onClick={handleSubmit} disabled={loading}>UPDATE COUPON</Button>
                     <Button color="secondary" onClick={handleDelete}>DELETE COUPON</Button>

                  </Grid>
               </Grid>
            </Grid>
         )}
      </PageLayout>
   );
};

export default EditCoupon;
