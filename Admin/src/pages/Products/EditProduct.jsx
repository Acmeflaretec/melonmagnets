import { Button, Grid } from '@mui/material'
import Input from 'components/Input'
import PageLayout from 'layouts/PageLayout'
import React, { useEffect, useState } from 'react'
import Typography from 'components/Typography'
import toast from 'react-hot-toast'
import { useGetProductById } from 'queries/ProductQuery'
import { useParams, useNavigate } from 'react-router-dom'
import ImageList from './ImageList'
import { useUpdateProduct, useDeleteProduct } from 'queries/ProductQuery'

const EditProduct = () => {
   const { id } = useParams()
   const [details, setDetails] = useState({})
   const [priceChecking,setPriceChecking] = useState(false)
   const { data, isLoading } = useGetProductById({ id });
   const { mutateAsync: deleteProduct, isLoading: deleting } = useDeleteProduct()
   const navigate = useNavigate()

   useEffect(() => {
      setDetails(data?.data)
      if(data?.data.price){
         setPriceChecking(true)
      }
      
   }, [data])
   const { mutateAsync: updateProduct, isLoading: loading } = useUpdateProduct()
   const handleChange = (e) => {
      setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const handleSubmit = () => {
      try {
         if (!details?.name) {
           return toast.error("name is required")
         }
         if (!details?.subheading) {
           return toast.error("subheading is required")
         }
         if (!details?.brand) {
           return toast.error("brand name is required")
         }
         if (!details?.stock) {
           return toast.error("stock is required")
         }
         if (!details?.description) {
           return toast.error("description is required")
         }
         if (!details?.image) {
           return toast.error("image is required")
         }
         const formData = new FormData();

         const image = details?.image?.filter((image) => typeof (image) === 'string');
         console.log(image);
         formData.append('image', JSON.stringify(image));
         details?.image?.forEach((image) => {
            if (typeof (image) == 'object') {
               formData.append('images', image, image.name);
               console.log(image);
            }
         });
         for (const key in details) {
            if (details.hasOwnProperty(key) && key !== "image") {
               formData.append(key, details[key]);
            }
         }

         updateProduct(formData)
            .then((res) => {
               if (res) {
                  toast.success(res?.message ?? "product updated successfully");
                  navigate('/products')
               }
            })
            .catch((err) => {
               toast.error(err?.message ?? "Something went wrong");
            });
      } catch (error) {
         console.error(error)
      }
   }

   const handleDelete = () => {
      deleteProduct(details)
         .then((res) => {
            if (res) {
               navigate('/products')
               toast.success(res?.message ?? "products deleted Successfully");
            }
         })
         .catch((err) => {
            toast.error(err?.message ?? "Something went wrong");
         });
   };

   return (
      <PageLayout
         title={'Edit Product'}
      >
         {isLoading ? <Typography fontSize={14} sx={{ paddingX: 5 }}>loading...</Typography> :
            <Grid container spacing={5} display={'flex'} direction={'row'} p={8} >
               <Grid item container spacing={2} xs={12} sm={12} md={6} py={5}>
                  <Grid item xs={12} sm={12} md={6}>
                     <Input
                        required
                        placeholder="Item name"
                        id="name"
                        name="name"
                        value={details?.name || ''}
                        onChange={handleChange}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Input
                        placeholder="Brand name"
                        name="brand"
                        value={details?.brand || ''}
                        onChange={handleChange}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <Input
                        required
                        placeholder="Item subheading"
                        id="subheading"
                        name="subheading"
                        value={details?.subheading || ''}
                        onChange={handleChange}
                     />
                  </Grid>

                  <Grid item xs={12} sm={8}>
                     <Input
                        required
                        disabled
                        placeholder="Category"
                        id="Category"
                        name="Category"
                        value={details?.category?.name || ''}
                     />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                     <Input
                        placeholder="Enter Quantity"
                        name="stock"
                        value={details?.stock || ''}
                        onChange={handleChange}
                     />
                  </Grid>
                  {/* {details?.price ? ( */}
                  {priceChecking ? (
                     <>
                        <Grid item xs={12} sm={4}>
                           <Input
                              placeholder="MRP (Maximum Retail Price)"
                              name="price"
                              value={details?.price || ''}
                              onChange={handleChange}
                           />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                           <Input
                              placeholder="Enter Sale Rate"
                              name="sale_rate"
                              value={details?.sale_rate || ''}
                              onChange={handleChange}
                           />
                        </Grid>
                     </>
                  ) : (
                     <>
                        <Grid xs={12} pl={3} pt={2}>
                           <Typography variant="body2">Variations</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                           <Input
                              placeholder="4 piece MRP"
                              name="type1"
                              value={details?.type1 || ''}
                              onChange={handleChange}
                           />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                           <Input
                              placeholder="6 piece MRP"
                              name="type2"
                              value={details?.type2 || ''}
                              onChange={handleChange}
                           />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                           <Input
                              placeholder="9 piece MRP"
                              name="type3"
                              value={details?.type3 || ''}
                              onChange={handleChange}
                           />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                           <Input
                              placeholder="Sale Rate 4pcs"
                              name="sale1"
                              value={details?.sale1 || ''}
                              onChange={handleChange}
                           />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                           <Input
                              placeholder="Sale Rate 6pcs"
                              name="sale2"
                              value={details?.sale2 || ''}
                              onChange={handleChange}
                           />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                           <Input
                              placeholder="Sale Rate 9pcs"
                              name="sale3"
                              value={details?.sale3 || ''}
                              onChange={handleChange}
                           />
                        </Grid>
                     </>
                  )}
                  <Grid item xs={12}>
                     <Input
                        id="description"
                        placeholder="Product Description"
                        name="description"
                        value={details?.description || ''}
                        onChange={handleChange}
                        multiline
                        rows={5}
                     />
                  </Grid>
                  <Grid item xs={12} mt={'auto'}>
                     <Grid item xs={12}>
                        <Button color='primary' onClick={handleSubmit}>UPDATE PRODUCT</Button>
                        <Button color="secondary" onClick={handleDelete}>DELETE PRODUCT</Button>
                     </Grid>
                  </Grid>
               </Grid>
               <Grid item container spacing={2} xs={12} sm={12} md={6}>
                  <Grid sx={{ width: '100%' }}>
                     <ImageList data={details?.image} dispatch={setDetails} />
                  </Grid>
               </Grid>
            </Grid>}
      </PageLayout>
   )
}

export default EditProduct