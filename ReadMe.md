# 🚀 Nova Market

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Devnet%20Ready-green.svg)
![Network](https://img.shields.io/badge/network-Solana%20Devnet-purple.svg)
![Framework](https://img.shields.io/badge/framework-Anchor%20%7C%20Next.js-blueviolet.svg)

Nova Market is a decentralized, trustless NFT marketplace built on Solana. It uses program-owned vaults (PDAs) and atomic swaps to keep listings fully on‑chain and permissionless.

## ✨ Features

- Trustless Escrow: Vaults (PDAs) hold NFTs while listed.
- Atomic Swaps: Single-transaction SOL ↔ NFT exchanges.
- Admin Minting: CLI to mint SPL tokens with Metaplex metadata (pin to Arweave).
- Full Lifecycle: List, Buy, and Cancel — all on-chain.
- Minimal UI: Next.js + Tailwind CSS with Solana Wallet Adapter support.

## 🛠 Tech Stack

**Backend (Smart Contract)**

- Rust + Anchor
- Solana Devnet
- SPL Token, Metaplex Token Metadata

**Frontend (Client)**

- Next.js 14+ (App Router), TypeScript
- Tailwind CSS
- Solana Wallet Adapter (Phantom, Backpack, Solflare)
- SDKs: @metaplex-foundation/umi, @coral-xyz/anchor

## 🏗 Architecture (high level)

- Listing Account (PDA) — stores price, seller, mint, and metadata.  
  Example seed: `["listing", mint_address]`
- Vault Account (PDA) — program-owned token account holding the NFT while listed.  
  Example seed: `["vault", mint_address]`

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Rust & Cargo
- Solana CLI
- Anchor CLI
- pnpm (recommended) or npm/yarn

### 1) Clone

```bash
git clone https://github.com/Agarwalpratyaksh/nova-market.git
cd nova-market
```

### 2) Build & Deploy Program (Anchor)

```bash
# From repo root
anchor build

# Configure Solana / fund wallet
solana config set --url devnet
solana-keygen new -o ~/.config/solana/id.json --force
solana airdrop 5

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

After deploy, copy the Program ID and update:

- programs/nova_market/src/lib.rs → declare_id!("<NEW_ID>")
- Anchor.toml → [programs.devnet] nova_market = "<NEW_ID>"

### 3) Frontend

```bash
cd app

pnpm install   # or npm install / yarn
cp .env.example .env.local

# Edit .env.local and set NEXT_PUBLIC_PROGRAM_ID=<NEW_ID>
pnpm dev

```

## 🔧 Quick Usage

- Mint (admin CLI)
- List: Connect wallet, paste mint address, set price, click "List".
- Buy: Buyer connects and clicks "Buy Now".
- Cancel: Seller can cancel to return NFT from vault.

All actions link to Solana Explorer for on-chain verification.


## 🤝 Contributing

PRs welcome. For major changes open an issue first. Recommended pre-PR checks:

```bash
pnpm lint && anchor test
```

## 📄 License

MIT © 2025 Nova Market contributors.
