import * as React from 'react';
import { Box } from '@mui/joy';
import { User } from '@/app/user';

export default function HeaderSection() {
  return (
    <Box sx={{ flexGrow: 1}}>
      <User />
    </Box>
  );
}
