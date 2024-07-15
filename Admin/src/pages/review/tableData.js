/* eslint-disable react/prop-types */
import Box from "components/Box";
import Typography from "components/Typography";
import Avatar from "components/Avatar";
import Badge from "components/Badge";
import toast from 'react-hot-toast';
import Table from "examples/Tables/Table";
import { useGetReview } from "queries/ProductQuery";
import { Link } from "react-router-dom";
import { Icon,Tooltip } from "@mui/material";

function Author({ image, name}) {
  return (
    <Box display="flex" alignItems="center" px={1} py={0.5}>
      <Box mr={2}>
        <Avatar src={image} alt={name} size="sm" variant="rounded" />
      </Box>
      {/* <Box display="flex" flexDirection="column">
        <Typography variant="button" fontWeight="medium">
          {name}
        </Typography>
        <Typography variant="caption" color="secondary">
          {desc}
        </Typography>
      </Box> */}
    </Box>
  );
}

const TableData = () => {
  const { data, isLoading } = useGetReview({ pageNo: 1, pageCount: 100 });
  const columns = [
    { name: "name", align: "left" },
    { name: "Product", align: "center" },
    { name: "review", align: "center" },
    { name: "rating", align: "center" },
    { name: "status", align: "center" },
    { name: "action", align: "center" },
  ]

  const rows = data?.data?.map(item => ({
    name: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {item?.name}
      </Typography>
    ),
    Product: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {item?.productId?.name}
      </Typography>
    ),
    review: (
      <Tooltip title={item?.review} arrow>
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {item?.review?.substring(0, 50)}
      </Typography>
      </Tooltip>
    ),
    rating: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {item?.rating}
      </Typography>
    ),

    
    status: (
      <Badge variant="gradient" badgeContent={item?.approved ? 'approved' : 'not-approved'} color={item?.approved ? "success" : 'secondary'} size="xs" container />
    ),
    
    action: (
      <Link to={`/review/editReview/${item?._id}`}>
        <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small">
          more_vert
        </Icon>
      </Link>
    ),
  }))
  return isLoading ? <Typography fontSize={14} sx={{paddingX:5}}>loading...</Typography> : <Table columns={columns} rows={rows} />
};

export default TableData;
