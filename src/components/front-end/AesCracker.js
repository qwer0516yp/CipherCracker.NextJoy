'use client';

import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

import {
  Textarea,
  Box,
  Chip,
  Input,
  Alert,
  Select,
  Option,
  Typography,
  Button,
  IconButton,
  Snackbar,
  Tabs,
  TabList,
  TabPanel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Card,
  CardOverflow,
  CardActions,
  Divider,
  Stack,
  AspectRatio,
  ToggleButtonGroup
} from '@mui/joy';
import Tab, { tabClasses } from '@mui/joy/Tab';

import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';

export default function AesCracker() {
  //Snackbar for showing none essential error when converting bytes into certain encoding
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [aesKeySize, setAesKeySize] = React.useState(16); // default to 128 bits key for AES-128
  const [isKeyGenerateControl, setIsKeyGenerateControl] =
    React.useState('true');
  const [isKeyGenerate, setIsKeyGenerate] = React.useState(true);
  const [aesKeyEncodingText, setAesKeyEncodingText] = React.useState('Hex');
  const [aesKeyEncoding, setAesKeyEncoding] = React.useState(CryptoJS.enc.Hex);

  const [aesKey, setAesKey] = React.useState('');
  const [aesKeyBytes, setAesKeyBytes] = React.useState();
  const [aesKeyHex, setAesKeyHex] = React.useState('');
  const [aesKeyBase64, setAesKeyBase64] = React.useState('');
  const [isValidKey, setIsValidKey] = React.useState(false);

  const [variant, setVariant] = React.useState('plain');
  //userinput textarea
  const [input, setInput] = useState('');
  const [isValidInput, setIsValidInput] = useState(true);
  const [encoding, setEncoding] = useState(CryptoJS.enc.Utf8);

  //Hex
  const [hexText, setHexText] = useState('');
  //Base64
  const [base64Text, setBase64Text] = useState('');
  //Utf-8
  const [utf8Text, setUtf8Text] = useState('');

  const CheckUserSpecifiedKey = () => {
    const isValidUserInputKey = ValidateUserInputKey();

    if (isValidUserInputKey) {
      setSnackbarMessage('Your provided key looks good!');
    } else {
      setSnackbarMessage(
        'Your provided key looks invalid, please check encoding length and content!'
      );
    }

    setSnackBarOpen(true);
  };

  const ValidateUserInputKey = () => {
    try {
      if (aesKeyEncoding === CryptoJS.enc.Hex) {
        if (aesKey.length % 2 === 1 || !/^[0-9a-fA-F]+$/.test(aesKey)) {
          return false;
        }
        //AES keys are fixed length of 16/24/32 bytes, translated to hex string of 32/48/64 characters
        if (
          aesKey.length !== 32 &&
          aesKey.length !== 48 &&
          aesKey.length !== 64
        ) {
          return false;
        }
      }

      if (aesKeyEncoding === CryptoJS.enc.Base64) {
        if (
          !/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/.test(
            aesKey
          )
        ) {
          return false;
        }
      }

      //parse key
      let keyBytes = aesKeyEncoding.parse(aesKey);
      if (keyBytes.sigBytes.toString() !== aesKeySize.toString()) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Conversion error:', error);
      return false;
    }
  };
  const LoadSpecifiedKey = () => {
    const isValid = ValidateUserInputKey();
    setIsValidKey(isValid);

    if (isValid) {
      let keyBytes = aesKeyEncoding.parse(aesKey);
      setAesKeyBytes(keyBytes);
      setAesKeyHex(CryptoJS.enc.Hex.stringify(keyBytes));
      setAesKeyBase64(CryptoJS.enc.Base64.stringify(keyBytes));
    }
  };

  const ConvertUserInput = (userInput) => {
    try {
      //Half byte or invalid hex character by default will be prefixed with or default to 0000 by CryptoJS parse, we want to tell user it is invalid.
      if (
        encoding === CryptoJS.enc.Hex &&
        (userInput.length % 2 === 1 || !/^[0-9a-fA-F]+$/.test(userInput))
      ) {
        setIsValidInput(false);
        return;
      }

      if (
        encoding === CryptoJS.enc.Base64 &&
        !/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/.test(
          userInput
        )
      ) {
        setIsValidInput(false);
        return;
      }

      let inputBytes = encoding.parse(userInput);
      setHexText(CryptoJS.enc.Hex.stringify(inputBytes));
      setBase64Text(CryptoJS.enc.Base64.stringify(inputBytes));

      setIsValidInput(true);
    } catch (error) {
      console.error('Conversion error:', error);
      setIsValidInput(false);
      return;
    }

    let inputBytes = encoding.parse(userInput);
    //not always successful, i.e. from a valid Latin1
    try {
      setUtf8Text(CryptoJS.enc.Utf8.stringify(inputBytes));
    } catch (error) {
      console.error('Conversion error:', error);
      setSnackBarOpen(true);
      setUtf8Text('');
    }
  };

  return (
    <React.Fragment>
      <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
        AES Cracker
      </Typography>
      <Box>
        <Tabs
          defaultValue={0}
          sx={{
            bgcolor: 'transparent'
          }}
        >
          <TabList
            tabFlex={1}
            size="sm"
            sx={{
              pl: { xs: 0, md: 4 },
              justifyContent: 'left',
              [`&& .${tabClasses.root}`]: {
                fontWeight: '600',
                flex: 'initial',
                color: 'text.tertiary',
                [`&.${tabClasses.selected}`]: {
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  '&::after': {
                    height: '2px',
                    bgcolor: 'primary.500'
                  }
                }
              }
            }}
          >
            <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={0}>
              Settings
            </Tab>
            <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={1}>
              Encrypt
            </Tab>
            <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={2}>
              Decrypt
            </Tab>
          </TabList>
          <TabPanel value={0}>
            <Card>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">AES Cracker Settings</Typography>
                <Typography level="body-sm">
                  Customize how you want to use AES Cracker in Encrypt and
                  Decrypt tabs.
                </Typography>
              </Box>
              <Divider />
              <Stack
                direction="row"
                spacing={3}
                sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
              >
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Stack spacing={1}>
                    <FormControl>
                      <FormLabel>
                        Key Size (bits) - {aesKeySize} bytes
                      </FormLabel>
                      <RadioGroup
                        orientation="horizontal"
                        value={aesKeySize}
                        onChange={(event) => setAesKeySize(event.target.value)}
                      >
                        <Radio value={16} label="AES-128" />
                        <Radio value={24} label="AES-192" />
                        <Radio value={32} label="AES-256" />
                      </RadioGroup>
                    </FormControl>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <FormControl>
                      <FormLabel>
                        KeyGen - isKeyGen ({isKeyGenerate.toString()})
                      </FormLabel>
                      <ToggleButtonGroup
                        size="md"
                        color="success"
                        variant="soft"
                        value={isKeyGenerateControl}
                        onChange={(event) => {
                          setIsKeyGenerateControl(event.target.value);
                          setIsKeyGenerate('true' === event.target.value);
                        }}
                      >
                        <Button value="true">Generate</Button>
                        <Button value="false">Specify</Button>
                      </ToggleButtonGroup>
                    </FormControl>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <FormLabel>Key String Format</FormLabel>
                      <ToggleButtonGroup
                        size="md"
                        color="warning"
                        variant="soft"
                        value={aesKeyEncodingText}
                        onChange={(event) => {
                          setAesKeyEncodingText(event.target.value);
                          if ('Base64' === event.target.value) {
                            setAesKeyEncoding(CryptoJS.enc.Base64);
                          } else {
                            setAesKeyEncoding(CryptoJS.enc.Hex);
                          }
                        }}
                      >
                        <Button value="Hex">Hex</Button>
                        <Button value="Base64">Base64</Button>
                      </ToggleButtonGroup>
                    </FormControl>

                    <FormControl sx={{ flexGrow: 3 }}>
                      <FormLabel>Action</FormLabel>
                      <Button
                        color="danger"
                        variant="soft"
                        onClick={() => {
                          //either keygen or load user's BYO key
                          if (isKeyGenerate) {
                            const key =
                              CryptoJS.lib.WordArray.random(
                                aesKeySize
                              ).toString(aesKeyEncoding);
                            setAesKey(key);
                            return;
                          }

                          CheckUserSpecifiedKey();
                        }}
                      >
                        Generate New or Check Your Key
                      </Button>
                    </FormControl>
                  </Stack>

                  <Stack spacing={1}>
                    <FormLabel>Key - {JSON.stringify(isValidKey)}</FormLabel>
                    <FormControl
                      sx={{
                        display: { sm: 'flex-column', md: 'flex-row' },
                        gap: 2
                      }}
                    >
                      <Input
                        size="sm"
                        placeholder="Provide AES key in as either Hex or Base64. Generate a new one or use your own..."
                        value={aesKey}
                        onChange={(event) => setAesKey(event.target.value)}
                        endDecorator={
                          <>
                            {`${aesKey.length} character(s)`}
                            <IconButton
                              onClick={() =>
                                navigator.clipboard.writeText(aesKey)
                              }
                            >
                              <ContentCopyIcon />
                            </IconButton>
                          </>
                        }
                        error={!isValidKey}
                        readOnly={isKeyGenerate}
                      />
                    </FormControl>
                  </Stack>
                </Stack>
              </Stack>
              <Stack
                direction="column"
                spacing={2}
                sx={{ display: { xs: 'flex', md: 'none' }, my: 1 }}
              >
                <Stack direction="row" spacing={2}>
                  <Stack direction="column" spacing={1}>
                    <AspectRatio
                      ratio="1"
                      maxHeight={108}
                      sx={{ flex: 1, minWidth: 108, borderRadius: '100%' }}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                        srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                        loading="lazy"
                        alt=""
                      />
                    </AspectRatio>
                    <IconButton
                      aria-label="upload new picture"
                      size="sm"
                      variant="outlined"
                      color="neutral"
                      sx={{
                        bgcolor: 'background.body',
                        position: 'absolute',
                        zIndex: 2,
                        borderRadius: '50%',
                        left: 85,
                        top: 180,
                        boxShadow: 'sm'
                      }}
                    ></IconButton>
                  </Stack>
                  <Stack spacing={1} sx={{ flexGrow: 1 }}>
                    <FormLabel>Name</FormLabel>
                    <FormControl
                      sx={{
                        display: {
                          sm: 'flex-column',
                          md: 'flex-row'
                        },
                        gap: 2
                      }}
                    >
                      <Input size="sm" placeholder="First name" />
                      <Input size="sm" placeholder="Last name" />
                    </FormControl>
                  </Stack>
                </Stack>
                <FormControl>
                  <FormLabel>Role</FormLabel>
                  <Input size="sm" defaultValue="UI Developer" />
                </FormControl>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    size="sm"
                    type="email"
                    startDecorator={<EmailRoundedIcon />}
                    placeholder="email"
                    defaultValue="siriwatk@test.com"
                    sx={{ flexGrow: 1 }}
                  />
                </FormControl>
                <div>
                  <FormControl sx={{ display: { sm: 'contents' } }}>
                    <FormLabel>Timezone</FormLabel>
                    <Select size="sm" defaultValue="1">
                      <Option value="1">
                        Indochina Time (Bangkok){' '}
                        <Typography textColor="text.tertiary" ml={0.5}>
                          — GMT+07:00
                        </Typography>
                      </Option>
                      <Option value="2">
                        Indochina Time (Ho Chi Minh City){' '}
                        <Typography textColor="text.tertiary" ml={0.5}>
                          — GMT+07:00
                        </Typography>
                      </Option>
                    </Select>
                  </FormControl>
                </div>
              </Stack>
              <CardOverflow
                sx={{ borderTop: '1px solid', borderColor: 'divider' }}
              >
                <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                  <Button
                    size="sm"
                    variant="solid"
                    onClick={() => LoadSpecifiedKey()}
                  >
                    Save to Apply
                  </Button>
                </CardActions>
              </CardOverflow>
            </Card>
          </TabPanel>
          <TabPanel value={1}>
            <b>Encrypt</b> tab panel TODO
          </TabPanel>
          <TabPanel value={2}>
            <b>Decrypt</b> tab panel TODO
          </TabPanel>
        </Tabs>
      </Box>
      {!isValidKey && (
        <Card variant="soft" color="danger">
          <WarningIcon /> Please go to Settings tab, set or generate a *VALID*
          AES key before you can encrypt and decrypt content.
        </Card>
      )}
      {isValidKey && (
        <Card variant="soft" color="success">
          <CheckIcon /> Cracker is ready for AES-{aesKeySize * 8} content
          Encrypt & Decrypt, with AES key (Base64: {aesKeyBase64}, HEX:{' '}
          {aesKeyHex})
        </Card>
      )}

      <Snackbar
        autoHideDuration={3000}
        variant="soft"
        color="warning"
        size="lg"
        invertedColors
        open={snackBarOpen}
        onClose={() => setSnackBarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        endDecorator={
          <Button
            onClick={() => setSnackBarOpen(false)}
            size="sm"
            variant="soft"
            color="danger"
          >
            X
          </Button>
        }
        sx={(theme) => ({
          background: `linear-gradient(45deg, ${theme.palette.primary[600]} 30%, ${theme.palette.primary[500]} 90%})`,
          maxWidth: 360
        })}
      >
        {snackbarMessage}
      </Snackbar>
    </React.Fragment>
  );
}
