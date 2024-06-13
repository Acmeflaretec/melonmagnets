import PageLayout from "layouts/PageLayout";
import Button from "components/Button";
import tableData from "./tableData";
import Table from "examples/Tables/Table";
import { Link } from "react-router-dom";

function Banner() {
  const { columns, rows } = tableData;
  return (
    <PageLayout
      title={'Banners'}
      action={
        <Button component={Link} to={`/banners/addBanner`}>Add Banner</Button>
      }
    >
      <Table columns={columns} rows={rows} />
    </PageLayout>
  );
}

export default Banner;
