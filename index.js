import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';

(async () => {
    // Step 1: Connect to cluster and generate a new Keypair
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const fromWallet = Keypair.generate();

    // Use your Phantom wallet address
    const phantomAddress = new PublicKey('AuLDG7MPdRE7i6CCDHpUeZSKvBy7TLhaMaxh1wpitxni');

    // Step 2: Airdrop SOL into your from wallet
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(fromAirdropSignature, { commitment: "confirmed" });

    // Step 3: Create new token mint and get the token account of the fromWallet address
    const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9);
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    );

    //Step 4: Mint a new token to the Phantom wallet address
    const phantomTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        phantomAddress
    );
    let signature = await mintTo(
        connection,
        fromWallet,
        mint,
        phantomTokenAccount.address,
        fromWallet.publicKey,
        1000000000,
        []
    );
    console.log('mint tx:', signature);
})();
