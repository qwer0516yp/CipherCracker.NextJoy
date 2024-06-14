'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Box, Typography, Avatar, IconButton } from '@mui/joy';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import React from 'react';

const ProtectedComponent = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <React.Fragment>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">You are not logged in</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="success">
          <LoginRoundedIcon onClick={() => signIn()}/>
        </IconButton>
      </React.Fragment>
    );
  }

  console.log(session?.user);
  
  return (
    <React.Fragment>
        <Avatar
          variant="outlined"
          size="sm"
          src={session?.user?.image!}
          alt="/images/unknown-user.png"
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm" noWrap>{session?.user?.name}</Typography>
          <Typography level="body-xs" noWrap>{session?.user?.email}</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral">
          <LogoutRoundedIcon onClick={() => signOut()}/>
        </IconButton>
    </React.Fragment>
  );
};

export default ProtectedComponent;