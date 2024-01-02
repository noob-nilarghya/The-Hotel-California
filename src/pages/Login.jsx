import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";
import Row from '../ui/Row';

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

function Login() {
  return (
    <LoginLayout>
      <Logo></Logo>
      <Row type="vertical">
        <Heading as="h5">Welcome to the Hotel California</Heading>
        <Heading as="h4">Log in to your account</Heading>
      </Row>
      <LoginForm></LoginForm>
    </LoginLayout>
  );
}

export default Login;
