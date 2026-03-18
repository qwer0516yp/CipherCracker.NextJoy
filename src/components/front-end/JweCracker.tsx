'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Snackbar,
  Tabs,
  TabList,
  TabPanel,
  FormControl,
  FormLabel,
  Card,
  CardOverflow,
  CardActions,
  Divider,
  Stack,
  Textarea,
  Select,
  Option,
  Switch,
} from '@mui/joy';
import Tab, { tabClasses } from '@mui/joy/Tab';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import WarningIcon from '@mui/icons-material/Warning';

import { importJWK, CompactEncrypt, compactDecrypt } from 'jose';

type SnackbarColor = 'success' | 'danger' | 'warning' | 'primary' | 'neutral';

// jose v6 uses CryptoKey | Uint8Array for key types
type JoseKey = CryptoKey | Uint8Array;

const KEY_ENCRYPTION_ALGORITHMS = [
  'RSA-OAEP',
  'RSA-OAEP-256',
  'RSA-OAEP-384',
  'RSA-OAEP-512',
  'A128KW',
  'A192KW',
  'A256KW',
  'A128GCMKW',
  'A192GCMKW',
  'A256GCMKW',
  'dir',
] as const;

const CONTENT_ENCRYPTION_ALGORITHMS = [
  'A128CBC-HS256',
  'A192CBC-HS384',
  'A256CBC-HS512',
  'A128GCM',
  'A192GCM',
  'A256GCM',
] as const;

type KeyAlg = (typeof KEY_ENCRYPTION_ALGORITHMS)[number];
type EncAlg = (typeof CONTENT_ENCRYPTION_ALGORITHMS)[number];

export default function JweCracker() {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackbarColor, setSnackbarColor] = useState<SnackbarColor>('warning');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Settings
  const [jwkInput, setJwkInput] = useState('');
  const [keyAlg, setKeyAlg] = useState<KeyAlg>('RSA-OAEP-256');
  const [encAlg, setEncAlg] = useState<EncAlg>('A256GCM');
  const [isKeyLoaded, setIsKeyLoaded] = useState(false);
  const [loadedKey, setLoadedKey] = useState<JoseKey | null>(null);
  const [loadedPrivateKey, setLoadedPrivateKey] = useState<JoseKey | null>(null);
  const [keyInfo, setKeyInfo] = useState('');

  // Encrypt
  const [payloadToEncrypt, setPayloadToEncrypt] = useState('');
  const [formatJsonPayload, setFormatJsonPayload] = useState(false);
  const [encryptionResult, setEncryptionResult] = useState('');

  // Decrypt
  const [jweTokenToDecrypt, setJweTokenToDecrypt] = useState('');
  const [formatJsonDecrypted, setFormatJsonDecrypted] = useState(false);
  const [decryptionResult, setDecryptionResult] = useState('');

  const showSnackbar = (color: SnackbarColor, message: string) => {
    setSnackbarColor(color);
    setSnackbarMessage(message);
    setSnackBarOpen(true);
  };

  const tryFormatJson = (text: string): string => {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  };

  const handlePayloadChange = (value: string) => {
    setPayloadToEncrypt(value);
  };

  const getDisplayPayload = (): string => {
    if (formatJsonPayload) {
      return tryFormatJson(payloadToEncrypt);
    }
    return payloadToEncrypt;
  };

  const getDisplayDecrypted = (): string => {
    if (formatJsonDecrypted) {
      return tryFormatJson(decryptionResult);
    }
    return decryptionResult;
  };

  const loadJwk = async () => {
    try {
      const jwk = JSON.parse(jwkInput);

      if (jwk.kty === 'RSA' || jwk.kty === 'EC' || jwk.kty === 'OKP') {
        // Asymmetric key
        if (jwk.d) {
          // Private key - can be used for both encrypt (via public) and decrypt
          const privateKey = await importJWK(jwk, keyAlg);
          setLoadedPrivateKey(privateKey);

          // Extract public key portion
          const { d, p, q, dp, dq, qi, ...publicJwk } = jwk;
          const publicKey = await importJWK(publicJwk, keyAlg);
          setLoadedKey(publicKey);

          setKeyInfo(`${jwk.kty} key pair loaded (public + private). Key ID: ${jwk.kid || 'none'}`);
        } else {
          // Public key only - can only encrypt
          const publicKey = await importJWK(jwk, keyAlg);
          setLoadedKey(publicKey);
          setLoadedPrivateKey(null);
          setKeyInfo(`${jwk.kty} public key loaded (encrypt only). Key ID: ${jwk.kid || 'none'}`);
        }
      } else if (jwk.kty === 'oct') {
        // Symmetric key
        const key = await importJWK(jwk, keyAlg);
        setLoadedKey(key);
        setLoadedPrivateKey(key);
        setKeyInfo(`Symmetric key loaded (${jwk.k.length} chars base64url). Key ID: ${jwk.kid || 'none'}`);
      } else {
        throw new Error(`Unsupported key type: ${jwk.kty}`);
      }

      setIsKeyLoaded(true);
      showSnackbar('success', 'JWK loaded successfully!');
    } catch (error) {
      setIsKeyLoaded(false);
      setLoadedKey(null);
      setLoadedPrivateKey(null);
      setKeyInfo('');
      showSnackbar('danger', `Failed to load JWK: ${error}`);
    }
  };

  const handleEncrypt = async () => {
    if (!loadedKey) {
      showSnackbar('danger', 'Please load a JWK first!');
      return;
    }

    try {
      const payload = new TextEncoder().encode(payloadToEncrypt);
      const jwe = await new CompactEncrypt(payload)
        .setProtectedHeader({ alg: keyAlg, enc: encAlg })
        .encrypt(loadedKey);

      setEncryptionResult(jwe);
      showSnackbar('success', 'Payload encrypted successfully!');
    } catch (error) {
      setEncryptionResult('');
      showSnackbar('danger', `Encryption failed: ${error}`);
    }
  };

  const handleDecrypt = async () => {
    if (!loadedPrivateKey) {
      showSnackbar('danger', 'A private key or symmetric key is required for decryption!');
      return;
    }

    try {
      const { plaintext, protectedHeader } = await compactDecrypt(
        jweTokenToDecrypt.trim(),
        loadedPrivateKey
      );

      const decoded = new TextDecoder().decode(plaintext);
      setDecryptionResult(decoded);
      showSnackbar(
        'success',
        `Decrypted successfully! Header: alg=${protectedHeader.alg}, enc=${protectedHeader.enc}`
      );
    } catch (error) {
      setDecryptionResult('');
      showSnackbar('danger', `Decryption failed: ${error}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSnackbar('success', 'Copied to clipboard!');
  };

  const tabListSx = {
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
          bgcolor: 'primary.500',
        },
      },
    },
  };

  return (
    <React.Fragment>
      <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
        JWE Encrypt / Decrypt
      </Typography>
      <Box>
        {!isKeyLoaded && (
          <Card variant="soft" color="danger">
            <WarningIcon /> Please go to the Settings tab and load a valid JWK before you can encrypt
            and decrypt content.
          </Card>
        )}
        {isKeyLoaded && (
          <Card variant="soft" color="success">
            <CheckIcon />
            <span>
              JWE ready with alg={keyAlg}, enc={encAlg}. {keyInfo}
            </span>
            <span>
              Capabilities: Encrypt{loadedPrivateKey ? ' & Decrypt' : ' only (no private key)'}
            </span>
          </Card>
        )}
        <Tabs defaultValue={0} sx={{ bgcolor: 'transparent' }}>
          <TabList tabFlex={1} size="md" sx={tabListSx}>
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

          {/* Settings Tab */}
          <TabPanel value={0}>
            <Card>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">JWE Settings</Typography>
                <Typography level="body-sm">
                  Paste a JWK (JSON Web Key) and select algorithms. The key will be used for
                  encryption and decryption. All crypto operations run client-side in your browser.
                </Typography>
              </Box>
              <Divider />
              <Stack spacing={2} sx={{ my: 1 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <FormLabel>Key Encryption Algorithm (alg)</FormLabel>
                    <Select
                      value={keyAlg}
                      onChange={(_e, value) => value && setKeyAlg(value as KeyAlg)}
                    >
                      {KEY_ENCRYPTION_ALGORITHMS.map((alg) => (
                        <Option key={alg} value={alg}>
                          {alg}
                        </Option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 200 }}>
                    <FormLabel>Content Encryption Algorithm (enc)</FormLabel>
                    <Select
                      value={encAlg}
                      onChange={(_e, value) => value && setEncAlg(value as EncAlg)}
                    >
                      {CONTENT_ENCRYPTION_ALGORITHMS.map((alg) => (
                        <Option key={alg} value={alg}>
                          {alg}
                        </Option>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                <FormControl>
                  <FormLabel>JWK (JSON Web Key)</FormLabel>
                  <Textarea
                    value={jwkInput}
                    onChange={(e) => setJwkInput(e.target.value)}
                    minRows={6}
                    maxRows={12}
                    placeholder={`Paste your JWK here, e.g.:\n{\n  "kty": "RSA",\n  "n": "...",\n  "e": "AQAB",\n  "d": "...",\n  ...\n}`}
                    endDecorator={
                      <Typography level="body-xs" sx={{ ml: 'auto' }}>
                        {jwkInput.length} character(s)
                      </Typography>
                    }
                  />
                </FormControl>
              </Stack>

              <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                  <Button size="sm" variant="solid" onClick={loadJwk}>
                    Load JWK
                  </Button>
                </CardActions>
              </CardOverflow>
            </Card>
          </TabPanel>

          {/* Encrypt Tab */}
          <TabPanel value={1}>
            <Card>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">JWE Encrypt</Typography>
                <Typography level="body-sm">
                  Provide the payload you want to encrypt. The payload will be encrypted using the
                  loaded JWK and selected algorithms into a JWE Compact Serialization token.
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ mb: 1 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 1, alignItems: 'center' }}>
                  <Typography
                    component="label"
                    endDecorator={
                      <Switch
                        checked={formatJsonPayload}
                        onChange={(e) => {
                          const toggled = e.target.checked;
                          setFormatJsonPayload(toggled);
                          if (toggled) {
                            const formatted = tryFormatJson(payloadToEncrypt);
                            if (formatted !== payloadToEncrypt) {
                              setPayloadToEncrypt(formatted);
                            }
                          } else {
                            try {
                              const minified = JSON.stringify(JSON.parse(payloadToEncrypt));
                              setPayloadToEncrypt(minified);
                            } catch {
                              // not valid JSON, leave as-is
                            }
                          }
                        }}
                      />
                    }
                  >
                    Format JSON
                  </Typography>
                </Stack>
                <Textarea
                  value={getDisplayPayload()}
                  onChange={(e) => handlePayloadChange(e.target.value)}
                  minRows={4}
                  maxRows={10}
                  placeholder='Type your payload here... e.g. {"sub":"1234567890","name":"John Doe"}'
                  sx={formatJsonPayload ? { fontFamily: 'monospace', fontSize: '0.875rem' } : {}}
                  endDecorator={
                    <Typography level="body-xs" sx={{ ml: 'auto' }}>
                      {payloadToEncrypt.length} character(s)
                    </Typography>
                  }
                />
              </Box>
              <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                  {isKeyLoaded ? (
                    <Button size="sm" variant="solid" onClick={handleEncrypt}>
                      Encrypt
                    </Button>
                  ) : (
                    <Typography level="title-md">A valid JWK is required!</Typography>
                  )}
                </CardActions>
              </CardOverflow>
            </Card>

            {encryptionResult && (
              <>
                <br />
                <Card>
                  <Box sx={{ mb: 1 }}>
                    <Typography level="title-md">JWE Token (Compact Serialization)</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ mb: 1 }}>
                    <Textarea
                      value={encryptionResult}
                      readOnly
                      minRows={3}
                      maxRows={8}
                      sx={{ fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all' }}
                      endDecorator={
                        <IconButton
                          size="sm"
                          onClick={() => copyToClipboard(encryptionResult)}
                          sx={{ ml: 'auto' }}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      }
                    />
                    <Typography level="body-xs" sx={{ mt: 1 }}>
                      {encryptionResult.split('.').length} parts (
                      {encryptionResult.split('.').length === 5
                        ? 'Header.EncryptedKey.IV.Ciphertext.Tag'
                        : 'unexpected format'}
                      )
                    </Typography>
                  </Box>
                </Card>
              </>
            )}
          </TabPanel>

          {/* Decrypt Tab */}
          <TabPanel value={2}>
            <Card>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">JWE Decrypt</Typography>
                <Typography level="body-sm">
                  Paste a JWE Compact Serialization token to decrypt. A private key (asymmetric) or
                  the symmetric key must be loaded.
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ mb: 1 }}>
                <Textarea
                  value={jweTokenToDecrypt}
                  onChange={(e) => setJweTokenToDecrypt(e.target.value)}
                  minRows={4}
                  maxRows={8}
                  placeholder="Paste your JWE token here (5 Base64URL parts separated by dots)..."
                  sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                  endDecorator={
                    <Typography level="body-xs" sx={{ ml: 'auto' }}>
                      {jweTokenToDecrypt.length} character(s)
                    </Typography>
                  }
                />
              </Box>
              <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                  {isKeyLoaded && loadedPrivateKey ? (
                    <Button size="sm" color="success" variant="solid" onClick={handleDecrypt}>
                      Decrypt
                    </Button>
                  ) : (
                    <Typography level="title-md">
                      {!isKeyLoaded
                        ? 'A valid JWK is required!'
                        : 'A private or symmetric key is required for decryption!'}
                    </Typography>
                  )}
                </CardActions>
              </CardOverflow>
            </Card>

            {decryptionResult && (
              <>
                <br />
                <Card>
                  <Box sx={{ mb: 1 }}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                      <Typography level="title-md">Decrypted Payload</Typography>
                      <Typography
                        component="label"
                        endDecorator={
                          <Switch
                            checked={formatJsonDecrypted}
                            onChange={(e) => setFormatJsonDecrypted(e.target.checked)}
                          />
                        }
                      >
                        Format JSON
                      </Typography>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box sx={{ mb: 1 }}>
                    <Textarea
                      value={getDisplayDecrypted()}
                      readOnly
                      minRows={2}
                      maxRows={10}
                      sx={
                        formatJsonDecrypted
                          ? { fontFamily: 'monospace', fontSize: '0.875rem' }
                          : {}
                      }
                      endDecorator={
                        <IconButton
                          size="sm"
                          onClick={() => copyToClipboard(decryptionResult)}
                          sx={{ ml: 'auto' }}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      }
                    />
                  </Box>
                </Card>
              </>
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
          <Button onClick={() => setSnackBarOpen(false)} size="sm" variant="soft" color="danger">
            X
          </Button>
        }
        sx={(theme) => ({
          background: `linear-gradient(45deg, ${theme.palette.primary[600]} 30%, ${theme.palette.primary[500]} 90%)`,
          maxWidth: 360,
        })}
      >
        {snackbarMessage}
      </Snackbar>
    </React.Fragment>
  );
}
