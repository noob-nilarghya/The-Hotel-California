import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { signup } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Email regex: /\S+@\S+\.\S+/

const FormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

function SignupForm() {

    const {register, handleSubmit, reset, getValues, formState} = useForm();
    const navigate= useNavigate();

    const queryClient= useQueryClient();

    const {isLoading, mutate} = useMutation({
        mutationFn: ({fullName, email, password}) => signup({fullName, email, password}),
        onSuccess: (data) => {
            toast.success(`User ${data.user.user_metadata.fullName.split(' ')[0]}'s account successfully created`);
            reset();
            setTimeout(()=>{
                navigate('/login', {replace: true});
            }, 3000);
        },
        onError: ()=> toast.error("Failed to create new user account")
    });

    function myOwnSubmitFn({fullName, email, password}) {
        mutate({fullName, email, password});
    }

    function myOwnError(err) {
        console.log(err); // same as [const {errors} = formState();]
    }

    const {errors} = formState;

    return (
        <Form onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}>
            <FormRow>
                <Label htmlFor="fullName">Full Name</Label>
                <Input type="text" id="fullName" {...register('fullName', {required: "This field is required"})} disabled={isLoading} />
                {errors?.fullName?.message && <Error>{errors.fullName.message}</Error>}
            </FormRow>

            <FormRow>
                <Label htmlFor="email">Email ID</Label>
                <Input type="email" id="email" {...register('email', {
                                                                    required: "This field is required", 
                                                                    pattern: {
                                                                        value: /\S+@\S+\.\S+/, 
                                                                        message: "Please provide a valid email"
                                                                    }
                })} disabled={isLoading} />
                {errors?.email?.message && <Error>{errors.email.message}</Error>}
            </FormRow>

            <FormRow>
                <Label htmlFor="password">Password (min 8 character)</Label>
                <Input type="password" id="password" {...register('password', {
                                                                            required: "This field is required",
                                                                            min: {
                                                                                value: 8,
                                                                                message: "Password should be atleast 8 character long"
                                                                            }
                })} disabled={isLoading} />
                {errors?.password?.message && <Error>{errors.password.message}</Error>}
            </FormRow>

            <FormRow>
                <Label htmlFor="passwordConfirm">Confirm Password</Label>
                <Input type="password" id="passwordConfirm" {...register('passwordConfirm', {
                                                                        required: "This field is required",
                                                                        validate: (val) => (val === getValues().password) ||"Confirm password should be same as password"
                })} disabled={isLoading} />
                {errors?.passwordConfirm?.message && <Error>{errors.passwordConfirm.message}</Error>}
            </FormRow>

            <FormRow>
                {/* type is an HTML attribute! */}
                <Button variation="secondary" type="reset"> Cancel </Button>
                <Button>{(isLoading) ? "Creating account..." : "Create new user"}</Button>
            </FormRow>
        </Form>
    );
}

export default SignupForm;
