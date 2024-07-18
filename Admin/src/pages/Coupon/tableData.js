/* eslint-disable react/prop-types */
import Box from "components/Box";
import Typography from "components/Typography";
import Avatar from "components/Avatar";
import Badge from "components/Badge";
import { useGetCoupon,useUpdateCouponStatus } from "queries/ProductQuery";
import Table from "examples/Tables/Table";
import { Icon } from "@mui/material";
import Button from '@mui/material/Button';
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


function Coupon({ image, name, desc }) {



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
  const { data, isLoading } = useGetCoupon({ pageNo: 1, pageCount: 100 });
  const { mutateAsync: UpdateCouponStatus, isLoadings } = useUpdateCouponStatus()

console.log(data?.data)

  const handleStatus = async (data) =>{


  UpdateCouponStatus(data)
    .then((res) => {
      toast.success(res?.message ?? "coupon status updated");
      window.location.reload()
    })
    .catch((err) => {
      toast.error(err?.message ?? "Something went wrong");
    });
    
      }

  const columns = [
    { name: "coupon", align: "left" },
    { name: "code", align: "center" },
    { name: "status", align: "center" },
    { name: "createdon", align: "center" },
    { name: "validity", align: "center" },
    { name: "discount", align: "center" },
    { name: "description", align: "center" },
    { name: "action", align: "center" },
  ]

  const rows = data?.data?.map(item => ({
    coupon:( 
    <Coupon image={`${process.env.REACT_APP_API_URL}/uploads/${item?.image}`} name={item?.name} desc={item?.description} />
  ),
    code: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {item?.code}
      </Typography>
    ),
    // status: (
    //   <Badge variant="gradient" badgeContent={item?.status ? 'Available' : 'Unavailable'} color={item?.status ? "success" : 'secondary'} size="xs" container />
    // ),
    status: (
      <Button variant="contained" color={item?.status ? `success` : `error`} onClick={()=>handleStatus(item)} >
     {item?.status ? 'Active' : 'In-Active'}
    </Button>    ),
    createdon: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {new Date(item?.createdAt).toDateString()}
      </Typography>
    ),
    validity: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {new Date(item?.validity).toDateString()}
      </Typography>
    ),
    discount: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {item?.discount}
      </Typography>
    ),
    description: (
      <Typography variant="caption" color="secondary" fontWeight="medium">
        {item?.description}
      </Typography>
    ),
    action: (
      <Link to={`/coupon/editCoupon/${item?._id}`}>
        <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small">
          more_vert
        </Icon>
      </Link>
    ),
  }))
  return isLoading ? <Typography fontSize={14} sx={{ paddingX: 5 }}>loading...</Typography> : <Table columns={columns} rows={rows} />
};

export default TableData;
