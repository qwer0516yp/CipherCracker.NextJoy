import * as React from 'react';
import { AspectRatio, Box, Button, Card, CardContent, Typography } from '@mui/joy';

import Image from 'next/image';

import ConstructionIcon from '@mui/icons-material/Construction';
import HandymanIcon from '@mui/icons-material/Handyman';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BuildIcon from '@mui/icons-material/Build';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import OpenInNew from '@mui/icons-material/OpenInNew';

import siteMapPic from '../public/sitemap.png';

function SiteMapCard() {
  return (
    <Card>
      <AspectRatio minHeight="120px" maxHeight="820px">
        <Image
          alt="sitemap"
          src={siteMapPic}
          sizes="100vw"
          // Make the image display full width
          style={{
            width: '100%',
            height: 'auto',
          }}
          loading="lazy"
        />
      </AspectRatio>
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body-xs">https://st-akey.gitbook.io/cipher-cracker-next-joy</Typography>
        </div>
        <Button
          component="a"
          variant="solid"
          size="md"
          color="primary"
          startDecorator={<OpenInNew />}
          aria-label="Explore Gitbook page"
          href="https://st-akey.gitbook.io/cipher-cracker-next-joy"
          sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
        >
          Explore more on Gitbook
        </Button>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  
  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box sx={{ px: { xs: 2, md: 6 } }}>
        <h1>CipherCracker</h1>
        <Typography> - Your Swiss Army Knife to crack cipher related mystreries. Now available online for *FREE*.</Typography>
        <p><AutoAwesomeIcon /> <ConstructionIcon /> <BuildIcon />  <HomeRepairServiceIcon /> <CatchingPokemonIcon /> <HandymanIcon /> <AutoFixHighIcon/></p>

        <h3>Overview</h3>
        <p>
          CipherCracker is a web-based tool that helps you to crack ciphers and solve puzzles. It is a free and open-source project available on Github.
        </p>

        <h3>Site Map</h3>
        <SiteMapCard />

        <h3>Reference</h3>
        <p>
          <ul>
            <li><a href="https://st-akey.gitbook.io/cipher-cracker-next-joy">Userguide on Gitbook</a></li>
            <li><a href="https://github.com/qwer0516yp/CipherCracker.NextJoy">Source Code on Github</a></li>
            <li><a href="https://cryptobook.nakov.com/">Practical Cryptography For Developers, by Svetlin Nakov</a></li>
            <li><a href="https://fireship.io/lessons/node-crypto-examples/">Cryptography Concepts For Node.JS Developers, By Jeff Delaney</a></li>
            <li><a href="https://cryptojs.gitbook.io/docs">Crypto JS Gitbook</a></li>
          </ul>
        </p>
      </Box>
    </Box>
        
  );
}
