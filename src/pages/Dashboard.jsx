import DashboardLayout from "../features/dashboard/DashboardLayout";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import DashboardFilter from "../features/dashboard/DashboardFilter";


function Dashboard() {
  return (
    <>
      <Row type="horizontal">
        <Row type="vertical">
          <Heading as="h1">Welcome to the Hotel California</Heading>
          <Heading as="h2">Dashboard</Heading>
        </Row>
        <DashboardFilter></DashboardFilter>
      </Row>
      <DashboardLayout></DashboardLayout>
    </>
  );
}

export default Dashboard;
