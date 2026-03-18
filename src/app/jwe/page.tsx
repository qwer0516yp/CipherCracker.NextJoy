'use client';

import React from 'react';
import { Box, Breadcrumbs } from '@mui/joy';
import NextLink from 'next/link';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import JweCracker from '@/components/front-end/JweCracker';

export default function JwePage() {
  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box
        sx={{
          position: 'initial',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body',
          zIndex: 9995,
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon />}
            sx={{ pl: 0 }}
          >
            <NextLink color="neutral" href="/" passHref>
              <HomeRoundedIcon />
            </NextLink>
            <NextLink
              color="neutral"
              href="/jwe"
              style={{ textDecoration: 'none' }}
              passHref
            >
              JWE
            </NextLink>
          </Breadcrumbs>
        </Box>
      </Box>
      <Box sx={{ px: { xs: 2, md: 6 } }}>
        <JweCracker />
      </Box>
    </Box>
  );
}
