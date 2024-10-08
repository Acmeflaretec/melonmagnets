// import PageLayout from 'layouts/PageLayout';
// import { useGetOrderById } from 'queries/OrderQuery';
// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom';
// import Details from './Details';
// import { Avatar, Button, Grid, Link, Typography } from '@mui/material';
// import JSZip from 'jszip';
// import { saveAs } from 'file-saver';

// const EditOrder = () => {
//     const { id } = useParams()
//     const [details, setDetails] = useState({})
//     const { data, isLoading } = useGetOrderById({ id });
//     useEffect(() => {
//         setDetails(data?.data)
//         console.log(data);
//     }, [data])

//     const downloadImages = async (images) => {
//         const zip = new JSZip();
//         const imageFolder = zip.folder("images");

//         for (const imageUrl of images) {
//             const response = await fetch(imageUrl);
//             const blob = await response.blob();
//             const fileName = imageUrl.split('/').pop();
//             imageFolder.file(fileName, blob);
//         }

//         zip.generateAsync({ type: "blob" })
//             .then(content => {
//                 saveAs(content, "images.zip");
//             });
//     };
//     return (
//         <PageLayout
//             title={'Order Details'}
//         >
//             {isLoading ? <Typography fontSize={14} sx={{paddingX:5}}>loading...</Typography>:
//             <Grid container spacing={5} display={'flex'} direction={'row'} p={8} justifyContent={'center'}>
//                 <Grid item container alignContent={'start'} width={'100%'} xs={12} sm={12} md={7} lg={5} spacing={3}>
//                     {details?.products?.map(item => (
//                         <Grid item container key={item?._id} xs={12} mb={2}
//                             sx={{
//                                 position: 'relative',
//                                 display: "flex",
//                                 alignItems: "center",
//                                 borderRadius: '15px',
//                                 border: 'solid 1px #D3D3D3'
//                             }}>
//                             <Grid p={1}>
//                                 <img style={{ width: 120, height: 100, borderRadius: '20px', border: 'solid 1px #D3D3D3' }}
//                                     src={`${process.env.REACT_APP_API_URL}/uploads/${item?.productId?.image[0]}`} />
//                             </Grid>
//                             <Grid p={1}>
//                                 <Typography variant='body2'>{item?.productId?.name}</Typography>
//                                 <Typography variant='caption'>{item?.productId?.brand}</Typography>
//                                 <Typography>₹{item?.price}</Typography>
//                                 <Typography fontSize={15}>qty x{item?.quantity}</Typography>
//                             </Grid>
//                             <Grid p={1} container spacing={1} xs={12}>
//                                 {item?.image?.map(x => (
//                                     <Grid item key={x}>
//                                         <Avatar component={Link} target='_blank' href={`${process.env.REACT_APP_API_URL}/uploads/${x}`} variant='rounded' src={`${process.env.REACT_APP_API_URL}/uploads/${x}`} >err</Avatar>
//                                     </Grid>
//                                 ))}
//                                 {!!item?.image?.length && (<Grid item xs={12}>
//                                     <Button onClick={()=>downloadImages(item.image)}>Download Resources</Button>
//                                 </Grid>)}
//                             </Grid>
//                         </Grid>
//                     ))}
//                 </Grid>
//                 <Details data={data?.data} />
//             </Grid>}
//         </PageLayout>
//     )
// }

// export default EditOrder



import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from 'layouts/PageLayout';
import Details from './Details';
import { Avatar, Button, Grid, Link, Typography } from '@mui/material';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useGetOrderById } from 'queries/OrderQuery';

const EditOrder = () => {
    const { id } = useParams();
    const [details, setDetails] = useState({});
    const { data, isLoading } = useGetOrderById({ id });

    useEffect(() => {
        setDetails(data?.data);
        console.log(data);
    }, [data]);

    const handleDownload = async (images) => {
        const zip = new JSZip();

        // Add each image to the ZIP file
        for (let i = 0; i < images.length; i++) {
            const imageUrl = `${process.env.REACT_APP_API_URL}/uploads/${images[i]}`;
            const imageName = images[i].split('/').pop();

            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                zip.file(imageName, blob);
            } catch (error) {
                console.error('Error downloading image:', error);
            }
        }

        // Generate the ZIP file and trigger the download
        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, 'images.zip');
        });
    };

    return (
        <PageLayout title={'Order Details'}>
            {isLoading ? (
                <Typography fontSize={14} sx={{ paddingX: 5 }}>loading...</Typography>
            ) : (
                <Grid container spacing={5} display={'flex'} direction={'row'} p={8} justifyContent={'center'}>
                    <Grid item container alignContent={'start'} width={'100%'} xs={12} sm={12} md={7} lg={5} spacing={3}>
                        {details?.products?.map(item => (
                            <Grid item container key={item?._id} xs={12} mb={2}
                                sx={{
                                    position: 'relative',
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: '15px',
                                    border: 'solid 1px #D3D3D3'
                                }}>
                                <Grid p={1}>
                                    <img style={{ width: 120, height: 100, borderRadius: '20px', border: 'solid 1px #D3D3D3' }}
                                        src={`${process.env.REACT_APP_API_URL}/uploads/${item?.productId?.image[0]}`} />
                                </Grid>
                                <Grid p={1}>
                                    <Typography variant='body2'>{item?.productId?.name}</Typography>
                                    <Typography variant='caption'>{item?.productId?.brand}</Typography>
                                    <Typography>₹{item?.price}</Typography>
                                    <Typography fontSize={15}>qty x{item?.quantity}</Typography>
                                </Grid>
                                <Grid p={1} container spacing={1} xs={12}>
                                    {item?.image?.map(x => (
                                        <Grid item key={x}>
                                            <Avatar component={Link} target='_blank' href={`${process.env.REACT_APP_API_URL}/uploads/${x}`} variant='rounded' src={`${process.env.REACT_APP_API_URL}/uploads/${x}`} >err</Avatar>
                                        </Grid>
                                    ))}
                                    {!!item?.image?.length && (
                                        <Grid item xs={12}>
                                            <Button onClick={() => handleDownload(item.image)}>Download Resources</Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                    <Details data={data?.data} />
                </Grid>
            )}
        </PageLayout>
    );
};

export default EditOrder;
