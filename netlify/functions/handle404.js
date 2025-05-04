const axios = require('axios');

// Simulasi hardcoded atau import dari file konfigurasi
const TELEGRAM_BOT_TOKEN = "7781366082:AAGcABsFljdIfO0kn8MPB6F1xhCYy-LAVnM";
const TELEGRAM_CHAT_ID = "1099301022";

exports.handler = async (event, context) => {
  // Mengambil path dari query string
  const originalPath = event.queryStringParameters?.path || 'Unknown path';

  // Jika path adalah 'Unknown path', berarti bukan path yang tidak ditemukan (valid)
  if (originalPath === 'Unknown path') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Path valid, tidak dikirim ke Telegram." })
    };
  }

  // Ambil IP yang merequest
  const ip = event.headers['x-forwarded-for'] || event.headers['remote-addr'] || 'Unknown IP';

  // Format waktu sekarang
  const timestamp = new Date().toISOString();

  // Format pesan untuk Telegram
  const message = `
*⚠️ 404 Error Detected*
  
*Path:* \`${originalPath}\`
*Timestamp:* \`${timestamp}\`
*IP Address:* \`${ip}\`

\`Error Type:\` \`404 Not Found\`
`;

  // Susun URL API Telegram untuk mengirim pesan
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    // Mengirimkan POST request langsung ke API Telegram
    const response = await axios.post(TELEGRAM_API_URL, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown' // Menggunakan format Markdown untuk styling pesan
    });

    // Log respons Telegram
    console.log('Telegram response:', response.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notifikasi 404 berhasil dikirim ke Telegram" })
    };
  } catch (error) {
    // Log error jika request ke Telegram gagal
    console.error("Error mengirim pesan ke Telegram:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Gagal mengirim notifikasi ke Telegram", error: error.message })
    };
  }
};
