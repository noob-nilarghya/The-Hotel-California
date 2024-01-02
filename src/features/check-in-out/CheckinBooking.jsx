import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Checkbox from '../../ui/Checkbox';

import { useMoveBack } from "../../hooks/useMoveBack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBooking, updateBooking } from "../../services/apiBookings";
import Spinner from "../../ui/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { formatCurrency } from "../../utils/helpers";
import toast from "react-hot-toast";
import { useSettings } from "../settings/useSettings";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const {bookingId} = useParams();
  const moveBack= useMoveBack(); // --> Same as [navigate(-1)]
  const queryClient = useQueryClient();
  const navigate= useNavigate();

  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);

  const {isLoading, data: booking, error}= useQuery({ 
    queryKey: ['single-booking', bookingId], // This is the key, through which we can point to this table (or manupulate it letter)
    queryFn: () => getBooking(bookingId) // that async function calling for retrieving data
  });

  const {isLoading: isCheckingIn, mutate} = useMutation({
    mutationFn: ({bookingId, updateObj}) => updateBooking(bookingId, updateObj),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in`);
      queryClient.invalidateQueries({
        queryKey: ['single-booking', bookingId, 'bookings']
      });
      navigate('/'); // navigate to dashboard (or home route)
    },
    onError: () => toast.error("Error while checking in")
  });

  const {settingsData, isLoading: isLoadingSettings, error: errSettings} = useSettings();

  function handleCheckin() {
    if(!confirmPaid){ return; }
    queryClient.invalidateQueries({ queryKey: ['bookings'] });

    if(addBreakfast){
      mutate({bookingId, updateObj:{
        status: 'checked-in',
        isPaid: true,
        hasBreakfast: true,
        extrasPrice: optionalBreakfastPrice,
        totalPrice: totalPrice + optionalBreakfastPrice
      }})
    }
    else{
      mutate({bookingId, updateObj:{
        status: 'checked-in',
        isPaid: true,
        hasBreakfast: false,
        extrasPrice: 0,
        totalPrice: totalPrice
      }})
    }
  }

  function handleAddBreakfast(){
    if(hasBreakfast){ return; }
    setAddBreakfast((state)=> !state);
    setConfirmPaid(false); // as user had to pay some additional money for adding breakfast
  }

  if(isLoading || isLoadingSettings) { return <Spinner></Spinner>; }

  const { guests, totalPrice, numGuests, hasBreakfast, numNights } = booking;
  const optionalBreakfastPrice= settingsData?.breakfastPrice * numNights * numGuests;
  let finalCheckoutPrice = (addBreakfast) ? (totalPrice + optionalBreakfastPrice) : totalPrice; 

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && <Checkbox checked={addBreakfast} onChange={handleAddBreakfast}> {`Want to add breakfast for additional ${optionalBreakfastPrice} ?`} </Checkbox>}

      <Checkbox checked={confirmPaid} onChange={() => setConfirmPaid((state)=> !state)} id="confirm" disabled={isCheckingIn}> I confirm that {guests.fullName} has paid the total amount of {(addBreakfast) ? 
                                        `${formatCurrency(totalPrice)} + Breakfast (${formatCurrency(optionalBreakfastPrice)}) = 
                                        ${formatCurrency(finalCheckoutPrice)}`
                                         : `${formatCurrency(totalPrice)}` } 
      </Checkbox>
      

      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn} >Check in booking #{bookingId}</Button>
        <Button variation="secondary" onClick={moveBack}> Back </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;