import Heading from "../ui/Heading";
import Row from "../ui/Row";
import BookingTable from '../features/bookings/BookingTable';
import BookingFilter from "../features/bookings/BookingFilter";

function Bookings() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All bookings</Heading>
        <BookingFilter></BookingFilter>
      </Row>

      <BookingTable></BookingTable>
    </>
  );
}

export default Bookings;
