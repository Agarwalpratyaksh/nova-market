"use client";

import dynamic from "next/dynamic";
import ListNFT from "@/components/ListNFT";
import ListingsGrid from "@/components/ListingsGrid";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col px-6 md:px-12 py-8 max-w-[1400px] mx-auto">
      {/* --- Header --- */}
      <header className="flex items-center justify-between mb-24">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-white rounded-full"></div> {/* Minimal Logo */}
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Nova Market
          </h1>
        </div>
        <WalletMultiButton style={{ 
          backgroundColor: "#ffffff", 
          color: "#000000", 
          fontFamily: "sans-serif",
          fontWeight: "600",
          height: "40px",
          borderRadius: "4px"
        }} />
      </header>

      {/* --- Hero & Action --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
        {/* Typography Section */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-8 leading-[0.9]">
            Digital <br />
            Ownership.
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-md leading-relaxed">
            A pure, decentralized marketplace protocol on Solana. 
            Zero friction. Instant settlement.
          </p>
        </div>

        {/* Listing Form */}
        <div className="lg:col-span-5">
          <ListNFT />
        </div>
      </div>

      {/* --- Feed --- */}
      <div className="border-t border-zinc-800 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-medium text-white">Market</h3>
          <span className="text-sm text-zinc-500 font-mono">LIVE FEED</span>
        </div>
        <ListingsGrid />
      </div>

    </main>
  );
}