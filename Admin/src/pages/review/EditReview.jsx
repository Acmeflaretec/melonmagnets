import { useGetReviewById, useEditReview, useDeleteReview } from 'queries/OrderQuery';
// import Details from './Details';
import { Alert, Box, Button, Grid, ToggleButton, Typography } from "@mui/material";
import React, { useEffect, useState } from 'react'
import PageLayout from 'layouts/PageLayout';
import toast from "react-hot-toast";
// import Input from "components/Input";
import { useNavigate, useParams } from "react-router-dom";
// import { useUpdateProduct } from 'queries/ProductQuery'
import './review.css'

const EditReview = () => {
   const { id } = useParams();
   const [data, setData] = useState({})
   const navigate = useNavigate()
   const { data: res, isLoading } = useGetReviewById({ id });
   useEffect(() => {
      setData(res?.data)
   }, [res])

   const fileInputRef = React.useRef(null);
   // const handleFileSelect = () => {
   //    fileInputRef.current.click();
   // };

   // const handleFileChange = (event) => {
   //    const file = event.target.files[0];
   //    setData(prev => ({ ...prev, image: file }));
   // };

   // const handleChange = (e) => {
   //    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
   // };
   const { mutateAsync: editReview, isLoading: updating } = useEditReview()
   const { mutateAsync: deleteReview, isLoading: deleting } = useDeleteReview()

   const handleDelete = () => {
      deleteReview(data)
         .then((res) => {
            if (res) {
               toast.success(res?.message ?? "review deleted Successfully");
               navigate('/review')
            }
         })
         .catch((err) => {
            toast.error(err?.message ?? "Something went wrong");
         });
   };
   const handleSubmit = () => {
      try {
         const formData = new FormData();
         for (const key in data) {
            if (data.hasOwnProperty(key) && key !== "image") {
               formData.append(key, data[key]);
            }
         }

         editReview(formData)
            .then((res) => {
               if (res) {
                  toast.success(res?.message ?? "review edited Successfully");
                  navigate('/review')
               }
            })
            .catch((err) => {
               toast.error(err?.message ?? "Something went wrong");
            });

      } catch (error) {
         console.error(error)
      }
   }


   return (
      <PageLayout
         title={'Review Details'}
      >
         <Box sx={{ flexGrow: 1 }} display={'flex'} justifyContent={'center'}>
            <Grid container spacing={2} maxWidth={600} py={5}>
               <Grid item xs={12} sm={6}>
                  <Typography variant="caption">
                     Change Status &nbsp;
                  </Typography>
                  <ToggleButton
                     value={data?.approved}
                     selected={data?.approved}
                     // onChange={() => {
                     //    setData(prev => ({ ...prev, status: !data?.status }))
                     // }}
                     onClick={handleSubmit}
                  >
                     {data?.approved ? 'approved' : 'not-approved'}
                  </ToggleButton>
               </Grid>
               <Grid item xs={12}>
                  {/* <Button onClick={handleSubmit}>Update Blog</Button> */}
                  <Button color="secondary" onClick={handleDelete}>Delete Review</Button>
               </Grid>
            </Grid>
         </Box>
            <Grid style={{margin:'50px'}}>
            {data?.image && data.image.length > 0 && (
                    <div className="review-images">
                      {data.image.map((img, index) => (
                        <img key={index} src={`${process.env.REACT_APP_API_URL}/uploads/${img}`} alt={`Review ${index}`} />
                      ))}
                    </div>
                  )}
            </Grid>
      </PageLayout>
   )
}


export default EditReview;