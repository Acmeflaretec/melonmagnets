import { Box, Typography } from "@mui/material";
import PageLayout from "layouts/PageLayout";
import underConstruction from 'assets/images/under_construction.png'
function Blogs() {
  return (
    <PageLayout
      title={'Blogs'}
    >
      <Box sx={{ flexGrow: 1 }} height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} py={10}>
        <img width={80} src={underConstruction} alt="image" />
        <Typography fontSize={'small'} px={2}>
          Page is temporarily under maintenance.<br />
          please check again later
        </Typography>
      </Box>
    </PageLayout>
  );
}

export default Blogs;
