/* eslint-disable react/prop-types */
import Box from "components/Box";
import Typography from "components/Typography";
import Table from "examples/Tables/Table";
import { Avatar, Tooltip } from "@mui/material";
import { useGetBulkOrders } from "queries/OrderQuery";

function Blogs({ image, name, email }) {
  return (
    <Box display="flex" alignItems="center" px={1} py={0.5}>
      <Box mr={2}>
        <Avatar src={image} alt={name?.toUpperCase()} size="sm" variant="rounded" />
      </Box>
      <Box display="flex" flexDirection="column">
        <Typography variant="button" fontWeight="medium">
          {name}
        </Typography>
        <Typography variant="caption" color="secondary">
          {email}
        </Typography>
      </Box>
    </Box>
  );
}

const TableData = () => {
  const { data, isLoading } = useGetBulkOrders({ pageNo: 1, pageCount: 100 });
  const columns = [
    { name: "order", align: "left" },
    { name: "phone", align: "center" },
    { name: "product", align: "center" },
    { name: "quantity", align: "center" },
    { name: "ordered", align: "center" },
    { name: "message", align: "center" },
  ]

  const rows = data?.data?.map(item => ({
    order: <Blogs image={`${process.env.REACT_APP_API_URL}/uploads/${item?.image}`} name={item?.name} email={item?.email} />,
    phone: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {item?.mobile}
      </Typography>
    ),
    product: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {item?.product}
      </Typography>
    ),
    quantity: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {item?.quantity}
      </Typography>
    ),
    message: (
      <Tooltip title={item?.message} arrow>
        <Typography
          variant="caption"
          color="secondary"
          fontWeight="medium"
          onClick={() => handleOpen(item?.message)}
          style={{ cursor: 'pointer' }}
        >
          {item?.message?.substring(0, 50)}
        </Typography>
      </Tooltip>
    ),
    ordered: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {new Date(item?.createdAt).toDateString()}
      </Typography>
    ),
  }))
  return isLoading ? <Typography fontSize={14} sx={{ paddingX: 5 }}>loading...</Typography> : <Table columns={columns} rows={rows} />
};

export default TableData;
