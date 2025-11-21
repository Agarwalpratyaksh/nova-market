"use client";

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";
import { getProgram } from "../utils/anchor";
import NftCard from "./NftCard";

interface ListingAccount {
  publicKey: PublicKey;
  account: {
    seller: PublicKey;
    mint: PublicKey;
    price: anchor.BN;
    bump: number;
  };
}

export default function ListingsGrid() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [listings, setListings] = useState<ListingAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      if (!wallet.publicKey) {
        setIsLoading(false);
        return;
      } 
      
      try {
        const program = getProgram(connection, wallet);
        // @ts-ignore
        const accounts = await program.account.listing.all();
        setListings(accounts);
      } catch (e) {
        console.error("Error fetching:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [connection, wallet.publicKey]);

  const buyNft = async (listing: ListingAccount) => {
    if (!wallet.publicKey) return;
    try {
      const program = getProgram(connection, wallet);
      const mint = listing.account.mint;
      const seller = listing.account.seller;
      const listingPda = listing.publicKey;

      const [vaultTokenAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), mint.toBuffer()],
        program.programId
      );

      const buyerTokenAccount = await getAssociatedTokenAddress(mint, wallet.publicKey);

      const tx = await program.methods.buy().accounts({
          buyer: wallet.publicKey,
          seller: seller,
          mint: mint,
          listing: listingPda,
          vaultTokenAccount: vaultTokenAccount,
          buyerTokenAccount: buyerTokenAccount,
        }).rpc();

      alert("Bought successfully! Tx: " + tx);
      setListings(listings.filter(l => l.publicKey.toString() !== listingPda.toString()));
    } catch (error) {
      console.error("Buy Error:", error);
      alert("Failed to buy.");
    }
  };

  const cancelNft = async (listing: ListingAccount) => {
    if (!wallet.publicKey) return;
    try {
      const program = getProgram(connection, wallet);
      const mint = listing.account.mint;
      const listingPda = listing.publicKey;

      const [vaultTokenAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), mint.toBuffer()],
        program.programId
      );

      const sellerTokenAccount = await getAssociatedTokenAddress(mint, wallet.publicKey);

      const tx = await program.methods.cancel().accounts({
          seller: wallet.publicKey,
          mint: mint,
          listing: listingPda,
          vaultTokenAccount: vaultTokenAccount,
          sellerTokenAccount: sellerTokenAccount,
        }).rpc();

      alert("Listing Cancelled! Tx: " + tx);
      setListings(listings.filter(l => l.publicKey.toString() !== listingPda.toString()));
    } catch (error) {
      console.error("Cancel Error:", error);
      alert("Failed to cancel.");
    }
  };

  if (!wallet.publicKey) {
    return (
      <div className="w-full py-20 border border-dashed border-zinc-800 rounded-sm flex items-center justify-center">
        <p className="text-zinc-500">Connect wallet to view market.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="w-full py-20 flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  return (
    <div className="w-full">
      {listings.length === 0 ? (
        <div className="w-full py-20 border border-dashed border-zinc-800 rounded-sm flex flex-col items-center justify-center gap-2">
          <p className="text-zinc-400">No active listings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <NftCard 
              key={item.publicKey.toString()} 
              listing={item}
              onBuy={buyNft}
              onCancel={cancelNft}
              walletKey={wallet.publicKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}