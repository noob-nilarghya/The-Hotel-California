import styled from "styled-components";
import { format, isToday } from "date-fns";

import Tag from "../../ui/Tag";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking, updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { HiTrash } from "react-icons/hi2";

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1.8fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function BookingRow({
  booking: {
    id: bookingId, created_at, startDate, endDate, numNights, numGuests, totalPrice, status,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName },
  },
}) {
  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ------- Checking out [UPDATING] -------
  const {isLoading: isCheckingOut, mutate} = useMutation({
    mutationFn: (bookingId) => updateBooking(bookingId, {
      status: 'checked-out'
    }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      queryClient.invalidateQueries({
        queryKey: ['single-booking', bookingId, 'bookings']
      });
      navigate('/');
    },
    onError: () => toast.error("Error while checking out")
  });


  // ------- DELETING -------
  // This is how we can manupulate data from remote state with 'useMutation' hook provided by react-query
  const {isLoading: isDeleting, mutate: deleteMutate} = useMutation({ 
    mutationFn: (id) => deleteBooking(id), // async funct for deletion
    onSuccess: () => { // instruction to be performed on success
      toast.success("Booking deleted successfully");

      queryClient.invalidateQueries({ // we want react-query to re-fetch data after row deletion. We can make it happen by invalidating existing data, so that react-query can re-fetch the data
        queryKey: ['bookings'] // telling which table to re-fetch (using that key [see cabinTable, 'useQuery'])
      });
    },
    onError: (err) => toast.error(err.message)
  });

  function handleClickDetails(){
    // queryClient.invalidateQueries({ queryKey: ['single-booking'] });
    navigate(`/booking/${bookingId}`);
  }
  function handleClickCheckin(){
    // queryClient.invalidateQueries({ queryKey: ['single-booking'] });
    navigate(`/checkin/${bookingId}`)
  }
  function handleClickCheckout(){
    if(status !== 'checked-in'){ return; }
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
    mutate(bookingId);
  }
  function handleDeleteRow(){
    deleteMutate(bookingId);
  }

  return (
    <TableRow role='row'>
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate)) ? "Today" : formatDistanceFromNow(startDate)}{" "}&rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>
      
      <div style={{display: "flex", gap: "1rem"}}>
        <Button variation="primary" size="small" onClick={handleClickDetails}> Details</Button>
        {(status === 'unconfirmed') ? <Button variation="primary" size="small" onClick={handleClickCheckin}> Check in</Button> : <></>}
        {(status === 'checked-in') ? <Button variation="primary" size="small" onClick={handleClickCheckout} disabled={isCheckingOut}> Check Out</Button> : <></>}
        <Button variation="primary" size="small" onClick={handleDeleteRow} disabled={isDeleting}> <HiTrash /></Button>
      </div>
    </TableRow>
  );
}

export default BookingRow;