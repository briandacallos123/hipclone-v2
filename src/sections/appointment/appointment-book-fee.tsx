'use client';

import { useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
// utils
import { fCurrency } from 'src/utils/format-number';
import { Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

type Props = CardProps & {
  professionalFee?: number;
  additionalFee?: {
    certificate: number;
    clearance: number;
    abstract: number;
  };
  data: any;
  isLoading: any;
  setLoading: any;
};

export default function AppointmentBookFee({
  isLoading,
  setLoading,
  professionalFee,
  additionalFee,
  data,
}: any) {
  const formatInt = (inputValue: any) => {
    if (typeof inputValue === 'number') {
      return inputValue.toFixed(2);
    }
    return '';
  };

  const ADDITIONAL_FEES = [
    { type: 'Medical certificate', amount: data?.MEDCERT_FEE || 0.0 },
    { type: 'Medical clearance', amount: data?.MEDCLEAR_FEE || 0.0 },
    { type: 'Medical abstract', amount: data?.MEDABSTRACT_FEE || 0.0 },
  ];

  return (
    <Card sx={{ p: 3 }}>
      {data?.isFeeShow !== 0 && <>
        <Stack direction="row">
        <Stack sx={{ width: 1 }}>
          <Typography variant="h6">Professional fee</Typography>
        </Stack>
        <Stack sx={{ width: 1 }}>
          {!isLoading ? (
            <Typography variant="h6">{`₱ ${formatInt(data?.FEES)}`}</Typography>
          ) : (
            <Skeleton sx={{ width: 180, height: 17, marginBottom: 2 }} />
          )}
        </Stack>
      </Stack>
      <Typography sx={{ mb: 3, typography: 'caption', color: 'error.main', lineHeight: 1.5 }}>
        Not applicable for HMO consultations.
      </Typography>
      </>}

      {data?.isAddReqFeeShow !== 0 && <>
        <Typography variant="h6" sx={{ marginBottom: isLoading && 2 }}>
        Additional fees
      </Typography>
      {!isLoading
        ? ADDITIONAL_FEES.map((item) => (
            <Stack key={item.type} direction="row">
              <Stack sx={{ width: 1 }}>
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {item.type}
                </Typography>
              </Stack>
              <Stack sx={{ width: 1 }}>
                <Typography variant="subtitle1" sx={{ opacity: 0.7 }}>
                  {`₱ ${formatInt(item.amount)}`}
                </Typography>
              </Stack>
            </Stack>
          ))
        : [...Array(5)].map((_, index) => (
            <Skeleton sx={{ width: 180, height: 17, marginBottom: 1 }} />
          ))}
      {/* {} */}
      <Typography sx={{ typography: 'caption', color: 'error.main', lineHeight: 1.5 }}>
        Requests not covered by HMO will be charged to patient.
      </Typography>
      </>}
    </Card>
  );
}
