'use client';

import * as React from 'react';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import NextLink from 'next/Link';

import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import HashGenerator from '@/components/front-end/HashGenerator';

export default function Home() {
  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
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
            <Link
              underline="none"
              color="neutral"
              href="#some-link"
              aria-label="Home"
            >
              <HomeRoundedIcon />
            </Link>
            <NextLink
              color="neutral"
              href="/hash"
              passHref
            >
              Hash
            </NextLink>
          </Breadcrumbs>
          <HashGenerator />
        </Box>
      </Box>
    </Box>
  );
}
