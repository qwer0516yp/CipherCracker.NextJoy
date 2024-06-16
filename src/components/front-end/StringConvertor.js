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
  Snackbar
} from '@mui/joy';

import WarningIcon from '@mui/icons-material/Warning';

export default function StringConvertor() {
  //Snackbar for showing none essential error when converting bytes into certain encoding
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
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
  //Utf-16
  const [utf16Text, setUtf16Text] = useState('');
  //Latin1
  const [latin1Text, setLatin1Text] = useState('');

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

    try {
      setUtf16Text(CryptoJS.enc.Utf16.stringify(inputBytes));
    } catch (error) {
      console.error('Conversion error:', error);
      setSnackBarOpen(true);
      setUtf16Text('');
    }

    try {
      setLatin1Text(CryptoJS.enc.Latin1.stringify(inputBytes));
    } catch (error) {
      console.error('Conversion error:', error);
      setSnackBarOpen(true);
      setLatin1Text('');
    }
  };

  const handleEncodingChange = (event, newEncoding) => {
    switch (newEncoding) {
      case 'hex':
        setEncoding(CryptoJS.enc.Hex);
        break;
      case 'base64':
        setEncoding(CryptoJS.enc.Base64);
        break;
      case 'utf16':
        setEncoding(CryptoJS.enc.Utf16);
        break;
      case 'latin1':
        setEncoding(CryptoJS.enc.Latin1);
        break;
      default:
        setEncoding(CryptoJS.enc.Utf8);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    ConvertUserInput(value);
  };

  return (
    <React.Fragment>
      <Box sx={{ width: 400, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Select
          color="warning"
          variant="soft"
          defaultValue="utf8"
          onChange={handleEncodingChange}
        >
          <Option value="utf8">UTF-8</Option>
          <Option value="hex">HEX</Option>
          <Option value="base64">BASE64</Option>
          <Option value="utf16">UTF-16</Option>
          <Option value="latin1">Latin1</Option>
        </Select>
        <Button
          color="primary"
          variant="soft"
          onClick={() => ConvertUserInput(`${input}`)}
        >
          Rerun
        </Button>
      </Box>
      <br />
      <Textarea
        value={input}
        onChange={handleInputChange}
        minRows={3}
        maxRows={5}
        placeholder="Convert string from your specified one to various formats. Rerun after encoding change. Try provide your string here..."
        endDecorator={
          <Typography level="body-xs" sx={{ ml: 'auto' }}>
            {input.length} character(s)
          </Typography>
        }
      />

      {/* Invalid user input in given encoding */}
      {input && !isValidInput && (
        <div>
          <Alert variant="soft" color="danger" startDecorator={<WarningIcon />}>
            The text you provided is an invalid string of your specified
            encoding / format. Please try fix it!
          </Alert>
        </div>
      )}

      {/* HEX */}
      {input && isValidInput && hexText && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Chip color="success" variant="soft">
              Hex
            </Chip>
            <Alert variant="soft">
              default display *lower case* without delimiter in between bytes.
            </Alert>
          </Box>
          <Input
            type="text"
            value={hexText}
            endDecorator={`${hexText.length / 2} Byte(s)`}
            readOnly
          />
        </div>
      )}
      {/* Base64 */}
      {input && isValidInput && base64Text && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Chip color="primary" variant="soft">
              Base64
            </Chip>
          </Box>
          <Input
            type="text"
            value={base64Text}
            endDecorator={`${base64Text.length} Character(s)`}
            readOnly
          />
        </div>
      )}
      {/* UTF-8 */}
      {input && isValidInput && utf8Text && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Chip color="warning" variant="soft">
              UTF-8
            </Chip>
          </Box>
          <Input
            type="text"
            value={utf8Text}
            endDecorator={`${utf8Text.length} Character(s)`}
            readOnly
          />
        </div>
      )}
      {/* UTF-16 */}
      {input && isValidInput && utf16Text && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Chip color="warning" variant="soft">
              UTF-16
            </Chip>
          </Box>
          <Input
            type="text"
            value={utf16Text}
            endDecorator={`${utf16Text.length} Character(s)`}
            readOnly
          />
        </div>
      )}
      {/* Latin1 */}
      {input && isValidInput && latin1Text && (
        <div>
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', padding: 1 }}
          >
            <Chip color="danger" variant="soft">
              Latin1
            </Chip>
          </Box>
          <Input
            type="text"
            value={latin1Text}
            endDecorator={`${latin1Text.length} Character(s)`}
            readOnly
          />
        </div>
      )}

      <Snackbar
        autoHideDuration={3000}
        variant="soft"
        color="danger"
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
        Some encoding conversion failed, they won't be shown up.
      </Snackbar>
    </React.Fragment>
  );
}
