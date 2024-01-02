import styled from "styled-components";
import Logout from "../features/authentication/Logout";
import UserAvatar from '../features/authentication/UserAvatar';
import DarkModeToggle from "./DarkModeToggle";

const StyledHeader = styled.header`
  display: flex;
  gap: 0.4rem;
  justify-content: space-between;
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

const FlexDiv= styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-around;
`;

function Header() {
  return (
    <StyledHeader>
      <UserAvatar />
      <FlexDiv>
        <DarkModeToggle />
        <Logout />
      </FlexDiv>
    </StyledHeader>
  );
}

export default Header;
