'use client';

import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { sha3_512 } from 'js-sha3';

import {
  Textarea,
  Box,
  Chip,
  Input,
  Alert,
  Typography,
  IconButton
} from '@mui/joy';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function HashGenerator() {
  //userinput textarea
  const [input, setInput] = useState('');

  //MD5
  const [md5HashedText, setMd5HashedText] = useState('');
  //SHA-1
  const [sha1HashedText, setSha1HashedText] = useState('');
  //SHA-2
  const [sha256HashedText, setSha256HashedText] = useState('');
  const [sha512HashedText, setSha512HashedText] = useState('');
  //SHA-3
  const [sha3_512HashedText, setSha3_512HashedText] = useState('');

  const generateHash = (userInput) => {
    const hash_md5 = CryptoJS.MD5(userInput).toString(CryptoJS.enc.Hex);
    setMd5HashedText(hash_md5);
    const hash_sha1 = CryptoJS.SHA1(userInput).toString(CryptoJS.enc.Hex);
    setSha1HashedText(hash_sha1);
    const hash_sha256 = CryptoJS.SHA256(userInput).toString(CryptoJS.enc.Hex);
    setSha256HashedText(hash_sha256);
    const hash_sha512 = CryptoJS.SHA512(userInput).toString(CryptoJS.enc.Hex);
    setSha512HashedText(hash_sha512);
    const hash_sha3_512 = sha3_512(userInput);
    setSha3_512HashedText(hash_sha3_512);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    generateHash(value);
  };

  return (
    <div>
      <p>
        Client-side hashing exposes data in the browser and is not suitable for
        sensitive information.
      </p>
      <p>This is for demonstration purposes only. Output as a HEX string.</p>
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
      {/* MD5 */}
      {input && md5HashedText && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Typography fontSize="xl">MD5</Typography>
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
            value={md5HashedText}
            endDecorator={`${md5HashedText.length / 2} byte(s)`}
            readOnly
          />
        </div>
      )}
      {/* SHA-1 */}
      {input && sha1HashedText && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Typography fontSize="xl">SHA1</Typography>
            <Chip color="warning" variant="soft">
              Weak
            </Chip>
            <Alert variant="soft" color="warning">
              SHA1
            </Alert>
          </Box>
          <Input
            type="text"
            color="warning"
            value={sha1HashedText}
            endDecorator={`${sha1HashedText.length / 2} byte(s)`}
            readOnly
          />
        </div>
      )}
      {/* SHA-2 */}
      {input && sha256HashedText && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Typography fontSize="xl">SHA256</Typography>
            <Chip color="primary" variant="soft">
              OK
            </Chip>
            <Alert variant="soft" color="primary">
              SHA2, operate on 32-bit words
            </Alert>
          </Box>
          <Input
            type="text"
            color="primary"
            value={sha256HashedText}
            endDecorator={
              <>
                {`${sha256HashedText.length / 2} byte(s)`}
                <IconButton
                  onClick={() =>
                    navigator.clipboard.writeText(sha256HashedText)
                  }
                >
                  <ContentCopyIcon />
                </IconButton>
              </>
            }
            readOnly
          />
        </div>
      )}
      {input && sha512HashedText && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Typography fontSize="xl">SHA512</Typography>
            <Chip color="primary" variant="soft">
              OK
            </Chip>
            <Alert variant="soft" color="primary">
              SHA2, operate on 64-bit words
            </Alert>
          </Box>
          <Input
            type="text"
            color="primary"
            value={sha512HashedText}
            endDecorator={
              <>
                {`${sha512HashedText.length / 2} byte(s)`}
                <IconButton
                  onClick={() =>
                    navigator.clipboard.writeText(sha512HashedText)
                  }
                >
                  <ContentCopyIcon />
                </IconButton>
              </>
            }
            readOnly
          />
        </div>
      )}
      {/* SHA-3 */}
      {input && sha3_512HashedText && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Typography fontSize="xl">SHA3</Typography>
            <Chip color="success" variant="soft">
              Recommanded
            </Chip>
            <Alert variant="soft" color="success">
              SHA3 (SHA3 output hash lengths of one of 224, 256, 384, or 512
              bits. The default is 512 bits)
            </Alert>
          </Box>
          <Input
            type="text"
            color="success"
            value={sha3_512HashedText}
            endDecorator={
              <>
                {`${sha3_512HashedText.length / 2} byte(s)`}
                <IconButton
                  onClick={() =>
                    navigator.clipboard.writeText(sha3_512HashedText)
                  }
                >
                  <ContentCopyIcon />
                </IconButton>
              </>
            }
            readOnly
          />
        </div>
      )}
    </div>
  );
}
