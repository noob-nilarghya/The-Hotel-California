import styled from "styled-components";
import Tag from '../../ui/Tag';
import {Flag} from '../../ui/Flag';
import { useNavigate } from "react-router-dom";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 8rem;
  gap: 1.2rem;
  align-items: center;
  cursor: pointer;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

function TodayItem({activity}) {
    const {id, status, guests, numNights} = activity;
    const navigate= useNavigate();

    function handleClick(){
        navigate(`/booking/${id}`); // booking detail page [From there, we can see detail and check-out/check-in easily]
    }

    return (
        <StyledTodayItem onClick={handleClick}>
            {status === 'unconfirmed' && <Tag type='green'>Arriving</Tag>}
            {status === 'checked-in' && <Tag type='blue'>Departing</Tag>}

            <Flag src={guests.countryFlag} alt={`Flag of ${guests.country}`} />
            <Guest>{guests.fullName}</Guest>
            <div>{numNights} Nights</div>
        </StyledTodayItem>
    );
}

export default TodayItem;
