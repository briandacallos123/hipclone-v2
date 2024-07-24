import { Controller, FormProvider, useFormContext } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import Paper, { PaperProps } from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
// import { ICheckoutCardOption, ICheckoutPaymentOption } from 'src/types/product';
// components
import Iconify from 'src/components/iconify';
//
import PaymentNewCardDialog from '../../../payment/payment-new-card-dialog';
import Image from 'next/image';
import { Typography } from '@mui/material';
import { RHFUpload } from '@/components/hook-form';
import { useCallback, useState } from 'react';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  options: any[];
  cardOptions: any[];
}

export default function CheckoutPaymentMethods({ options, cardOptions, ...other }: Props) {
  const { control } = useFormContext();

  const newCard = useBoolean();

  console.log(cardOptions, 'OPTIONS_______________')



  return (
    <>
      <Card {...other}>
        <CardHeader title="Payment" />

        <Controller
          name="payment"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Stack sx={{ px: 3, pb: 3 }}>

              {options.map((option) => (
                <OptionItem
                  option={option}
                  control={control}
                  key={option.label}
                  onOpen={newCard.onTrue}
                  cardOptions={cardOptions}
                  selected={field.value === option.value}
                  isCredit={option.value === 'gcash' && field.value === 'gcash'}
                  onClick={() => {
                    field.onChange(option.value);
                  }}
                />
              ))}

              {!!error && (
                <FormHelperText error sx={{ pt: 1, px: 2 }}>
                  {error.message}
                </FormHelperText>
              )}
            </Stack>
          )}
        />
      </Card>

      <PaymentNewCardDialog open={newCard.value} onClose={newCard.onFalse} />
    </>
  );
}

// ----------------------------------------------------------------------

type OptionItemProps = PaperProps & {
  option: any;
  cardOptions: any[];
  selected: boolean;
  isCredit: boolean;
  onOpen: VoidFunction;
  control: any;
};

function OptionItem({
  option,
  cardOptions,
  selected,
  isCredit,
  onOpen,
  control,
  ...other
}: OptionItemProps) {
  const { value, label, description } = option;
  const [myThumb, setMyThumb] = useState(null)

  const handleDropGcash = useCallback(
    (acceptedFiles: File[]) => {
    
        const newFiles = Object.assign(acceptedFiles[0], {
            preview: URL.createObjectURL(acceptedFiles[0])
        })
        setMyThumb(newFiles?.preview)
        console.log(newFiles,'filesss')
    },
    []
);


  return (
    <Paper
      variant="outlined"
      key={value}
      sx={{
        p: 2.5,
        mt: 2.5,
        cursor: 'pointer',
        ...(selected && {
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
        }),
      }}
      {...other}
    >
      <ListItemText
        primary={
          <Stack direction="row" alignItems="center">
            <Box component="span" sx={{ flexGrow: 1 }}>
              {label}
            </Box>
            <Stack spacing={1} direction="row" alignItems="center">
              {value === 'gcash' && (
                <>
                  <Image src="/assets/gcash.png" height={24} alt="gcash" width={24} />

                </>
              )}
              {value === 'paypal' && <Iconify icon="logos:paypal" width={24} />}
              {value === 'cash' && <Iconify icon="solar:wad-of-money-bold" width={32} />}
            </Stack>
          </Stack>
        }
        secondary={description}
        primaryTypographyProps={{ typography: 'subtitle1', mb: 0.5 }}
        secondaryTypographyProps={{ typography: 'body2' }}
      />

      {isCredit && (
        <Stack
          spacing={2.5}
          alignItems="flex-start"
          sx={{
            pt: 2.5,

          }}
        >
          <TextField select fullWidth label="Account Number" SelectProps={{ native: true }}>
            {cardOptions.map((card) => (
              <option key={card.value} value={card.value}>
                {card.label}
              </option>
            ))}
          </TextField>

          {
            (() => {
              const image = `https://hip.apgitsolutions.com/${cardOptions[0]?.attachment?.split('/').splice(1).join("/")}`;
              console.log(image, 'IMAGEEEEEEEEEEE')
              return <Stack sx={{ ml: 2 }} gap={1}>
                <Typography variant="overline" sx={{ color: 'gray' }}>QR Code</Typography>
                <img src={image} alt="payment attachment" width={200} height={200} />
              </Stack>
            })()
          }

          <Controller
            name="refNumber"
            control={control}
            render={({ field }) => (
              <Stack>
                <TextField onChange={(e) => {
                  field.onChange(e.target.value)
                }} label="Reference Number" name="refNumber" />
              </Stack>
            )}
          />

          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <Stack>
                <RHFUpload
                  name="avatar"
                  thumbnail
                  maxSize={3145728}
                  onDrop={(acceptedFiles:File[])=>{
                    const newFiles = Object.assign(acceptedFiles[0], {
                      preview: URL.createObjectURL(acceptedFiles[0])
                    })
                    field.onChange(newFiles)
                  }}
                  onRemove={()=>{}}
                  onRemoveAll={()=>{}}
                />
              </Stack>
            )}
          />

        </Stack>
      )}
    </Paper>
  );
}
