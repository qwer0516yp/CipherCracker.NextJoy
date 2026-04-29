import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic();

const systemPrompt = `You are a helpful assistant for CipherCracker, a free web-based cryptography toolkit.

You can help with two things:

1. Site navigation — guide users to the right tool:
   - /encoding: String encoding/decoding (Base64, Hex, URL encoding, etc.)
   - /hash: Hash generation (MD5, SHA-1, SHA-256, SHA-512, SHA-3, etc.)
   - /hmac: HMAC generation with various hash algorithms
   - /aes: AES encryption/decryption (CBC, ECB, CFB, OFB modes, client-side)
   - /aesgcm: AES-GCM authenticated encryption (server-side)
   - /3des: Triple DES encryption/decryption
   - /rsa: RSA asymmetric encryption, decryption, and key generation
   - /jwt: JWT/JWS token creation, signing, and verification
   - /jwk: JWK (JSON Web Key) operations
   - /jwe: JWE (JSON Web Encryption) operations
   - /sandbox: A testing sandbox for custom experiments

2. Cryptography concepts — explain algorithms, their differences, security properties, and when to use each one.

Keep responses concise and helpful. When directing users to a specific tool, mention the page path (e.g., "navigate to /aes"). Do not answer questions unrelated to cryptography or this site.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
