"use client";

import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";

interface Props {
  listing: {
    publicKey: PublicKey;
    account: {
      seller: PublicKey;
      mint: PublicKey;
      price: any; 
    };
  };
  onBuy: (listing: any) => void;
  onCancel: (listing: any) => void;
  walletKey: PublicKey | null;
}

export default function NftCard({ listing, onBuy, onCancel, walletKey }: Props) {
  const [image, setImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const umi = createUmi("https://api.devnet.solana.com"); 
        const mintAddress = publicKey(listing.account.mint.toString());
        const asset = await fetchDigitalAsset(umi, mintAddress);

        setName(asset.metadata.name);
        if (asset.metadata.uri) {
          const response = await fetch(asset.metadata.uri);
          const json = await response.json();
          setImage(json.image);
        }
      } catch (error) {
        console.error("Error loading metadata:", error);
        setName("Unknown Artifact");
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [listing.account.mint]);

  const priceSol = listing.account.price.toNumber() / 1_000_000_000;
  const isOwner = listing.account.seller.toString() === walletKey?.toString();
  const mintAddr = listing.account.mint.toString();

  return (
    <div className="group minimal-card rounded-sm overflow-hidden hover:border-zinc-500 transition-colors duration-300 flex flex-col">
      <div className="aspect-square w-full bg-zinc-900 relative overflow-hidden">
        {loading ? (
          <div className="w-full h-full bg-zinc-800 animate-pulse" />
        ) : image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900">
            <span className="text-xs">NO IMG</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3">
        
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm text-white truncate max-w-[120px] leading-tight">
            {loading ? "..." : name}
          </h3>
          <p className="text-white font-medium text-sm whitespace-nowrap">{priceSol} SOL</p>
        </div>

        <div className="flex flex-col gap-1 text-xs font-mono text-zinc-500">
          <div className="flex justify-between">
            <span>Seller:</span>
            <span className="text-zinc-400">
               {listing.account.seller.toString().slice(0, 4)}...
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Mint:</span>
            <a 
              href={`https://explorer.solana.com/address/${mintAddr}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white underline decoration-zinc-700 transition-colors cursor-pointer"
              title={mintAddr} // Shows full address on hover
            >
               {mintAddr.slice(0, 4)}...{mintAddr.slice(-4)} ↗
            </a>
          </div>
        </div>

        <div className="mt-2">
          {isOwner ? (
            <button 
              onClick={() => onCancel(listing)}
              className="w-full py-2 border border-red-900 text-red-500 hover:bg-red-950 text-xs font-medium uppercase tracking-wide transition-colors"
            >
              Cancel
            </button>
          ) : (
            <button 
              onClick={() => onBuy(listing)}
              className="w-full py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-wide transition-colors"
            >
              Buy Now
            </button>
          )}
        </div>

      </div>
    </div>
  );
}