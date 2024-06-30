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
