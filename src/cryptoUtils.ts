const { randomBytes, createCipheriv, createDecipheriv } = require('crypto');

// Encrypt function
export function aes256gcmEncrypt(plaintext: string, keyBase64: string) {
    const key = Buffer.from(keyBase64, 'base64');
    const iv = randomBytes(12); // 12 bytes is recommended for GCM
    const cipher = createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag().toString('base64');

    return {ivBase64: iv.toString('base64'), encryptedDataBase64: encrypted, authTagBase64: authTag};
}

// Decrypt function
export function aes256gcmDecrypt(encryptedDataBase64: string, authTagBase64: string, ivBase64: string, keyBase64: string) {
    const encrypted = Buffer.from(encryptedDataBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');
    const key = Buffer.from(keyBase64, 'base64');
    
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, null, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Extracts the AuthTag and CipherText from a concatenated Base64 string.
 * 
 * @param {string} concatBase64 - The concatenated Base64 string containing both the CipherText and AuthTag.
 * @returns {{ cipherTextBase64: string, authTagBase64: string }} An object containing the AuthTag and CipherText as Base64 strings.
 */
export function extractAuthTagAndCipherText(concatBase64: string): { cipherTextBase64: string; authTagBase64: string} {
    // Decode the concatenated Base64 string to a Buffer
    const buffer = Buffer.from(concatBase64, 'base64');

    // Ensure the buffer is longer than the length of an AuthTag (16 bytes for AES-GCM)
    if (buffer.length <= 16) {
        throw new Error('The input is too short to contain both an AuthTag and CipherText.');
    }

    // Extract the AuthTag (last 16 bytes) and CipherText (everything before the AuthTag)
    const authTag = buffer.slice(buffer.length - 16);
    const cipherText = buffer.slice(0, buffer.length - 16);

    // Convert both parts back to Base64 strings
    const authTagBase64 = authTag.toString('base64');
    const cipherTextBase64 = cipherText.toString('base64');

    return { cipherTextBase64: cipherTextBase64, authTagBase64: authTagBase64};
}
