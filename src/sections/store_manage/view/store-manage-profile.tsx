import { RHFTextField, RHFMultiCheckbox, RHFUploadAvatar, RHFEditor, RHFCheckbox, RHFAutocomplete } from '@/components/hook-form';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import React, { useCallback, useMemo } from 'react'
import { useForm, Controller, CustomRenderInterface, FieldValues } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import FormProvider from '@/components/hook-form/form-provider';
import { fData } from '@/utils/format-number';
import LoadingButton from '@mui/lab/LoadingButton';
import { formatClinicTime } from '@/utils/format-time';
import StoreManageController from './storeManageController';
import { revalidateStore } from '../actions/store';

const complete_option = [
    'medecine', 'foods'
]


const OPERATIONAL_DAY = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tueday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
];

const UpdateUserSchema = Yup.object().shape({

});

type StoreManageProfileProps = {
    data: any
}

function convertTimeToDate(date: string) {
    console.log(date)
    // Get current date
    var currentDate = new Date();

    // Set the time value
    var timeValue = date;

    // Split the time into hours, minutes, and seconds
    var timeParts = timeValue.split(":");
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);
    var seconds = parseInt(timeParts[2], 10);

    // Set the time on the current date
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    currentDate.setSeconds(seconds);

    // Format the date string
    var formattedDate = currentDate.toString();
    return formattedDate
}

const convertTime = (timeStr: any) => {
    if (!timeStr) {
        return null;
    }

    let [hours, minutes, seconds] = timeStr.split(':').map(Number);

    // Check if the timeStr includes a timezone (ends with 'Z')
    if (timeStr.endsWith('Z')) {
        // Extract the milliseconds (if available)
        const date = new Date(timeStr);
        return isNaN(date) ? null : date;
    }

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
};

const StoreManageProfile = ({ data }: StoreManageProfileProps) => {

    const { handleSubmitUpdate } = StoreManageController()

    const sTime = convertTime(data?.start_time);
    // const sTimeNew = newFormatTimeString(currentItem?.start_time);
    const eTime = convertTime(data?.end_time);
    // const eTimeNew = newFormatTimeString(currentItem?.end_time);

    console.log(data,'DATAAAAAAAAAAAAAAAAAA DAYSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS')
    const defaultValues = useMemo(
        () => ({
            id: data?.id,
            storeName: data?.name || '',
            storeAdd: data?.address || '',
            start_time: new Date(sTime) || '',
            end_time: new Date(eTime) || "",
            attachment: (() => {
                return `https://hip.apgitsolutions.com/${data?.attachment_store?.file_url?.split('/').splice(1).join('/')}`
            })() || '',
            days: data?.days?.map((item)=>Number(item)) || [],
            description: data?.description || '',
            delivery: data?.is_deliver ? true : false || 0,
            product_types: (() => {
                return data?.product_types?.split(',')
            })()
        }),
        [data]
    );

    const methods = useForm<FieldValues>({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    });

    const {
        control,
        setValue,
        handleSubmit,
        watch,
        reset,
        getValues,
        formState: { isSubmitting },
    } = methods;

    const removeTags = (val: string) => {
        const cleanedDescription = val.replace(/<[^>]+>/g, '');
        return cleanedDescription;
    }



    const onSubmit = useCallback(
        async (data: any) => {
            data.description = removeTags(data.description)

            const start_time = formatClinicTime(data.start_time)
            const end_time = formatClinicTime(data.end_time)

            delete data.start_time;
            delete data.end_time;

            const newData = { ...data }
            newData.startTime = start_time;
            newData.endTime = end_time;

            try {
                await handleSubmitUpdate(newData)
                revalidateStore()
            } catch (error) {
                console.error(error);
            }
        },
        []
    );

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });


            if (file) {
                setValue('attachment', newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );

    return (
        <Box sx={{
            mt: 3
        }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container gap={3}>
                    <Grid lg={3}>
                        <Card sx={{ py: { md: 10, xs: 1 }, px: { md: 3, xs: 1 }, mb: 3, textAlign: 'center' }}>
                            <RHFUploadAvatar
                                name="attachment"
                                maxSize={3145728}
                                onDrop={handleDrop}
                                helperText={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 3,
                                            mx: 'auto',
                                            display: 'block',
                                            textAlign: 'center',
                                            color: 'text.disabled',
                                        }}
                                    >
                                        Allowed *.jpeg, *.jpg, *.png, *.gif
                                        <br /> max size of {fData(3145728)}
                                    </Typography>
                                }
                            />
                        </Card>
                    </Grid>
                    <Grid lg={6}>
                        <Box
                            gap={2}
                        // rowGap={{ md: 3, xs: 1 }}
                        // columnGap={{ md: 2, xs: 1 }}
                        // display="grid"
                        // gridTemplateColumns={{
                        //     xs: 'repeat(1, 1fr)',
                        //     sm: 'repeat(2, 1fr)',
                        // }}
                        // sx={{
                        //     mb: 3
                        // }}
                        >
                            <Box rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                                sx={{ mb: 1 }}
                            >
                                <RHFTextField fullWidth name="storeName" label=" Name" />
                                <RHFTextField fullWidth name="storeAdd" label="Address" />
                            </Box>
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                                sx={{ mb: 1 }}
                            >
                                <Controller
                                    name="start_time"
                                    control={control}
                                    render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                                        <TimePicker
                                            label="Start Time"
                                            value={field.value}
                                            onChange={(newValue) => {
                                                field.onChange(newValue);
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!error,
                                                    helperText: error?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="end_time"
                                    control={control}
                                    render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                                        <TimePicker
                                            label="End Time"
                                            value={field.value}
                                            onChange={(newValue) => {
                                                console.log(newValue, 'NEW VALUE__________')
                                                field.onChange(newValue);
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!error,
                                                    helperText: error?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Stack sx={{ mb: 2 }}>
                                <RHFAutocomplete options={complete_option} name="product_types" />
                            </Stack>
                            <RHFCheckbox name="delivery" label="Do you do delivery?" />
                            <Stack direction="row" alignItems="center">
                                {/* <RHFEditor  simple  name="description" /> */}
                                <RHFTextField
                                   name="description"
                                    multiline
                                    fullWidth
                                    rows={4}
                                    // placeholder="Tell something about the medecine..."
                                    sx={{
                                        p: 1,
                                    }}
                                />
                            </Stack>
                            <RHFMultiCheckbox
                                row
                                name="days"
                                label="Operational Days"
                                options={OPERATIONAL_DAY}
                                defaultChecked={defaultValues?.days?.map((value: any) =>
                                    OPERATIONAL_DAY.includes(value)
                                )}
                            />

                        </Box>
                        <Stack spacing={3} alignItems="flex-end" sx={{ my: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Save Changes
                            </LoadingButton>
                        </Stack>
                    </Grid>

                </Grid>

            </FormProvider>
        </Box>

    )
}

export default StoreManageProfile