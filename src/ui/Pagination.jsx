import styled from "styled-components";
import {HiChevronRight, HiChevronLeft} from 'react-icons/hi2';
import { useSearchParams } from "react-router-dom";

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const P = styled.p`
  font-size: 1.4rem;
  margin-left: 0.8rem;

  & span {
    font-weight: 600;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const PaginationButton = styled.button`
  background-color: ${(props) =>
    props.active ? " var(--color-brand-600)" : "var(--color-grey-50)"};
  color: ${(props) => (props.active ? " var(--color-brand-50)" : "inherit")};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

function Pagination({totalResCount, resPerPage}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currPage= (!searchParams.get('page')) ? 1 : Number(searchParams.get('page'));
  const pageCnt= Math.ceil(totalResCount/resPerPage);

  function handlePrevPage(){
    const prevPage= (currPage===1) ? 1 : currPage-1;
    searchParams.set('page', prevPage);
    setSearchParams(searchParams);
  }
  function handleNextPage(){
    const nextPage= (currPage===pageCnt) ? pageCnt : currPage+1;
    searchParams.set('page', nextPage);
    setSearchParams(searchParams);
  }

  if(pageCnt<=1){ return null; }

  return (
    <StyledPagination>
      <p>Showing <span style={{fontWeight:"bold"}}> {(currPage-1)*resPerPage + 1} </span> to <span style={{fontWeight:"bold"}}> {Math.min(currPage*resPerPage, totalResCount)} </span> of <span style={{fontWeight:"bold"}}> {totalResCount} </span> results</p>

      <Buttons>
        <PaginationButton onClick={handlePrevPage} disabled={currPage === 1}> <HiChevronLeft/ > <span>Previous</span> </PaginationButton>
        <PaginationButton onClick={handleNextPage} disabled={currPage === pageCnt}> <span>Next</span> <HiChevronRight/ > </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
}

export default Pagination;
