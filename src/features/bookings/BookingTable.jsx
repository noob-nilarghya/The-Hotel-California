import styled from "styled-components";
import BookingRow from "./BookingRow";
import Empty from '../../ui/Empty';
import { getBookings } from "../../services/apiBookings";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../ui/Spinner";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../ui/Pagination";

const Table = styled.div`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;

  overflow-x: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
  
`;

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1.8fr;
  column-gap: 2.4rem;
  align-items: center;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;

function BookingTable() {

  // This is how we can read data from remote state with 'useQuery' hook provided by react-query
  const {isLoading, data: bookings, error}= useQuery({ 
    queryKey: ['bookings'], // This is the key, through which we can point to this table (or manupulate it letter)
    queryFn: getBookings // that async function calling for retrieving data
  });

  const [searchParams, setSearchParams] = useSearchParams();

  if(isLoading) { return <Spinner></Spinner>; }

  // 1. FILTER
  const filteredValue= searchParams.get('status') || 'all';

  let filteredBookings;
  if(filteredValue === 'all') { filteredBookings = bookings; }
  // else case: checked-out, checked-in, unconfirmed
  else { filteredBookings = bookings?.filter((booking) => booking.status === filteredValue) }


  // 2. SORT
  const sortedValue= searchParams.get('sortBy') || 'noSort';

  let filteredSortedBookings;
  if(sortedValue === 'noSort'){ filteredSortedBookings = filteredBookings; }
  else{
    const [field, sortDir] = sortedValue.split('-');
    filteredSortedBookings = filteredBookings?.sort((a, b) => {
      let val1= a[field]; let val2= b[field];

      if(field === 'startDate'){
        const currDate1 = new Date(a.startDate);  const currDate2 = new Date(b.startDate); 
        const timeStamp1 = currDate1.getTime(); const timeStamp2 = currDate2.getTime();
        val1= timeStamp1; val2= timeStamp2;
      }

      if(sortDir === 'asc') return val1 - val2;
      return val2 - val1;
    });
  }


  // 3. PAGINATION
  const resPerPage= 10; const totalResCount = filteredSortedBookings?.length;
  const currPage= (!searchParams.get('page')) ? 1 : Number(searchParams.get('page'));
  const from = (currPage-1)*resPerPage; const to= Math.min(currPage*resPerPage, totalResCount) -1;
  const finalBooking = filteredSortedBookings?.slice(from, to+1);

  
  if(finalBooking?.length === 0){ return <Empty resourceName="Bookings" ></Empty>}

  return (
    <>
      <Table role='table'>
        <TableHeader role='row'>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </TableHeader>

        {finalBooking.map((booking)=> <BookingRow booking={booking} key={booking.id}></BookingRow>)}
      </Table>
      <Pagination totalResCount={totalResCount} resPerPage={resPerPage}></Pagination>
    </>
  );
}

export default BookingTable;