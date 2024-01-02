import styled from "styled-components";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from '../../ui/Textarea'
import { useForm } from "react-hook-form"; // This ract 3rd party library is used to handle form subbmit operation and validation seamlessly
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

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

function CreateCabinForm({setShowForm}) {
  const {register, handleSubmit, reset, getValues, formState} = useForm(); // coming from 'react-hook-form'

  const queryClient = useQueryClient();

  const {isLoading: isCreating, mutate} = useMutation({
    mutationFn: (newCabin) => createCabin(newCabin),
    onSuccess: () => {
      toast.success("New cabin inserted successfully");
      queryClient.invalidateQueries({
        queryKey: ["cabins"]
      });
      reset();
      setShowForm(false); // close the form
    },
    onError: (err)=> toast.error(err.message)
  });

  function myOwnSubmitFn(data){ // onSubmit will trigger handleSubmit (provided by react-hook-form), which in tern will call 'myOwnSubmitFn'
    console.log(data); // This is the actual data of submitted form
    
    // mutate(data);
    mutate({...data, image: data.image[0]}); 
  }

  function myOwnError(err){
    console.log(err); // same as [const {errors} = formState();]
  }

  const {errors} = formState;

  return (
    // Notice carfully, no controlled input elements are requierd. All thanks to react-hook-form
    <Form onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}>
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
        <Input type="text" id="name" {...register("name", {required: "This field is required"})} disabled={isCreating} /> {/* Here 'name' id */}
        {errors?.name?.message && <Error>{errors.name.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
        <Input type="number" id="maxCapacity" {...register("maxCapacity", {
                                                required: "This field is required",
                                                min: {
                                                  value: 1,
                                                  message: "Maximum capacity should be atleast 1"
                                                }
        })} disabled={isCreating} />
        {errors?.maxCapacity?.message && <Error>{errors.maxCapacity.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="regularPrice">Regular price</Label>
        <Input type="number" id="regularPrice" {...register("regularPrice", {required: "This field is required"})} disabled={isCreating} />
        {errors?.regularPrice?.message && <Error>{errors.regularPrice.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="discount">Discount</Label>
        <Input type="number" id="discount" defaultValue={0} {...register("discount", {
                                                              required: "This field is required",
                                                              validate: (val) => (val < getValues().regularPrice) || "Discount should be less than regular price"
        })} disabled={isCreating} />
        {errors?.discount?.message && <Error>{errors.discount.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="description">Description for website</Label>
        <Textarea type="number" id="description" defaultValue="" {...register("description", {required: "This field is required"})} disabled={isCreating} />
        {errors?.description?.message && <Error>{errors.description.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="image">Cabin photo</Label>
        <FileInput id="image" accept="image/*" type="file" {...register("image", {required: "This field is required"})} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset"> Cancel </Button>
        <Button disabled={isCreating}>Add cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;