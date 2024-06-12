import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import { Box, CssBaseline } from '@mui/joy';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ProtectedComponent from '@/components/ProtectedComponent';

export const metadata = {
  title: 'CipherCracker',
  description: 'crack the cipher mystery',
};

export default function RootLayout(props: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
          <Sidebar>
            <ProtectedComponent/>
          </Sidebar>
          <Header />
          <Box
            component="main"
            className="MainContent"
            sx={{
              pt: { xs: 'calc(12px + var(--Header-height))', md: 3 },
              pb: { xs: 2, sm: 2, md: 3 },
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              height: '100dvh',
              gap: 1,
              overflow: 'auto',
            }}
          >
            <main>
              {props.children}
            </main>
          </Box>
        </Box>
      </CssVarsProvider>
      </body>
    </html>
  );
}
