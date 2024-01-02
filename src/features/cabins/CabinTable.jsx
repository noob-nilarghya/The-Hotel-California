import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { getCabins } from '../../services/apiCabins';
import Spinner from '../../ui/Spinner';
import CabinRow from './CabinRow';
import Empty from '../../ui/Empty';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../../ui/Pagination';

const Table = styled.div`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
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

function CabinTable() {

  // This is how we can read data from remote state with 'useQuery' hook provided by react-query
  const {isLoading, data: cabins, error}= useQuery({ 
    queryKey: ['cabins'], // This is the key, through which we can point to this table (or manupulate it letter)
    queryFn: getCabins // that async function calling for retrieving data
  });

  const [searchParams, setSearchParams] = useSearchParams();

  // 1. FILTER
  const filteredValue= searchParams.get("discount") || "all" ;

  let filteredCabins;
  if(filteredValue === 'all') { filteredCabins= cabins; }
  if(filteredValue === 'no-discount') { filteredCabins= cabins?.filter((cabin)=> cabin.discount === 0) }
  if(filteredValue === 'with-discount') { filteredCabins= cabins?.filter((cabin)=> cabin.discount > 0) }

  
  // 2. SORT
  const sortedValue= searchParams.get("sortBy") || "noSort";

  let filteredSortedCabins;
  if(sortedValue === "noSort") { filteredSortedCabins=filteredCabins;  } // do nothing
  else{
    const [field, sortDir] = sortedValue.split('-');
  
    filteredSortedCabins = filteredCabins?.sort((a,b) => {
      if(sortDir==="asc") return a[field] - b[field];
      return b[field] - a[field];
    });
  }


  // 3. PAGINATION
  const resPerPage= 5; const totalResCount = filteredSortedCabins?.length;
  const currPage= (!searchParams.get('page')) ? 1 : Number(searchParams.get('page'));
  const from = (currPage-1)*resPerPage; const to= Math.min(currPage*resPerPage, totalResCount) -1;
  const finalCabin = filteredSortedCabins?.slice(from, to+1);
  

  if(isLoading) { return <Spinner></Spinner>; }

  if(finalCabin.length === 0){ return <Empty resourceName="Cabins" ></Empty>}
  
  return (
    <>
      <Table role='table'>
        <TableHeader role='row'>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </TableHeader>
        {finalCabin.map((cabin)=> <CabinRow cabin={cabin} key={cabin.id}></CabinRow>)}
      </Table>
      <Pagination totalResCount={totalResCount} resPerPage={resPerPage}></Pagination>
    </>
  );
}
export default CabinTable;
