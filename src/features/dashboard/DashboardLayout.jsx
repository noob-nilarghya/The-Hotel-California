import styled from "styled-components";
import Stats from "./Stats";

import Spinner from '../../ui/Spinner';
import { useSearchParams } from "react-router-dom";
import { subDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getBookingsAfterDate, getStaysAfterDate } from "../../services/apiBookings";
import { getCabins } from "../../services/apiCabins";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {

  const [searchParams, setSearchParams] = useSearchParams();
  const numOfdays = (!searchParams.get('last')) ? 30 : Number(searchParams.get('last'));
  const queryDate= subDays(new Date(), numOfdays).toISOString(); // this is what our api function expects


  // ----- To get array of bookings in last X days [today-numOfdays <= created_at <= toady] -----
  const {isLoading: isLoadingBookings, data: bookings} = useQuery({
    queryFn: () => getBookingsAfterDate(queryDate),
    queryKey: ['bookings', `last-${numOfdays}`]
  });


  // ----- To get array of booked bookings in last X days [today-numOfdays <= startDate <= toady] -----
  const {isLoading: isLoadingStays, data: stays} = useQuery({
    queryFn: () => getStaysAfterDate(queryDate),
    queryKey: ['stays', `last-${numOfdays}`]
  });

  
  // ----- To get array of cabins, so that we can calculate number of cabins and pass it to <Stats /> -----
  const {isLoading : isLoadingCabin, data: cabins}= useQuery({ 
    queryKey: ['cabins'], // This is the key, through which we can point to this table (or manupulate it letter)
    queryFn: getCabins // that async function calling for retrieving data
  });


  if(isLoadingBookings || isLoadingStays || isLoadingCabin){ return <Spinner></Spinner>; }
  
  const confirmedStays = stays?.filter((stay) => stay.status!=='unconfirmed');
  const numOfCabins = cabins?.length;

  // console.log(bookings, confirmedStays, numOfCabins);

  return (
    <StyledDashboardLayout>
      {/* Statistics */}
      <Stats bookings={bookings} confirmedStays={confirmedStays} numOfdays={numOfdays} numOfCabins={numOfCabins}></Stats>
      {/* Today's activity */}
      <TodayActivity></TodayActivity>
      {/* Chart stay duration */}
      <DurationChart confirmedStays={confirmedStays}></DurationChart>
      {/* Chart sales */}
      <SalesChart bookings={bookings} numOfdays={numOfdays}></SalesChart>
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
