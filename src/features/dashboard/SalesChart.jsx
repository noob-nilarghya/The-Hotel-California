import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import {useDarkMode} from '../../context/DarkModeContext';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

const fakeData = [
  { label: "Jan 09", totalSales: 480, extrasSales: 20 },
  // ..............
];


function SalesChart({bookings, numOfdays}) {

  const {isDarkMode} = useDarkMode();

  // First of all prepare all labels of last X days [for XAxis] using a func from date-fns library
  const allDates= eachDayOfInterval({
    start: subDays(new Date(), numOfdays-1),
    end: new Date()
  });

  // Then prepare the above array like fakeData
  const data= allDates.map((date) => {

    let totalSaleToday=0; // total sale from bookings that are created on 'date' [cabinPrice + extraPrice]
    let totalExtraSalesToday=0; // total extra earned from bookings that are created on 'date' [for breakfast]
    bookings.forEach((booking) => { 
      if(isSameDay(date, new Date(booking.created_at)) === true){
        totalSaleToday+=booking.totalPrice;
        totalExtraSalesToday+=booking.extrasPrice;
      }
    });

    return {
      label: format(date, "MMM dd"),
      totalSales: totalSaleToday,
      extrasSales: totalExtraSalesToday
    }

  });

  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <StyledSalesChart>
      <Heading as='h2'>Sales [{format(allDates[0], "MMM dd")} &mdash; {format(allDates[numOfdays-1], "MMM dd")}]</Heading>
      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <XAxis dataKey="label"></XAxis>
          <YAxis unit="$"></YAxis>
          <CartesianGrid strokeDasharray="4"></CartesianGrid>
          <Tooltip></Tooltip>
          <Area 
            dataKey="totalSales" 
            type="monotone" 
            stroke={colors.totalSales.stroke} 
            fill={colors.totalSales.fill} 
            strokeWidth={2}
            name="Total Sale"
            unit="$">
          </Area>

          <Area 
            dataKey="extrasSales" 
            type="monotone" 
            stroke={colors.extrasSales.stroke} 
            fill={colors.extrasSales.fill} 
            strokeWidth={2}
            name="Extras Sale"
            unit="$">
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
