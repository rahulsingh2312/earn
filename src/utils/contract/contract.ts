import {
  AnchorProvider,
  BN,
  type Idl,
  Program,
  utils,
  type Wallet,
  web3,
} from '@coral-xyz/anchor';
import * as spl from '@solana/spl-token';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import { type EarnReloaded, IDL } from './program';

const PROGRAM_ID = process.env.NEXT_PUBLIC_PAYMENT_PROGRAM_ID || '';
const RPC_URL = process.env.NEXT_PUBLIC_PAYMENT_RPC_URL || '';

export const connection = new web3.Connection(RPC_URL, 'confirmed');

const getProvider = (wallet: Wallet) => {
  return new AnchorProvider(connection, wallet, {
    preflightCommitment: 'processed',
  });
};

const getAnchorProgram = (wallet: Wallet) => {
  const provider = getProvider(wallet);
  const idl = IDL as Idl;
  return new Program(
    idl,
    PROGRAM_ID,
    provider,
  ) as unknown as Program<EarnReloaded>;
};

const getOrCreateTokenAccount = async (
  token: PublicKey,
  owner: PublicKey,
  payer: PublicKey,
) => {
  const ata = await spl.getAssociatedTokenAddress(
    token,
    owner,
    false,
    spl.TOKEN_PROGRAM_ID,
    spl.ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  const info = await connection.getAccountInfo(ata);
  let instruction = null;
  if (!info) {
    instruction = spl.createAssociatedTokenAccountInstruction(
      payer,
      ata,
      owner,
      token,
    );
  }
  return { ata, instruction };
};

export const createPaymentSPL = async (
  wallet: Wallet,
  receiver: PublicKey,
  amount: number,
  token: PublicKey,
  id: string,
) => {
  const program = getAnchorProgram(wallet);
  const [payoutAccount] = PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('payout'),
      utils.bytes.utf8.encode(id),
      token.toBuffer(),
      receiver.toBuffer(),
    ],
    program.programId,
  );

  const { ata: receiverATA, instruction: receiverATAIx } =
    await getOrCreateTokenAccount(token, receiver, wallet.publicKey);
  const { ata: senderATA } = await getOrCreateTokenAccount(
    token,
    wallet.publicKey,
    wallet.publicKey,
  );

  const payoutIx = await program.methods
    .payout(id, receiver, new BN(amount))
    .accounts({
      authority: wallet.publicKey,
      tokenAtaReceiver: receiverATA,
      tokenAtaSender: senderATA,
      tokenMint: token,
      payoutAccount,
      associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: spl.TOKEN_PROGRAM_ID,
    })
    .instruction();

  return [payoutIx, receiverATAIx].filter((ix) => ix !== null);
};

export const createPaymentSOL = async (
  wallet: Wallet,
  receiver: PublicKey,
  amount: number,
  id: string,
) => {
  const program = getAnchorProgram(wallet);

  const [payoutAccount] = PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('payout'),
      utils.bytes.utf8.encode(id),
      utils.bytes.utf8.encode('sol'),
      receiver.toBuffer(),
    ],
    program.programId,
  );

  return program.methods
    .payoutSol(id, receiver, new BN(amount * LAMPORTS_PER_SOL))
    .accounts({
      authority: wallet.publicKey,
      payoutAccount,
      receiverAccount: receiver,
      tokenProgram: spl.TOKEN_PROGRAM_ID,
    })
    .instruction();
};
