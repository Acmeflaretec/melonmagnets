/* eslint-disable react/prop-types */
import Box from "components/Box";
import Typography from "components/Typography";
import Avatar from "components/Avatar";
import Badge from "components/Badge";
import toast from 'react-hot-toast';
import { useGetCategory } from "queries/ProductQuery";
import Table from "examples/Tables/Table";

const notify = () => toast.success('category deleted successfully.');
function Category({ image, name, desc }) {
  return (
    <Box display="flex" alignItems="center" px={1} py={0.5}>
      <Box mr={2}>
        <Avatar src={image} alt={name} size="sm" variant="rounded" />
      </Box>
      <Box display="flex" flexDirection="column">
        <Typography variant="button" fontWeight="medium">
          {name}
        </Typography>
        <Typography variant="caption" color="secondary">
          {desc}
        </Typography>
      </Box>
    </Box>
  );
}

const TableData = () => {
  const { data, isLoading } = useGetCategory({ pageNo: 1, pageCount: 100 });
  const columns = [
    { name: "category", align: "left" },
    { name: "status", align: "center" },
    { name: "createdon", align: "center" },
    { name: "Lastupdated", align: "center" },
    { name: "action", align: "center" },
  ]

  const rows = data?.data?.map(item => ({
    category: <Category image={`${process.env.REACT_APP_API_URL}/uploads/${item?.image}`} name={item?.name} desc={item?.desc} />,
    status: (
      <Badge variant="gradient" badgeContent={item?.isAvailable ? 'Available' : 'Unavailable'} color={item?.isAvailable ? "success" : 'secondary'} size="xs" container />
    ),
    createdon: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {new Date(item?.createdAt).toDateString()}
      </Typography>
    ),
    Lastupdated: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {new Date(item?.updatedAt).toDateString()}
      </Typography>
    ),
    action: (
      <>
        <Typography
          component="a"
          href="#"
          onClick={notify}
          variant="caption"
          color="secondary"
          fontWeight="medium"
        >
          Edit
        </Typography>
        <Typography
          component="a"
          href="#"
          onClick={notify}
          variant="caption"
          color="secondary"
          fontWeight="medium"
        >
          Delete
        </Typography>
      </>
    ),
  }))
  return isLoading ? <>loading...</> : <Table columns={columns} rows={rows} />
};

export default TableData;
