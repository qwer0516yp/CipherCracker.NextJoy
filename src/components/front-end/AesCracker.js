'use client';

import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

import {
  Box,
  Input,
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
  ToggleButtonGroup,
  Checkbox,
  FormHelperText,
  Textarea
} from '@mui/joy';
import Tab, { tabClasses } from '@mui/joy/Tab';

import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function AesCracker() {
  //Snackbar for showing none essential error when converting bytes into certain encoding
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [snackbarColor, setSnackbarColor] = useState('warning');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [aesBlockModeRadio, setAesBlockModeRadio] = useState('CBC');
  const [aesBlockMode, setAesBlockMode] = useState(CryptoJS.mode.CBC);
  const [aesPaddingRadio, setAesPaddingRadio] = useState('Pkcs7');
  const [aesPadding, setAesPadding] = useState(CryptoJS.pad.Pkcs7);

  const [isIvConcatChecked, setIsIvConcatChecked] = React.useState(false);

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

  //Encrypt
  const [messageToEncrypt, SetMessageToEncrypt] = React.useState('');
  const [encryptionIvHex, setEncryptionIvHex] = React.useState('');
  const [encryptionIvBase64, setEncryptionIvBase64] = React.useState('');
  const [encryptionSnapshotMessage, setEncryptionSnapshotMessage] =
    React.useState('');
  const [encryptionConcatinatedCipherHex, setEncryptionConcatinatedCipherHex] =
    React.useState('');
  const [
    encryptionConcatinatedCipherBase64,
    setEncryptionConcatinatedCipherBase64
  ] = React.useState('');
  const [encryptionSnapshotResult, setEncryptionSnapshotResult] =
    React.useState();

  const Encrypt = () => {
    try {
      const encryptIvBytes = CryptoJS.lib.WordArray.random(16);
      const options = {
        iv: encryptIvBytes,
        mode: aesBlockMode,
        padding: aesPadding
      };
      setEncryptionIvHex(encryptIvBytes.toString(CryptoJS.enc.Hex));
      setEncryptionIvBase64(encryptIvBytes.toString(CryptoJS.enc.Base64));

      const encrypted = CryptoJS.AES.encrypt(
        messageToEncrypt,
        CryptoJS.enc.Base64.parse(aesKeyBase64),
        options
      );

      setEncryptionSnapshotResult(encrypted);
      setEncryptionSnapshotMessage(messageToEncrypt.toString());

      if (isIvConcatChecked) {
        const concatinatedHex =
          encrypted.iv.toString(CryptoJS.enc.Hex) +
          encrypted.ciphertext.toString(CryptoJS.enc.Hex);
        setEncryptionConcatinatedCipherHex(concatinatedHex);
        setEncryptionConcatinatedCipherBase64(
          CryptoJS.enc.Hex.parse(concatinatedHex).toString(CryptoJS.enc.Base64)
        );
      }

      setSnackbarColor('success');
      setSnackbarMessage('Encrypt message sucessfully!');
    } catch (error) {
      setEncryptionSnapshotResult();
      setEncryptionSnapshotMessage('');
      setSnackbarColor('danger');
      setSnackbarMessage('Error Encrypted message : ' + error);
    }
    setSnackBarOpen(true);
  };

  //Decrypt
  const [decryptionConcatBase64, setDecryptionConcatBase64] =
    React.useState('');
  const [decryptionIvBase64, setDecryptionIvBase64] = React.useState('');
  const [decryptionCipherTextBase64, setDecryptionCipherTextBase64] =
    React.useState('');
  const [decryptedText, setDecryptedText] = React.useState('');
  const Decrypt = () => {
    try {
      let ivHex = '';
      let ciphertextHex = '';

      if (isIvConcatChecked) {
        const concatinatedHex = CryptoJS.enc.Base64.parse(
          decryptionConcatBase64
        ).toString(CryptoJS.enc.Hex);

        ivHex = concatinatedHex.substring(0, 32);
        ciphertextHex = concatinatedHex.substring(32);
      } else {
        ivHex = CryptoJS.enc.Base64.parse(decryptionIvBase64).toString(
          CryptoJS.enc.Hex
        );
        ciphertextHex = CryptoJS.enc.Base64.parse(
          decryptionCipherTextBase64
        ).toString(CryptoJS.enc.Hex);
      }

      const options = {
        iv: CryptoJS.enc.Hex.parse(ivHex),
        mode: aesBlockMode,
        padding: aesPadding
      };

      const plaintext = CryptoJS.AES.decrypt(
        CryptoJS.enc.Hex.parse(ciphertextHex).toString(CryptoJS.enc.Base64),
        CryptoJS.enc.Base64.parse(aesKeyBase64),
        options
      ).toString(CryptoJS.enc.Utf8);

      if (plaintext.length < 1) {
        setDecryptedText('');
        setSnackbarColor('danger');
        setSnackbarMessage(
          'Decrypt message failed. Please check your cipher content and retry!'
        );
      } else {
        setDecryptedText(plaintext);
        setSnackbarColor('success');
        setSnackbarMessage('Decrypt message sucessfully!');
      }
    } catch (error) {
      setSnackbarColor('danger');
      setDecryptedText('');
      setSnackbarMessage('Error Decrypting message : ' + error);
    }
    setSnackBarOpen(true);
  };

  const CheckUserSpecifiedKey = () => {
    const isValidUserInputKey = ValidateUserInputKey();

    if (isValidUserInputKey) {
      setSnackbarColor('success');
      setSnackbarMessage(
        'Your provided key looks good! You can Save to Apply if you want.'
      );
    } else {
      setSnackbarColor('danger');
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

  const handleIsIvConcatCheckedChange = (event) => {
    setIsIvConcatChecked(event.target.checked);
  };

  return (
    <React.Fragment>
      <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
        AES Cracker
      </Typography>
      <Box>
        {!isValidKey && (
          <Card variant="soft" color="danger">
            <WarningIcon /> Please go to Settings tab, set or generate a *VALID*
            AES key before you can encrypt and decrypt content.
          </Card>
        )}
        {isValidKey && (
          <Card variant="soft" color="success">
            <CheckIcon />
            <span>
              Cracker is ready for AES-{aesKeySize * 8}-{aesBlockModeRadio}{' '}
              Encrypt & Decrypt.
            </span>
            <span>
              Padding {aesPaddingRadio} with AES key (Base64:
              {aesKeyBase64}, HEX:
              {aesKeyHex})
            </span>
            <span>IV-ciphertext concat: {isIvConcatChecked.toString()}</span>
          </Card>
        )}
        <Tabs
          defaultValue={0}
          sx={{
            bgcolor: 'transparent'
          }}
        >
          <TabList
            tabFlex={1}
            size="md"
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
                sx={{ display: { xs: 'flex', md: 'flex' }, my: 1 }}
              >
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Stack spacing={1}>
                    <FormControl>
                      <FormLabel>Block Mode - {aesBlockModeRadio}</FormLabel>
                      <RadioGroup
                        orientation="horizontal"
                        value={aesBlockModeRadio}
                        onChange={(event) =>
                          setAesBlockModeRadio(event.target.value)
                        }
                      >
                        <Radio value="CBC" label="CBC (Default)" />
                        <Radio value="CTR" label="CTR" />
                        <Radio value="OFB" label="OFB" />
                        <Radio value="ECB" label="ECB" />
                        <Radio value="CFB" label="CFB" />
                      </RadioGroup>
                    </FormControl>
                  </Stack>

                  <Stack spacing={1}>
                    <FormControl>
                      <FormLabel>Padding - {aesPaddingRadio}</FormLabel>
                      <RadioGroup
                        orientation="horizontal"
                        value={aesPaddingRadio}
                        onChange={(event) =>
                          setAesPaddingRadio(event.target.value)
                        }
                      >
                        <Radio value="Pkcs7" label="Pkcs7 (Default)" />
                        <Radio value="ZeroPadding" label="ZeroPadding" />
                        <Radio value="NoPadding" label="NoPadding" />
                      </RadioGroup>
                    </FormControl>
                  </Stack>
                  <Divider />
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={2}>
                      <FormControl sx={{ width: 400 }}>
                        <FormLabel>IV</FormLabel>
                        <Checkbox
                          checked={isIvConcatChecked}
                          onChange={handleIsIvConcatCheckedChange}
                          label={
                            <React.Fragment>
                              Concat IV bytes with ciphertext bytes
                            </React.Fragment>
                          }
                        />
                        <FormHelperText>
                          <Typography level="body-sm">
                            like: [16_bytes_iv][ciphertext_bytes].
                          </Typography>
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Stack>
                  <Divider />
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
                        <Radio value={16} label="AES-128 (Default)" />
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
                    <FormLabel>
                      Key - Valid: {JSON.stringify(isValidKey)}
                    </FormLabel>
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
            <Card>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">AES Encrypt</Typography>
                <Typography level="body-sm">
                  Provide message you want to encrypt. Text message will be
                  taken as utf-8 string.
                </Typography>
              </Box>

              <Divider />
              <Box sx={{ mb: 1 }}>
                <Textarea
                  value={messageToEncrypt}
                  onChange={(event) => SetMessageToEncrypt(event.target.value)}
                  minRows={3}
                  maxRows={5}
                  placeholder="type in your text here..."
                  endDecorator={
                    <Typography level="body-xs" sx={{ ml: 'auto' }}>
                      {messageToEncrypt.length} character(s)
                    </Typography>
                  }
                />
              </Box>
              <CardOverflow
                sx={{ borderTop: '1px solid', borderColor: 'divider' }}
              >
                <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                  {isValidKey && (
                    <Button size="sm" variant="solid" onClick={() => Encrypt()}>
                      Encrypt
                    </Button>
                  )}

                  {!isValidKey && (
                    <Typography level="title-md">
                      A valid AES key is required!
                    </Typography>
                  )}
                </CardActions>
              </CardOverflow>
            </Card>

            {encryptionSnapshotMessage && (
              <>
                <br />
                <Card>
                  <Box sx={{ mb: 1 }}>
                    <Typography level="title-md">AES Encrypt Result</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ mb: 1 }}>
                    <span>Original Message: {encryptionSnapshotMessage}</span>

                    {isIvConcatChecked && (
                      <>
                        <p>
                          Concatinated Cipher (Hex):{' '}
                          {encryptionConcatinatedCipherHex} (
                          {encryptionConcatinatedCipherHex.length / 2} bytes)
                        </p>
                        <p>
                          Concatinated Cipher (base64):{' '}
                          {encryptionConcatinatedCipherBase64}
                        </p>
                      </>
                    )}
                    <p>===== Details: =====</p>
                    <p>
                      Encrypted ciphertext (Hex):{' '}
                      {encryptionSnapshotResult.ciphertext.toString(
                        CryptoJS.enc.Hex
                      )}{' '}
                      ({encryptionSnapshotResult.ciphertext.sigBytes} bytes)
                    </p>
                    <p>
                      Encrypted ciphertext (Base64):{' '}
                      {encryptionSnapshotResult.ciphertext.toString(
                        CryptoJS.enc.Base64
                      )}
                    </p>
                    <p>
                      IV (Hex): {encryptionIvHex} ({encryptionIvHex.length / 2}{' '}
                      bytes)
                    </p>
                    <p>IV (Base64): {encryptionIvBase64}</p>
                    <p>
                      Salt (Hex):{' '}
                      {encryptionSnapshotResult.salt
                        ? encryptionSnapshotResult.salt.toString(
                            CryptoJS.enc.Hex
                          )
                        : 'No salt'}
                    </p>
                    <p>
                      Key (Hex):{' '}
                      {encryptionSnapshotResult.key
                        ? encryptionSnapshotResult.key.toString(
                            CryptoJS.enc.Hex
                          )
                        : 'No key'}
                    </p>
                    <p>
                      blockSize (number of 32 bits word):{' '}
                      {encryptionSnapshotResult.blockSize
                        ? encryptionSnapshotResult.blockSize
                        : 'Block size not directly accessible'}
                    </p>
                  </Box>
                </Card>
              </>
            )}
          </TabPanel>
          <TabPanel value={2}>
            <Card>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">AES Decrypt</Typography>
                <Typography level="body-sm">
                  Provide cipher content you want to decrypt. decrypted result
                  will be displayed as utf-8 string.
                </Typography>
              </Box>

              <Divider />
              <Box sx={{ mb: 1 }}>
                {isIvConcatChecked && (
                  <Textarea
                    value={decryptionConcatBase64}
                    onChange={(event) =>
                      setDecryptionConcatBase64(event.target.value)
                    }
                    minRows={3}
                    maxRows={5}
                    placeholder="type in your iv-ciphertext concat in Base64 string here..."
                    endDecorator={
                      <Typography level="body-xs" sx={{ ml: 'auto' }}>
                        {decryptionConcatBase64.length} character(s)
                      </Typography>
                    }
                  />
                )}
                {!isIvConcatChecked && (
                  <>
                    <Input
                      size="md"
                      placeholder="Provide Iv as Base64 string"
                      value={decryptionIvBase64}
                      onChange={(event) =>
                        setDecryptionIvBase64(event.target.value)
                      }
                    />
                    <br />
                    <Input
                      size="md"
                      placeholder="Provide Ciphertext as Base64 string"
                      value={decryptionCipherTextBase64}
                      onChange={(event) =>
                        setDecryptionCipherTextBase64(event.target.value)
                      }
                    />
                  </>
                )}
              </Box>
              <CardOverflow
                sx={{ borderTop: '1px solid', borderColor: 'divider' }}
              >
                <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                  {isValidKey && (
                    <Button
                      size="sm"
                      color="success"
                      variant="solid"
                      onClick={() => Decrypt()}
                    >
                      Decrypt
                    </Button>
                  )}

                  {!isValidKey && (
                    <Typography level="title-md">
                      A valid AES key is required!
                    </Typography>
                  )}
                </CardActions>
              </CardOverflow>
            </Card>
            <br />
            {decryptedText && (
              <Card>
                <Box sx={{ mb: 1 }}>
                  <Typography level="title-md">AES Decrypt Result</Typography>
                </Box>
                <Divider />
                <Box sx={{ mb: 1 }}>
                  <span>Decrypted plaintext: {decryptedText}</span>
                </Box>
              </Card>
            )}
          </TabPanel>
        </Tabs>
      </Box>

      <Snackbar
        autoHideDuration={3000}
        variant="soft"
        color={snackbarColor}
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
