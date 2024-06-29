'use client';

import * as React from 'react';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import NextLink from 'next/link';

import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import TripleDesCracker from '@/components/front-end/3DesCracker';

export default function Home() {
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
            <NextLink
              color="neutral"
              href="/"
              passHref
            >
              <HomeRoundedIcon />
            </NextLink>
            <NextLink
              color="neutral"
              href="/3des"
              style={{textDecoration: 'none'}}
              passHref
            >
              3DES
            </NextLink>
          </Breadcrumbs>
          <TripleDesCracker />
        </Box>
      </Box>
    </Box>
  );
}
