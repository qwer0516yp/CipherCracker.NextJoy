import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Box, Input, Button, Typography, Card, Divider } from '@mui/joy';

export default function TripleDesCracker() {
  const [secretKey, setSecretKey] = useState('');
  const [textToEncrypt, setTextToEncrypt] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [textToDecrypt, setTextToDecrypt] = useState('');
  const [decryptedText, setDecryptedText] = useState('');

  const encryptText = () => {
    const encrypted = CryptoJS.TripleDES.encrypt(textToEncrypt, secretKey);
    setEncryptedText(encrypted.toString());
  };

  const decryptText = () => {
    const bytes = CryptoJS.TripleDES.decrypt(textToDecrypt, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    setDecryptedText(originalText);
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography level="h6">
          Triple DES applies DES three times to each block to increase the key
          size. The algorithm is believed to be secure in this form.
        </Typography>
        <Divider />
        <Typography level="h6">Triple DES Secret Key</Typography>
        <Input
          placeholder="Secret Key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
        />
        <Divider />
        <Card>
          <Input
            placeholder="Text to Encrypt"
            value={textToEncrypt}
            onChange={(e) => setTextToEncrypt(e.target.value)}
          />
          <Button onClick={encryptText}>Encrypt</Button>
          {encryptedText && (
            <>
              <Typography>Encrypted Text(Base64): {encryptedText}</Typography>
              <Typography>
                Encrypted Text(Hex):{' '}
                {CryptoJS.enc.Base64.parse(encryptedText).toString(
                  CryptoJS.enc.Hex
                )}
              </Typography>
            </>
          )}
        </Card>

        <Card>
          <Input
            placeholder="Text to Decrypt (Base64)"
            value={textToDecrypt}
            onChange={(e) => setTextToDecrypt(e.target.value)}
          />
          <Button color="success" onClick={decryptText}>
            Decrypt
          </Button>
          {decryptedText && (
            <Typography>Decrypted Text: {decryptedText}</Typography>
          )}
        </Card>
      </Box>
    </React.Fragment>
  );
}
