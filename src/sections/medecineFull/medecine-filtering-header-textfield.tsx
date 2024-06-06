// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
// components
import Iconify from 'src/components/iconify';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { useCallback, useMemo, useState } from 'react';
// ----------------------------------------------------------------------

type Props = {
    sort: string;
    onSort: (newValue: string) => void;
    sortOptions: {
        id: number,
        value: string;
        label: string;
    }[];
    onGrid:()=>void;
    onRow:()=>void
};

export default function MedecineFilteringHeaderTextField() {

    const [alignment, setAlignment] = useState<string | null>('grid');

    const handleAlignment = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string | null,
    ) => {
      setAlignment(newAlignment);
    };

    const defaultValues = useMemo(
        () => ({
         
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
      );
    const methods = useForm({
        defaultValues,
      });
    
      const {
        handleSubmit,
        watch,
        setValue,
        formState: { isSubmitting },
      } = methods;

      const onSubmit = useCallback(
        async (data: any) => {
          try {
          
    
            console.info('DATA', data);
          } catch (error) {
            console.error(error);
          }
        },
        []
      );

    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <RHFTextField name={'search'} label="Search for a store" />

                </FormProvider>

            </Box>
        </>
    );
}
