import { useFormContext, Controller, CustomRenderInterface } from 'react-hook-form';
// @mui
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

interface Props<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
}

export default function RHFAutocompleteAp<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  name,
  label,
  placeholder,
  helperText,
  ...other
}: Omit<Props<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'>) {
  const { control, setValue, getValues } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }: CustomRenderInterface) => (
        <Autocomplete
          {...field}
          onChange={(event, newValue) =>{
            let oldValue = getValues(name)
            
            if(newValue){
              const isExists = oldValue?.find((item:any)=>item === newValue);
              
              if(!isExists){
                oldValue.push(newValue)
                setValue(name, oldValue, {shouldValidate:true})
              }else{
                oldValue = oldValue.filter((item:any)=>item!==newValue)
                setValue(name, oldValue, {shouldValidate:true})
              }
            }else{
              setValue(name, [], {shouldValidate:true})
            }
          }}
          renderInput={(params) => (
            <TextField
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error ? error?.message : helperText}
              {...params}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
