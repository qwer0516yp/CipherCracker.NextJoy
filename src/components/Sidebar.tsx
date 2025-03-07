'use client'

import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import MediationIcon from '@mui/icons-material/MediationRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AbcIcon from '@mui/icons-material/Abc';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import TagIcon from '@mui/icons-material/Tag';
import VerifiedIcon from '@mui/icons-material/Verified';
import KeyIcon from '@mui/icons-material/Key';
import Filter3Icon from '@mui/icons-material/Filter3';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import TokenIcon from '@mui/icons-material/Token';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';

import SidebarDrawer from './SidebarDrawer';

import ColorSchemeToggle from './ColorSchemeToggle';
import { closeSidebar } from '../utils';
import NextLink from 'next/link';
import SessionProvider from "@/components/SessionProvider";

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: '0.2s ease',
          '& > *': {
            overflow: 'hidden',
          },
        }}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar({children}: {children:React.ReactNode}) {
  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconButton variant="soft" color="primary" size="sm">
          <BrightnessAutoRoundedIcon />
        </IconButton>
        <Typography level="title-md">CipherCracker</Typography>
        <ColorSchemeToggle sx={{ ml: 'auto' }} />
      </Box>
      <Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder="coming soon..." />
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '10px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>
              Basic
          </ListSubheader>
          <ListItem>
            <ListItemButton>
              <AbcIcon />
              <ListItemContent>
                <NextLink color="neutral" href="/encoding" style={{textDecoration: 'none'}} passHref>
                  <Typography level="title-sm">Encoding</Typography>
                </NextLink> 
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <MediationIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Hashing</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem>
                  <ListItemButton>
                    <TagIcon />
                    <ListItemContent>
                      <NextLink color="neutral" href="/hash" style={{textDecoration: 'none'}} passHref>
                        <Typography level="title-sm">Hash</Typography>
                      </NextLink> 
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <EditNoteIcon />
                    <ListItemContent>
                      <NextLink color="neutral" href="/hmac" style={{textDecoration: 'none'}} passHref>
                        <Typography level="title-sm">HMAC</Typography>
                      </NextLink>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <KeyIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Symmetric</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem>
                  <ListItemButton>
                    <VerifiedIcon />
                    <ListItemContent>
                      <NextLink color="neutral" href="/aes" style={{textDecoration: 'none'}} passHref>
                        <Typography level="title-sm">AES</Typography>
                      </NextLink> 
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <VerifiedIcon />
                    <ListItemContent>
                      <NextLink color="neutral" href="/aesgcm" style={{textDecoration: 'none'}} passHref>
                        <Typography level="title-sm">AES-GCM (Server)</Typography>
                      </NextLink> 
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <Filter3Icon />
                    <ListItemContent>
                      <NextLink color="neutral" href="/3des" style={{textDecoration: 'none'}} passHref>
                        <Typography level="title-sm">3DES</Typography>
                      </NextLink>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <ShuffleIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Asymmetric</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem>
                  <ListItemButton>
                    <SyncAltIcon />
                    <ListItemContent>
                      <NextLink color="neutral" href="/RSA" style={{textDecoration: 'none'}} passHref>
                        <Typography level="title-sm">RSA</Typography>
                      </NextLink> 
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <AutoGraphIcon />
                    <ListItemContent>
                      <NextLink color="neutral" href="/ECC" style={{textDecoration: 'none'}} passHref>
                        <Typography level="title-sm">ECC</Typography>
                      </NextLink>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <TokenIcon />
                  <ListItemContent>
                    <Typography level="title-sm">JWT</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem>
                  <ListItemButton>
                    <TokenIcon />
                    <ListItemContent>
                      <NextLink color="neutral" href="/jwt" style={{textDecoration: 'none'}} passHref>
                        <Typography level="title-sm">JWT / JWS</Typography>
                      </NextLink> 
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <TokenIcon />
                    <ListItemContent>
                      <NextLink color="neutral" href="/jwk" style={{textDecoration: 'none'}} passHref>
                        <Typography level="title-sm">JWK</Typography>
                      </NextLink> 
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <EnhancedEncryptionIcon />
                    <ListItemContent>
                      <NextLink color="neutral" href="/jwe" style={{textDecoration: 'none'}} passHref>
                        <Typography level="title-sm">JWE</Typography>
                      </NextLink>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>
        </List>

        <List
          size="sm"
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
            '--List-gap': '8px',
            mb: 2,
          }}
        >
          <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>
              Pro
          </ListSubheader>
          <ListItem>
            <ListItemButton role="menuitem" component="a" href="https://buymeacoffee.com/owenyuan">
              <Diversity1Icon />
              Support
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <SettingsRoundedIcon />
              Settings
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <SportsEsportsIcon />
              <ListItemContent>
                <NextLink color="neutral" href="/sandbox" style={{textDecoration: 'none'}} passHref>
                  <Typography level="title-sm">Sandbox</Typography>
                </NextLink>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
        <Card
          invertedColors
          variant="soft"
          color="warning"
          size="sm"
          sx={{ boxShadow: 'none' }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography level="title-sm">Drawer Note</Typography>
          </Stack>
          <Typography level="body-xs">
            A temp text notepad that persists your note across pages.
          </Typography>
          <SidebarDrawer />
        </Card>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </Box>
    </Sheet>
  );
}
