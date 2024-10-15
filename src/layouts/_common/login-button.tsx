// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
//
import { NextAuthLoginView } from 'src/sections/auth';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
  id?: string;
  isLoggedIn?: any;
  setLoggedIn?: any;
};

export default function LoginButton({ setLoggedIn, isLoggedIn, sx, id }: Props) {
  const open = useBoolean();
  const [isDoctor, setDoctor] = useState(false);


  useEffect(()=>{
    const role = localStorage.getItem('userRole');
    if(role === 'doctor'){
      setDoctor(true)
    }
  },[])

  return (
    <>
      <Button
        onClick={open.onTrue}
        // component={RouterLink}
        // href={paths.auth.login}
        variant="outlined"
        color="primary"
        sx={{ mr: 1, ...sx }}
      >
        Registered {isDoctor ? 'Doctor':'Patient'}? Login
      </Button>

      <NextAuthLoginView
        isDoctor={isDoctor}
        isLoggedIn={isLoggedIn}
        setLoggedIn={setLoggedIn}
        open={open.value}
        onClose={open.onFalse}
        id={id}
      />
    </>
  );
}
