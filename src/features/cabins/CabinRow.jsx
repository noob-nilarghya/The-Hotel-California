import styled from 'styled-components';
import {formatCurrency} from '../../utils/helpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCabin } from '../../services/apiCabins';
import toast from 'react-hot-toast';
import { useState } from 'react';
import EditCabinForm from './EditCabinForm';
import Button from '../../ui/Button';

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  /* transform: scale(1.66666) translateX(-2px); */
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;



function CabinRow({cabin}) {
  const [showForm, setShowForm] = useState(false); // form to edit a cabin

  const {id : cabinId, name, maxCapacity, regularPrice, discount, image} = cabin;

  const queryClient= useQueryClient(); // provide an instance of queryClient so that we can call invalidate method after row deletion

  // This is how we can manupulate data from remote state with 'useMutation' hook provided by react-query
  const {isLoading: isDeleting, mutate} = useMutation({ 
    mutationFn: (id) => deleteCabin(id), // async funct for deletion
    onSuccess: () => { // instruction to be performed on success
      toast.success("Cabin deleted successfully");

      queryClient.invalidateQueries({ // we want react-query to re-fetch data after row deletion. We can make it happen by invalidating existing data, so that react-query can re-fetch the data
        queryKey: ['cabins'] // telling which table to re-fetch (using that key [see cabinTable, 'useQuery'])
      });
    },
    onError: (err) => toast.error(err.message)
  });


  return (
    <>
      <TableRow role='row'>
        <Img src={image}></Img>
        <Cabin>{name}</Cabin>
        <div>Fits up to {maxCapacity} guests</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        <Discount>{formatCurrency(discount)}</Discount>
        <div style={{display: "flex", gap: "1rem"}}>
          <Button variation="primary" size="small" onClick={()=> setShowForm((show)=> !show)}>Edit</Button>
          <Button variation="primary" size="small" onClick={() => mutate(cabinId)} disabled={isDeleting}>Delete</Button> {/* On calling mutate(id), deletion process from DB starts */}
        </div>
      </TableRow>
      {showForm && <EditCabinForm cabinToEdit={cabin} setShowForm={setShowForm}></EditCabinForm>}
    </>
  );
}

export default CabinRow;

