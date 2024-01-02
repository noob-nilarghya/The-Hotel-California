import { useState } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate= useNavigate();

  const {mutate, isLoading} = useMutation({
    mutationFn: ({email, password}) => login({email, password}),
    onSuccess: () => {
      toast.success("Login successful. Redirecting to Dashboard ...");
      setTimeout(()=>{
        navigate('/dashboard', {replace: true});
      }, 3000);
      navigate('/dashboard', {replace: true});
    },
    onError: ()=> toast.error("Login unsuccessful")
  });

  function handleSubmit(evt) {
    evt.preventDefault();
    if(!email || !password){ 
      if(!email && !password){ toast.error("Please fill both email and password correctly"); }
      else if(!email) { toast.error("Please fill email correctly"); }
      else if(!password){ toast.error("Please fill password correctly"); }
      
      return; 
    }
    mutate({email, password});

    setTimeout(()=>{
      navigate('/dashboard', {replace: true});
    }, 3000);
    navigate('/dashboard', {replace: true});
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address" orientation="vertical">
        <Input
          type="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </FormRow>
      <FormRow label="Password" orientation="vertical">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </FormRow>

      <FormRow orientation="vertical">
        <Button size="large" disabled={isLoading} >{(isLoading) ? "Loggin in" : "Login"}</Button>
      </FormRow>
    </Form>
  );
}

export default LoginForm;
