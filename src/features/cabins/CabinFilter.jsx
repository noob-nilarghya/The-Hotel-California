import TableOperations from '../../ui/TableOperations';
import Filter from '../../ui/Filter';
import SortBy from '../../ui/SortBy';
function CabinFilter() {
    return (
        <TableOperations>
            <Filter filteredField="discount" options={[ {value: "all", label: "ALL"}, 
                                                        {value: "no-discount", label: "NO DISCOUNT"}, 
                                                        {value: "with-discount", label: "WITH DISCOUNT"}]}>
            </Filter>  
            <SortBy options={[  {value: 'regularPrice-asc', label: "Sort by PRICE (lowest first)"},
                                {value: 'regularPrice-desc', label: "Sort by PRICE (highest first)"},
                                {value: 'maxCapacity-asc', label: "Sort by CAPACITY (lowest first)"},
                                {value: 'maxCapacity-desc', label: "Sort by CAPACITY (highest first)"}]}>
            </SortBy>          
        </TableOperations>
    );
}

export default CabinFilter;
