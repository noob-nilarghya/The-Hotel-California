
import { useState } from 'react';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import { getCurrentUser, updateUserData } from '../../services/apiAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function UpdateUserDataForm() {
  // We don't need the loading state
  const {isLoading, data: user} = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser
  });
  const {email} = user;
  const {fullName: currentFullName, avatar: oldImg} = user.user_metadata;

  const navigate= useNavigate();
  const queryClient = useQueryClient();

  // Controlled element [as we are not using 'react-hook-form']
  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(oldImg);


  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: (updatedUser) => updateUserData(updatedUser),
    onSuccess: (data) => {
      // console.log(data);
      toast.success(`User ${data.user.user_metadata.fullName.split(' ')[0]}'s account successfully updated`);
      queryClient.invalidateQueries({
        queryKey: ["user"]
      });
      setFullName(currentFullName);
      setAvatar(oldImg);
      setTimeout(()=>{
          navigate('/account', {replace: true});
      }, 3000);
    },
    onError: ()=> toast.error("Failed to update user's account")
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName) return;
    // console.log(fullName, avatar, oldImg);
    mutate({ fullName, avatar, oldImg });
  }

  function handleCancel(e) {
    // We don't even need preventDefault because this button was designed to reset the form (remember, it has the HTML attribute 'reset')
    setFullName(currentFullName);
    setAvatar(oldImg);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label='Email address'>
        <Input value={email} disabled />
      </FormRow>
      <FormRow label='Full name'>
        <Input
          type='text'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isUpdating}
          id='fullName'
        />
      </FormRow>
      <FormRow label='Avatar image'>
        <FileInput
          type='file'
          disabled={isUpdating}
          id='avatar'
          accept='image/*'
          onChange={(e) => setAvatar(e.target.files[0])}
          // We should also validate that it's actually an image, but never mind
        />
      </FormRow>
      <FormRow>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
