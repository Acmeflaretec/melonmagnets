// import Button from 'components/Button';
// import { Link } from 'react-router-dom';
import PageLayout from "layouts/PageLayout";
import TableData from "./tableData";

function Review() {
  return (
    <PageLayout
      title={'Review'}
      // action={
      //   <Button component={Link} to={`/products/addProducts`}>Add Products</Button>
      // }
    >
      <TableData/>
    </PageLayout>
  );
}

export default Review;
