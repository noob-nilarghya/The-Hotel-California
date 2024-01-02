import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserPassword } from '../../services/apiAuth';

import styled from 'styled-components';
import toast from 'react-hot-toast';

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

function UpdatePasswordForm() {
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;
  const queryClient = useQueryClient();

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: (updatedPwd) => updateUserPassword(updatedPwd),
    onSuccess: (data) => {
      // console.log(data);
      toast.success(`User ${data.user.user_metadata.fullName.split(' ')[0]}'s password successfully updated`);
      queryClient.invalidateQueries({
        queryKey: ["user"]
      });
      reset();
      setTimeout(()=>{
          navigate('/account', {replace: true});
      }, 3000);
    },
    onError: (err)=> toast.error(err.message)
  });

  function myOwnSubmitFn({ password }) {
    mutate({ password });
  }

  function myOwnError(err) {
    console.log(err); // same as [const {errors} = formState();]
  }

  return (
    <Form onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}>
      <FormRow>
        <Label htmlFor="password">Password (min 8 characters)</Label>
        <Input
          type='password'
          id='password'
          // this makes the form better for password managers
          autoComplete='current-password'
          disabled={isUpdating}
          {...register('password', {
            required: 'This field is required',
            minLength: {
              value: 8,
              message: 'Password needs a minimum of 8 characters',
            },
          })}
        />
        {errors?.password?.message && <Error>{errors.password.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="passwordConfirm">Confirm password</Label>
        <Input
          type='password'
          autoComplete='new-password'
          id='passwordConfirm'
          disabled={isUpdating}
          {...register('passwordConfirm', {
            required: 'This field is required',
            validate: (value) =>
              getValues().password === value || 'Passwords need to match',
          })}
        />
        {errors?.passwordConfirm?.message && <Error>{errors.passwordConfirm.message}</Error>}
      </FormRow>
      <FormRow>
        <Button type='reset' variation='secondary'> Cancel </Button>
        <Button disabled={isUpdating}>Update password</Button>
      </FormRow>
    </Form>
  );
}

export default UpdatePasswordForm;
