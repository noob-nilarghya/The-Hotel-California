import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

function Filter({filteredField, options}) {

  // Now change the url based on which button user have clicked (so, that we can store the filter state inside the URL itself)
  // for example: '/cabins?discount="no-discount", so if any user share that link and other user open it, then he/she can directly see filtered result
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get(filteredField) || ((options[0].value === '7') ? '30' : options[0].value);

  function handleClick(value){
    // searchParams.set("discount", value);
    searchParams.set(filteredField, value); // setting or changing URL params
    searchParams.set('page', 1);

    setSearchParams(searchParams); // we changed url based on button click
  }

  return (
    <StyledFilter>
      {/* <FilterButton onClick={() => handleClick('all')} > ALL </FilterButton> */}
      
      {options.map((opn)=> 
        <FilterButton onClick={() => handleClick(opn.value)} active={opn.value === currentFilter} key={opn.value} > {opn.label} </FilterButton>)
      }
    </StyledFilter>
  );
}

export default Filter;

