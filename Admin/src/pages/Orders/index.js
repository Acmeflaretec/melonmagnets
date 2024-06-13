import Table from "examples/Tables/Table";
import tableData from "./tableData";
import Button from 'components/Button';
import { Link } from 'react-router-dom';
import PageLayout from "layouts/PageLayout";

function Orders() {
  const { columns, rows } = tableData;
  return (
    <PageLayout
      title={'Orders'}
      action={
        <Button component={Link} to={`/orders/addOrders`}>Add Orders</Button>
      }
    >
      <Table columns={columns} rows={rows} />
    </PageLayout>
  );
}

export default Orders;
