const solanaWeb3 = require('@solana/web3.js');
const bs58 = require('bs58');

// Kết nối với mạng Solana 
const connection = new solanaWeb3.Connection('https://api.testnet.sonic.game', 'confirmed');
// const connection = new solanaWeb3.Connection('https://devnet.sonic.game', 'confirmed');

// Private key dạng chuỗi base58 của ví gửi
const senderSecretKeyString = ''; // 

// Chuyển đổi private key từ base58 string sang Uint8Array
const senderSecretKey = bs58.decode(senderSecretKeyString);

// Tạo Keypair từ private key
const fromWallet = solanaWeb3.Keypair.fromSecretKey(senderSecretKey);

// Địa chỉ ví nhận (public key)
const toWallet = new solanaWeb3.PublicKey(''); // Thay bằng địa chỉ ví nhận thực sự

// Hàm gửi SOL từ ví gửi đến ví nhận
async function sendSol() {
    try {
        for (let i = 0; i < 100; i++) {

        // Lấy số lamports cần để miễn phí thuê
        const rentExemptBalance = await connection.getMinimumBalanceForRentExemption(0); // Đối với tài khoản không có data

        // In ra số lamports cần thiết để miễn phí thuê
        console.log(`ExtemptBalance: ${rentExemptBalance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);

 
        const balance = await connection.getBalance(fromWallet.publicKey);

        // In ra số dư dưới dạng SOL (balance trả về là lamports, cần chia cho LAMPORTS_PER_SOL)
        console.log(`Balance: ${balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);

        // Tạo transaction để gửi 0.1 SOL
        const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: fromWallet.publicKey,
                toPubkey: toWallet,
                lamports: solanaWeb3.LAMPORTS_PER_SOL * 0.0001, // 0.0001 SOL
            })
        );

        // Ký và gửi transaction
        const signature = await solanaWeb3.sendAndConfirmTransaction(
            connection,
            transaction,
            [fromWallet] // Ký transaction bằng khóa riêng của ví gửi
        );

        console.log('Transaction signature:', signature);
        }
    } catch (err) {
        console.error("Transaction failed:", err);
    }
}

// Gọi hàm gửi SOL
sendSol();
