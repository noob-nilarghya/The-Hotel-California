import { formatCurrency } from "../../utils/helpers";
import Stat from "./Stat";
import {HiOutlineBanknotes, HiOutlineBriefcase, HiOutlineCalendarDays, HiOutlineChartBar} from 'react-icons/hi2';

function Stats({bookings, confirmedStays, numOfdays, numOfCabins}) {
  const numBookings= bookings.length; 

  let totalSalePrice=0;
  bookings.forEach((booking)=> {
    totalSalePrice += booking.totalPrice;
  });

  const numCheckins= confirmedStays.length;

  // occupancy rate = (total confirmed booking numNights stays) / [(last x days) * (capacity of all 8 cabins)]
  let confirmedNightStays= 0;
  confirmedStays.forEach((stays) => {
    confirmedNightStays += stays.numNights;
  });
  const occupancyRate= confirmedNightStays/(numOfdays*numOfCabins)


  return (
    <>
      <Stat title="Bookings" color="blue" icon={<HiOutlineBriefcase />} value={numBookings}></Stat>
      <Stat title="Sales" color="green" icon={<HiOutlineBanknotes />} value={formatCurrency(totalSalePrice)}></Stat>
      <Stat title="Check ins" color="indigo" icon={<HiOutlineCalendarDays />} value={numCheckins}></Stat>
      <Stat title="Occupancy rate" color="yellow" icon={<HiOutlineChartBar />} value={Math.round(occupancyRate*100) + "%"}></Stat>
    </>
  );
}

export default Stats;
