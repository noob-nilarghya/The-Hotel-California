import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useNavigate, useParams } from "react-router-dom";
import { deleteBooking, getBooking, updateBooking } from "../../services/apiBookings";
import Spinner from "../../ui/Spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {useMoveBack} from '../../hooks/useMoveBack';
import toast from "react-hot-toast";
import { HiTrash } from "react-icons/hi2";
import Empty from "../../ui/Empty";


const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const {bookingId} = useParams();
  const moveBack= useMoveBack(); // --> Same as [navigate(-1)]
  const queryClient = useQueryClient();
  const navigate= useNavigate();

  // This is how we can read data from remote state with 'useQuery' hook provided by react-query
  const {isLoading, data: booking, error}= useQuery({ 
    queryKey: ['single-booking', bookingId], // This is the key, through which we can point to this table (or manupulate it letter)
    queryFn: () => getBooking(bookingId) // that async function calling for retrieving data
  });

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

      navigate('/bookings');
    },
    onError: (err) => toast.error(err.message)
  });

  if(isLoading) { return <Spinner></Spinner>; }
  if(!booking){ return <Empty resourceName="booking"></Empty>; }

  const statusToTagName = {
    "unconfirmed": "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  function handleClickCheckout(){
    if(status !== 'checked-in'){ return; }
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
    mutate(bookingId);
  }

  function handleDeleteRow(){
    deleteMutate(bookingId);
  }


  const {status} = booking;

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status?.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}> &larr; Back </ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {(status === 'unconfirmed') ? <Button variation="primary" size="small" onClick={() => navigate(`/checkin/${booking.id}`)}> Check in</Button> : <></>}
        {(status === 'checked-in') ? <Button variation="primary" size="small" onClick={handleClickCheckout} disabled={isCheckingOut}> Check Out</Button> : <></>}
        <Button variation="primary" size="small" onClick={handleDeleteRow} disabled={isDeleting}> <HiTrash /> Delete Booking</Button>
        <Button variation="secondary" onClick={moveBack}> Back </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;