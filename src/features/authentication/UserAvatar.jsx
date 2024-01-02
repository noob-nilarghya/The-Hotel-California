import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getCurrentUser } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 4rem;
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
  cursor: pointer;
`;

function UserAvatar() {

    const {isLoading, data: user} = useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUser
    });

    const navigate= useNavigate();
    // console.log(user);
    const {fullName, avatar} = user.user_metadata;

    return (
        <StyledUserAvatar onClick={()=> navigate('/account')}>
            <Avatar src={avatar || 'default-user.jpg'} alt="avatar"></Avatar>
            <span>{fullName}</span>
        </StyledUserAvatar>
    );
}

export default UserAvatar;
