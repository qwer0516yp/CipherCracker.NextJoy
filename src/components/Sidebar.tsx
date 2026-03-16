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

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

interface NavSection {
  header: string;
  items: (NavItem | NavGroup)[];
}

const navSections: NavSection[] = [
  {
    header: 'Basic',
    items: [
      { label: 'Encoding', href: '/encoding', icon: <AbcIcon /> },
    ],
  },
  {
    header: '',
    items: [
      {
        label: 'Hashing',
        icon: <MediationIcon />,
        items: [
          { label: 'Hash', href: '/hash', icon: <TagIcon /> },
          { label: 'HMAC', href: '/hmac', icon: <EditNoteIcon /> },
        ],
      },
      {
        label: 'Symmetric',
        icon: <KeyIcon />,
        items: [
          { label: 'AES', href: '/aes', icon: <VerifiedIcon /> },
          { label: 'AES-GCM (Server)', href: '/aesgcm', icon: <VerifiedIcon /> },
          { label: '3DES', href: '/3des', icon: <Filter3Icon /> },
        ],
      },
      {
        label: 'Asymmetric',
        icon: <ShuffleIcon />,
        items: [
          { label: 'RSA', href: '/rsa', icon: <SyncAltIcon /> },
          { label: 'ECC', href: '/ECC', icon: <AutoGraphIcon /> },
        ],
      },
      {
        label: 'JWT',
        icon: <TokenIcon />,
        items: [
          { label: 'JWT / JWS', href: '/jwt', icon: <TokenIcon /> },
          { label: 'JWK', href: '/jwk', icon: <TokenIcon /> },
          { label: 'JWE', href: '/jwe', icon: <EnhancedEncryptionIcon /> },
        ],
      },
    ],
  },
];

function isGroup(item: NavItem | NavGroup): item is NavGroup {
  return 'items' in item;
}

function matchesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

function Toggler({
  defaultExpanded = false,
  forceOpen = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  forceOpen?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  const isOpen = forceOpen || open;
  return (
    <React.Fragment>
      {renderToggle({ open: isOpen, setOpen })}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
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
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredSections = React.useMemo(() => {
    if (!searchQuery.trim()) return navSections;

    return navSections
      .map((section) => {
        const filteredItems = section.items
          .map((item) => {
            if (isGroup(item)) {
              const matchingChildren = item.items.filter((child) =>
                matchesQuery(child.label, searchQuery)
              );
              const groupMatches = matchesQuery(item.label, searchQuery);
              if (groupMatches) return item; // show entire group
              if (matchingChildren.length > 0) return { ...item, items: matchingChildren };
              return null;
            }
            return matchesQuery(item.label, searchQuery) ? item : null;
          })
          .filter(Boolean) as (NavItem | NavGroup)[];

        if (filteredItems.length === 0) return null;
        return { ...section, items: filteredItems };
      })
      .filter(Boolean) as NavSection[];
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

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
      <Input
        size="sm"
        startDecorator={<SearchRoundedIcon />}
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
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
          {filteredSections.map((section) => (
            <React.Fragment key={section.header || 'main'}>
              {section.header && (
                <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>
                  {section.header}
                </ListSubheader>
              )}
              {section.items.map((item) =>
                isGroup(item) ? (
                  <ListItem nested key={item.label}>
                    <Toggler
                      forceOpen={isSearching}
                      renderToggle={({ open, setOpen }) => (
                        <ListItemButton onClick={() => setOpen(!open)}>
                          {item.icon}
                          <ListItemContent>
                            <Typography level="title-sm">{item.label}</Typography>
                          </ListItemContent>
                          <KeyboardArrowDownIcon
                            sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                          />
                        </ListItemButton>
                      )}
                    >
                      <List sx={{ gap: 0.5 }}>
                        {item.items.map((child) => (
                          <ListItem key={child.href}>
                            <ListItemButton>
                              {child.icon}
                              <ListItemContent>
                                <NextLink color="neutral" href={child.href} style={{textDecoration: 'none'}} passHref>
                                  <Typography level="title-sm">{child.label}</Typography>
                                </NextLink>
                              </ListItemContent>
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Toggler>
                  </ListItem>
                ) : (
                  <ListItem key={(item as NavItem).href}>
                    <ListItemButton>
                      {item.icon}
                      <ListItemContent>
                        <NextLink color="neutral" href={(item as NavItem).href} style={{textDecoration: 'none'}} passHref>
                          <Typography level="title-sm">{item.label}</Typography>
                        </NextLink>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                )
              )}
            </React.Fragment>
          ))}
          {isSearching && filteredSections.length === 0 && (
            <ListItem>
              <Typography level="body-sm" sx={{ py: 1, px: 1, color: 'text.tertiary' }}>
                No results found
              </Typography>
            </ListItem>
          )}
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
