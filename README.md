# CipherCracker

A free, open-source web-based cryptography toolkit for cracking ciphers, generating hashes, and working with encryption — all from your browser.

**Live site:** [CipherCracker](https://github.com/qwer0516yp/CipherCracker.NextJoy)
**Documentation:** [GitBook Docs](https://st-akey.gitbook.io/cipher-cracker-next-joy)

## Features

### Encryption / Decryption

- **AES** — symmetric encryption and decryption
- **3DES (Triple DES)** — legacy symmetric cipher support
- **RSA** — public-key encryption

### Hashing & Authentication

- **Hash Generator** — MD5, SHA-1, SHA-256, SHA-512, SHA-3
- **HMAC Generator** — keyed-hash message authentication

### Token & Key Tools

- **JWT** — inspect and decode JSON Web Tokens
- **JWE** — JSON Web Encryption
- **JWK** — JSON Web Key management

### Encoding / Decoding

- **String Converter** — Base64, Hex, ASCII, URL encoding

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Joy UI](https://mui.com/joy-ui/getting-started/) (MUI)
- [crypto-js](https://github.com/brix/crypto-js) + [js-sha3](https://github.com/nicolo-ribaudo/js-sha3) for client-side cryptography
- [NextAuth.js](https://next-auth.js.org/) for OAuth (GitHub, Google, Auth0)
- [Vercel Analytics](https://vercel.com/analytics) + Speed Insights

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (recommended)

### Install & Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start development server |
| `pnpm build` | Create production build  |
| `pnpm start` | Start production server  |
| `pnpm lint`  | Run ESLint               |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── 3des/              # 3DES tool
│   ├── aes/               # AES tool
│   ├── aesgcm/            # AES-256-GCM tool
│   ├── encoding/          # String encoding/decoding
│   ├── hash/              # Hash generator
│   ├── hmac/              # HMAC generator
│   ├── jwt/               # JWT inspector
│   ├── jwe/               # JWE tools
│   ├── jwk/               # JWK tools
│   └── rsa/               # RSA encryption
├── components/
│   ├── front-end/         # Crypto tool UI components
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── Header.tsx         # Page header
└── lib/
    └── auth.ts            # NextAuth configuration
```

## Privacy

Most cryptographic operations run entirely **client-side** — your data never leaves the browser. The AES-256-GCM page uses server-side rendering with Node.js crypto and includes a warning not to use production keys.

## License

Open source. See repository for details.
