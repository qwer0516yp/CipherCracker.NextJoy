import { Box, Stack, Avatar, Typography, IconButton } from '@mui/joy';
import { auth, signIn, signOut } from '@/lib/auth';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

export async function User() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <Stack direction="row" justifyContent="end" spacing={1}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: "flex-end" }}>
          <Avatar
            variant="outlined"
            size="sm"
            src="/images/unknown-user.png"
          />
          <Box sx={{ width: 200, flex: 1 }}>
            <Typography level="title-sm">Guest</Typography>
            <Typography level="body-xs">Sign in to access like a Pro</Typography>
          </Box>
          <Box sx={{ width: 40, flex: 0.5 }}>
            <form
              action={async () => {
                'use server';
                await signIn('github');
              }}
            >
              <IconButton type="submit" size="sm" variant="solid" color="success">
                <LoginRoundedIcon />
              </IconButton>
            </form>
          </Box>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack direction="row" justifyContent="end" spacing={1}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: "flex-end" }}>
        <Avatar
          variant="outlined"
          size="sm"
          src={user.image!}
          alt="/images/unknown-user.png"
        />
        <Box sx={{ width: 200, flex: 1 }}>
          <Typography level="title-sm">{user.name}</Typography>
          <Typography level="body-xs">{user.email}</Typography>
        </Box>
        
        <Box sx={{ width: 40, flex: 0.5 }}>
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <IconButton type="submit" size="sm" variant="soft" color="neutral">
              <LogoutRoundedIcon />
            </IconButton>
          </form>
        </Box>
      </Box>
    </Stack>
  );
}