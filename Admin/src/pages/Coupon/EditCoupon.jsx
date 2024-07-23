 
import { Box, Button, Grid, Typography } from "@mui/material";
import Input from 'components/Input';
import PageLayout from 'layouts/PageLayout';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useGetCouponById, useUpdateCoupon,useDeletecoupons } from 'queries/ProductQuery';
import { useParams } from 'react-router-dom';
// import { DesktopDatePicker } from '@mui/x-date-pickers';
import { useNavigate  } from 'react-router-dom';


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

   const fileInputRef = React.useRef(null);
   const handleFileSelect = () => {
      fileInputRef.current.click();
   };

   const handleFileChange = (event) => {
      const file = event.target.files[0];
      setDetails(prev => ({ ...prev, image: file }));
   };

   const handleSubmit = () => {
      try {
         const formData = new FormData();
         for (const key in details) {
            if (details.hasOwnProperty(key) && key !== "image") {
               formData.append(key, details[key]);
            }
         }
         if (typeof details.image === 'object') {
            formData.append("image", details.image, details.image.name);
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
                  <Grid item xs={12}>
                     <Input
                        id="description"
                        placeholder="Description"
                        name="description"
                        value={details?.description || ''}
                        onChange={handleChange}
                        multiline
                        rows={5}
                     />
                  </Grid>
                  <Grid item xs={12}>
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
                        {details?.image ? (
                           <img
                              style={{ width: 240, height: 192, padding: 22 }}
                              src={typeof details?.image === 'object' ? URL.createObjectURL(details.image) : `${process.env.REACT_APP_API_URL}/uploads/${details?.image}`}
                           />
                        ) : (
                           <>
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
                           </>
                        )}
                        <input
                           ref={fileInputRef}
                           type="file"
                           accept="image/*"
                           style={{ display: "none" }}
                           onChange={handleFileChange}
                        />
                     </Box>
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
