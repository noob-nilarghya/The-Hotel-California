import Filter from '../../ui/Filter';
import SortBy from '../../ui/SortBy';
import TableOperations from '../../ui/TableOperations';

function BookingFilter() {
  return (
    <TableOperations>
      {/* We could do these two as compound components as well, but let's keep it simple, and let's also explore different ways of achieving the same thing */}
      <Filter
        filteredField='status'
        options={[
          { value: 'all', label: 'ALL' },
          { value: 'checked-out', label: 'CHECKED OUT' },
          { value: 'checked-in', label: 'CHECKED IN' },
          { value: 'unconfirmed', label: 'UNCONFIRMED' },
        ]}
      />

      <SortBy
        options={[
          { value: 'startDate-desc', label: 'Sort by date (recent first)' },
          { value: 'startDate-asc', label: 'Sort by date (earlier first)' },
          { value: 'totalPrice-desc', label: 'Sort by amount (high first)' },
          { value: 'totalPrice-asc', label: 'Sort by amount (low first)' }
        ]}
      />
    </TableOperations>
  );
}

export default BookingFilter;
