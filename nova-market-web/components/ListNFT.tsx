"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor"; 
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { getProgram } from "../utils/anchor";

export default function ListNFT() {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  const [mintAddr, setMintAddr] = useState("");
  const [price, setPrice] = useState("");
  const [isListing, setIsListing] = useState(false);

  const listNft = async () => {
    if (!wallet.publicKey) return alert("Connect wallet first!");
    setIsListing(true);

    try {
      const program = getProgram(connection, wallet);
      const mint = new PublicKey(mintAddr);
      const priceInLamports = new anchor.BN(parseFloat(price) * 1_000_000_000); 

      const [listingPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("listing"), mint.toBuffer()],
        program.programId
      );

      const [vaultTokenAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), mint.toBuffer()],
        program.programId
      );

      const sellerTokenAccount = await getAssociatedTokenAddress(
        mint,
        wallet.publicKey
      );

      const tx = await program.methods
        .list(priceInLamports)
        .accounts({
          seller: wallet.publicKey,
          mint: mint,
          sellerTokenAccount: sellerTokenAccount,
          vaultTokenAccount: vaultTokenAccount,
          listing: listingPda,
        })
        .rpc();

      alert("Success! Tx Hash: " + tx);
      setMintAddr("");
      setPrice("");
    } catch (error) {
      console.error("Error listing NFT:", error);
      alert("Error listing NFT. Check console.");
    } finally {
      setIsListing(false);
    }
  };

  return (
    <div className="minimal-card p-8 rounded-sm w-full">
      <h3 className="text-lg font-medium text-white mb-6">List Asset</h3>
      
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Mint Address</label>
          <input
            type="text"
            placeholder="7xR..."
            className="minimal-input w-full p-4 rounded-sm text-sm font-mono placeholder-zinc-700"
            value={mintAddr}
            onChange={(e) => setMintAddr(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Price</label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              className="minimal-input w-full p-4 rounded-sm text-sm font-mono placeholder-zinc-700"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <div className="absolute right-4 top-4 text-zinc-500 text-sm font-medium">SOL</div>
          </div>
        </div>

        <button 
          onClick={listNft}
          disabled={isListing}
          className={`w-full mt-2 py-4 rounded-sm text-sm font-bold tracking-wide uppercase transition-all
            ${isListing 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-white text-black hover:bg-zinc-200'
            }`}
        >
          {isListing ? "Processing..." : "List for Sale"}
        </button>
      </div>
    </div>
  );
}