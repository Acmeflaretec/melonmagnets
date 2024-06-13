import { Autocomplete, Button, Grid, TextField } from '@mui/material'
import Box from 'components/Box'
import Input from 'components/Input'
import PageLayout from 'layouts/PageLayout'
import React, { useEffect, useState } from 'react'
import DropZone from './Dropzone'
import { useGetCategory } from 'queries/ProductQuery'
import Typography from 'components/Typography'
import { useAddProduct } from 'queries/ProductQuery'
import toast from 'react-hot-toast'
import { useGetProductById } from 'queries/ProductQuery'
import { useParams } from 'react-router-dom'
import ImageList from './ImageList'

const EditProduct = () => {
    const { id } = useParams()
    const [details, setDetails] = useState({})
    const { data, isLoading } = useGetProductById({ id });
    // const { data, isLoading } = useGet({ id });
    useEffect(() => {
        setDetails(data?.data)
        console.log(data);
    }, [data])
    const { mutateAsync: AddProduct, isLoading: loading } = useAddProduct()
    const [error, setError] = useState({})
    const [images, setImage] = useState([])
    const handleChange = (e) => {
        setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const [category, setCategory] = useState()
    useEffect(() => {
        console.log(category);
    }, [category])
    const handleSubmit = () => {
        console.log(details);
        console.log(images);
        try {
            // if (!details?.name) {
            //   return toast.error("name is required")
            // }
            // if (!details?.desc) {
            //   return toast.error("description is required")
            // }
            // if (!details?.image) {
            //   return toast.error("image is required")
            // }
            const formData = new FormData();
            images?.forEach((image) => {
                formData.append('images', image, image.name);
            });
            for (const key in details) {
                if (details.hasOwnProperty(key) && key !== "image") {
                    formData.append(key, details[key]);
                }
            }
            formData.append('category', category?._id);
            // typeof (details.image) == 'object' && formData.append("image", details.image, details?.image?.name);
            AddProduct(formData)
                .then((res) => {
                    toast.success(res?.message ?? "category added");
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
            title={'Add Product'}
        >
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
                            placeholder="Discount (%)"
                            name="discount"
                            value={details?.discount || ''}
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
                    <Grid xs={12} pl={3} pt={2}>
                        <Typography variant="body2">variations</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Input
                            placeholder="4 piece"
                            name="four"
                            value={details?.type1 || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Input
                            placeholder="6 piece"
                            name="six"
                            value={details?.type2 || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Input
                            placeholder="9 piece"
                            name="nine"
                            value={details?.type3 || ''}
                            onChange={handleChange}
                        />
                    </Grid>
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
                </Grid>
                <Grid item container spacing={2} xs={12} sm={12} md={6} py={5}>
                    <Grid item xs={12} >
                        {console.log(details?.image)}
                        {details?.image?.map((x, index) => <ImageList key={index} data={x} />)}
                    </Grid>
                    <Grid item xs={12} sm={8}></Grid>
                    <Grid item xs={12} sm={4} mt={'auto'}>
                        <Grid item xs={12}>
                            <Button onClick={handleSubmit}>Update Product</Button>
                            {/* <Button color="secondary" onClick={handleDelete}>Delete Blog</Button> */}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </PageLayout>
    )
}

export default EditProduct