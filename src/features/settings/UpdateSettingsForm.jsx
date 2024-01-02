import { useForm } from 'react-hook-form';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import { useSettings } from './useSettings';
import { useUpdateSetting } from './useUpdateSetting';
import Button from '../../ui/Button';

function UpdateSettingsForm() {
  // using that custom hook that we created for reading data
  const {isLoading, settingsData: {minBookingLength, maxBookingLength, maxGuestPerBooking, breakfastPrice} ={}} = useSettings();

  const {isUpdatingSetting, mutateUpdateSetting} = useUpdateSetting(); // using that custom hook created for updating (mutating) data

  const {register, handleSubmit, formState} = useForm(); // coming from 'react-hook-form'

  function myOwnSubmitFn(data){ // onSubmit will trigger handleSubmit (provided by react-hook-form), which in tern will call 'myOwnSubmitFn'
    console.log(data); // This is the actual data of submitted form
    
    // mutate(data);
    mutateUpdateSetting(data); 
  }

  function myOwnError(err){
    console.log(err); // same as [const {errors} = formState();]
  }

  if(isLoading){ return <Spinner></Spinner>; }

  return (
    <Form onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}> 

      <FormRow label='Minimum nights/booking'>
        <Input type='number' id='minBookingLength' {...register("minBookingLength")} disabled={isUpdatingSetting} defaultValue={minBookingLength} />
      </FormRow>

      <FormRow label='Maximum nights/booking'>
        <Input type='number' id='maxBookingLength' {...register("maxBookingLength")} disabled={isUpdatingSetting} defaultValue={maxBookingLength} />
      </FormRow>

      <FormRow label='Maximum guests/booking'>
        <Input type='number' id='maxGuestPerBooking' {...register("maxGuestPerBooking")} disabled={isUpdatingSetting} defaultValue={maxGuestPerBooking} />
      </FormRow>

      <FormRow label='Breakfast price'>
        <Input type='number' id='breakfastPrice' {...register("breakfastPrice")} disabled={isUpdatingSetting} defaultValue={breakfastPrice} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset"> Cancel </Button>
        <Button disabled={isUpdatingSetting}>Update settings</Button>
      </FormRow>
      
    </Form>
  );
}

export default UpdateSettingsForm;
