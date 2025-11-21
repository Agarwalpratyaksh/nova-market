import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import idl from "./nova_market.json"; // The file you copied earlier

// 1. Define your Program ID (Must match lib.rs)
const PROGRAM_ID = new PublicKey("7rT7B67dEjNfR3bitHwcdw2JAgVPCefmDo3yQRP7MZMJ");

export const getProgram = (connection: Connection, wallet: any) => {
  // 2. Create the Provider (Connects Wallet + Connection)
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  // 3. Create the Program Interface
  // We cast 'idl' as Idl to satisfy TypeScript
  return new Program(idl as Idl, provider);
};