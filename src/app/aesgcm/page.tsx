'use client'

import React, { useState } from 'react';
import { Input, Button, Typography, Card, Box } from '@mui/joy';
import { aes256gcmEncrypt, aes256gcmDecrypt } from '../../cryptoUtils';

const Aes256GcmPage = () => {
  const [keyBase64, setKeyBase64] = useState('');
  const [ivBase64, setIvBase64] = useState('');
  const [authTagBase64, setAuthTagBase64] = useState('');
  const [encryptedMessageBase64, setEncryptedMessageBase64] = useState('');
  const [plainText, setPlainText] = useState('');
  const [encryptionResult, setEncryptionResult] = useState('');
  const [decryptionResult, setDecryptionResult] = useState('');

  const handleEncrypt = () => {
    const { ivBase64, encryptedDataBase64, authTagBase64 } = aes256gcmEncrypt(plainText, keyBase64);
    setEncryptedMessageBase64(encryptedDataBase64);
    setIvBase64(ivBase64);
    setAuthTagBase64(authTagBase64);
    setEncryptionResult(`Encrypted: ${encryptedDataBase64}, IV: ${ivBase64}, AuthTag: ${authTagBase64}`);
  };

  const handleDecrypt = () => {
    const decryptedData = aes256gcmDecrypt(encryptedMessageBase64, authTagBase64, ivBase64, keyBase64);
    setDecryptionResult(`Decrypted: ${decryptedData}`);
  };

  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box sx={{ px: { xs: 2, md: 6 } }}>
        <Typography level="title-md">AES-256-GCM Preview</Typography>
        <br />
        <Card>
          <Typography component="p">
            AES-256-GCM is a symmetric encryption algorithm that uses the same key for both encryption and decryption.
            The key must be 32 bytes long and the IV must be 12 bytes long.
            The encrypted message will be in Base64 format.
          </Typography>
          <Typography level="body-md">Key (Base64)</Typography>
          <Input
            placeholder="Key (Base64), must be 32 bytes"
            value={keyBase64}
            onChange={(e) => setKeyBase64(e.target.value)}
          />
          <Typography level="body-md">IV (Base64)</Typography>
          <Input
            placeholder="IV (Base64) for Decryption. FYI, it will be auto populated as a 12 random bytes during encryption"
            value={ivBase64}
            onChange={(e) => setIvBase64(e.target.value)}
          />
        </Card>
      </Box>
      <br />

      <Box sx={{ px: { xs: 2, md: 6 } }}>
        <Card>
        <Typography level="body-md">Encryption</Typography>
        <Input
          placeholder="Plain Text Message for Encryption"
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)}
        />
        <Button onClick={handleEncrypt}>Encrypt</Button>
        <Typography component="p">{encryptionResult}</Typography>
        </Card>
      </Box>      
      <br />
      <Box sx={{ px: { xs: 2, md: 6 } }}>
        <Card>
        <Typography level="body-md">Decryption</Typography>
        <Input
          placeholder="Encrypted Message (Base64) for Decryption"
          value={encryptedMessageBase64}
          onChange={(e) => setEncryptedMessageBase64(e.target.value)}
        />
        <Input
          placeholder="AuthTag (Base64) for Decryption"
          value={authTagBase64}
          onChange={(e) => setAuthTagBase64(e.target.value)}
        />
        <Button color="success" onClick={handleDecrypt}>Decrypt</Button>
        <Typography component="p">{decryptionResult}</Typography>
        </Card>
      </Box>
    </Box>
  );
};

export default Aes256GcmPage;