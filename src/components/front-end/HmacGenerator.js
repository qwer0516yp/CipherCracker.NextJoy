'use client';

import { useState } from 'react';
import CryptoJS from 'crypto-js';

import {
  Textarea,
  Box,
  Chip,
  Input,
  Alert,
  Tooltip,
  Typography
} from '@mui/joy';

export default function HmacGenerator() {
  //userinput textarea
  const [input, setInput] = useState('');
  //passphrase
  const [passphrase, setPassphrase] = useState('');

  //Hmac - MD5
  const [hmacMd5Hex, setHmacMd5Hex] = useState('');
  //Hmac - SHA-1
  const [hmacSha1Hex, setHmacSha1Hex] = useState('');
  //Hmac - SHA-2: HmacSHA256
  const [hmacSha256Hex, setHmacSha256Hex] = useState('');
  //Hmac - SHA-2: HmacSHA512
  const [hmacSha512Hex, setHmacSha512Hex] = useState('');

  const generateHmac = (userInput, passphrase) => {
    const hmac_md5 = CryptoJS.HmacMD5(userInput, passphrase).toString(
      CryptoJS.enc.Hex
    );
    setHmacMd5Hex(hmac_md5);
    const hmac_sha1 = CryptoJS.HmacSHA1(userInput, passphrase).toString(
      CryptoJS.enc.Hex
    );
    setHmacSha1Hex(hmac_sha1);
    const hmac_sha256 = CryptoJS.HmacSHA256(userInput, passphrase).toString(
      CryptoJS.enc.Hex
    );
    setHmacSha256Hex(hmac_sha256);
    const hmac_sha512 = CryptoJS.HmacSHA512(userInput, passphrase).toString(
      CryptoJS.enc.Hex
    );
    setHmacSha512Hex(hmac_sha512);
  };

  const handlePassphraseChange = (e) => {
    const value = e.target.value;
    setPassphrase(value);
    generateHmac(input, value);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    generateHmac(value, passphrase);
  };

  return (
    <div>
      <p>
        Keyed-hash message authentication codes (HMAC) is a mechanism for
        message authentication using cryptographic hash functions.
      </p>
      <p>This is for demonstration purposes only. Output as a HEX string.</p>
      <Input
        color="warning"
        variant="soft"
        value={passphrase}
        onChange={handlePassphraseChange}
        placeholder="Type in Passphrase here…"
      ></Input>
      <br />
      <Textarea
        value={input}
        onChange={handleInputChange}
        minRows={3}
        maxRows={5}
        placeholder="type in your text here..."
        endDecorator={
          <Typography level="body-xs" sx={{ ml: 'auto' }}>
            {input.length} character(s)
          </Typography>
        }
      />
      {/* HmacMD5 */}
      {input && hmacMd5Hex && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Typography fontSize="xl">HmacMD5</Typography>
            <Chip color="danger" variant="soft">
              Weak
            </Chip>
            <Alert variant="soft" color="danger">
              Too weak, avoid using it if possible
            </Alert>
          </Box>
          <Input
            type="text"
            color="danger"
            value={hmacMd5Hex}
            endDecorator={`${hmacMd5Hex.length / 2} byte(s)`}
            readOnly
          />
        </div>
      )}
      {/* HmacSHA1 */}
      {input && hmacSha1Hex && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Typography fontSize="xl">HmacSHA1</Typography>
            <Chip color="warning" variant="soft">
              Weak
            </Chip>
            <Alert variant="soft" color="warning">
              HmacSHA1
            </Alert>
          </Box>
          <Input
            type="text"
            color="warning"
            value={hmacSha1Hex}
            endDecorator={`${hmacSha1Hex.length / 2} byte(s)`}
            readOnly
          />
        </div>
      )}
      {/* HmacSHA256 */}
      {input && hmacSha256Hex && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Typography fontSize="xl">HmacSHA256</Typography>
            <Tooltip
              arrow
              placement="right-start"
              title="SHA256 (SHA2, operate on 32-bit words)"
            >
              <Chip color="primary" variant="soft">
                OK
              </Chip>
            </Tooltip>
            <Alert variant="soft" color="primary">
              HmacSHA256 (passphrase authenticated SHA256)
            </Alert>
          </Box>
          <Input
            type="text"
            color="primary"
            value={hmacSha256Hex}
            endDecorator={`${hmacSha256Hex.length / 2} byte(s)`}
            readOnly
          />
        </div>
      )}
      {/* HmacSHA512 */}
      {input && hmacSha512Hex && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Typography fontSize="xl">HmacSHA512</Typography>
            <Chip color="primary" variant="soft">
              OK
            </Chip>
            <Alert variant="soft" color="primary">
              passphrase authenticated SHA512 (SHA-2)
            </Alert>
          </Box>
          <Input
            type="text"
            color="primary"
            value={hmacSha512Hex}
            endDecorator={`${hmacSha512Hex.length / 2} byte(s)`}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
