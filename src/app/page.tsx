'use client'

import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import List from '@mui/joy/List';
import Divider from '@mui/joy/Divider';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import Sheet from '@mui/joy/Sheet';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

export default function TeamExample() {
  
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const peopleData = [
    {
      name: 'Andrew Smith',
      position: 'UI Designer',
      avatar2x: 'https://i.pravatar.cc/80?img=7',
      companyData: [
        {
          role: 'Senior designer',
          name: 'Dribbble',
          logo: 'https://www.vectorlogo.zone/logos/dribbble/dribbble-icon.svg',
          years: '2015-now',
        },
        {
          role: 'Designer',
          name: 'Pinterest',
          logo: 'https://www.vectorlogo.zone/logos/pinterest/pinterest-icon.svg',
          years: '2012-2015',
        },
      ],
      skills: ['UI design', 'Illustration'],
    },
    {
      name: 'John Doe',
      position: 'Frontend Developer',
      avatar2x: 'https://i.pravatar.cc/80?img=8',
      companyData: [
        {
          role: 'UI Engineer',
          name: 'Google',
          logo: 'https://www.vectorlogo.zone/logos/google/google-icon.svg',
          years: '2018-now',
        },
        {
          role: 'Frontend Developer',
          name: 'Amazon',
          logo: 'https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg',
          years: '2015-2018',
        },
      ],
      skills: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      name: 'Alice Johnson',
      position: 'Product Manager',
      avatar2x: 'https://i.pravatar.cc/80?img=9',
      companyData: [
        {
          role: 'Product Manager',
          name: 'Microsoft',
          logo: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg',
          years: '2016-now',
        },
        {
          role: 'Product Analyst',
          name: 'IBM',
          logo: 'https://www.vectorlogo.zone/logos/ibm/ibm-icon.svg',
          years: '2013-2016',
        },
      ],
      skills: ['Product Management', 'Market Analysis'],
    },
    {
      name: 'Eva Brown',
      position: 'Graphic Designer',
      avatar2x: 'https://i.pravatar.cc/80?img=10',
      companyData: [
        {
          role: 'Art Director',
          name: 'Adobe',
          logo: 'https://www.vectorlogo.zone/logos/adobe/adobe-icon.svg',
          years: '2019-now',
        },
        {
          role: 'Graphic Designer',
          name: 'Apple',
          logo: 'https://www.vectorlogo.zone/logos/apple/apple-icon.svg',
          years: '2016-2019',
        },
      ],
      skills: ['Graphic Design', 'Illustration'],
    },
  ];

  return (
    
      
        <List
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 2,
          }}
        >
          {peopleData.map((person, index) => (
            <Sheet
              key={index}
              component="li"
              variant="outlined"
              sx={{
                borderRadius: 'sm',
                p: 2,
                listStyle: 'none',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar
                  variant="outlined"
                  src={person.avatar2x}
                  srcSet={`${person.avatar2x} 2x`}
                  sx={{ borderRadius: '50%' }}
                />
                <div>
                  <Typography level="title-md">{person.name}</Typography>
                  <Typography level="body-xs">{person.position}</Typography>
                </div>
              </Box>
              <Divider component="div" sx={{ my: 2 }} />
              <List sx={{ '--ListItemDecorator-size': '40px', gap: 2 }}>
                {person.companyData.map((company, companyIndex) => (
                  <ListItem key={companyIndex} sx={{ alignItems: 'flex-start' }}>
                    <ListItemDecorator
                      sx={{
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          height: '100%',
                          width: '1px',
                          bgcolor: 'divider',
                          left: 'calc(var(--ListItem-paddingLeft) + 12px)',
                          top: '50%',
                        },
                      }}
                    >
                      <Avatar
                        src={company.logo}
                        sx={{ '--Avatar-size': '24px' }}
                      />
                    </ListItemDecorator>
                    <ListItemContent>
                      <Typography level="title-sm">{company.role}</Typography>
                      <Typography level="body-xs">{company.name}</Typography>
                    </ListItemContent>
                    <Typography level="body-xs">{company.years}</Typography>
                  </ListItem>
                ))}
              </List>
              <Button
                size="sm"
                variant="plain"
                endDecorator={<KeyboardArrowRightRoundedIcon fontSize="small" />}
                sx={{ px: 1, mt: 1 }}
              >
                Expand
              </Button>
              <Divider component="div" sx={{ my: 2 }} />
              <Typography level="title-sm">Skills tags:</Typography>
              <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                {person.skills.map((skill, skillIndex) => (
                  <Chip
                    key={skillIndex}
                    variant="outlined"
                    color="neutral"
                    size="sm"
                  >
                    {skill}
                  </Chip>
                ))}
              </Box>
            </Sheet>
          ))}
        </List>
      
    
  );
}
