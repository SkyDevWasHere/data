const axios = require('axios');

// Konfigurasi token dan chat ID Telegram
const TELEGRAM_BOT_TOKEN = "7781366082:AAGcABsFljdIfO0kn8MPB6F1xhCYy-LAVnM";
const TELEGRAM_CHAT_ID = "1099301022";

exports.handler = async (event, context) => {
  // Mengambil path dari query string
  const originalPath = event.queryStringParameters?.path || 'Unknown path';

  // Jika path ditemukan (valid), tidak perlu mengirimkan notifikasi
  if (originalPath === 'Unknown path') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Path valid, tidak dikirim ke Telegram." })
    };
  }

  // Jika path tidak valid (404), kirimkan pesan ke Telegram
  // Ambil IP pengunjung dari headers
  const ip = event.headers['x-forwarded-for'] || event.headers['remote-addr'] || 'Unknown IP';

  // Format waktu saat ini
  const timestamp = new Date().toISOString();

  // Format pesan yang akan dikirim ke Telegram
  const message = `
*⚠️ 404 Error Detected*
  
*Path:* \`${originalPath}\`
*Timestamp:* ${timestamp}
*IP Address:* ${ip}

\`Error Type:\` 404 Not Found
`;

  // Susun URL API Telegram
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    // Kirim POST request ke Telegram API untuk mengirim pesan
    const response = await axios.post(TELEGRAM_API_URL, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown' // Menggunakan Markdown untuk format pesan
    });

    // Log respons dari Telegram (untuk debugging)
    console.log('Telegram response:', response.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notifikasi 404 berhasil dikirim ke Telegram" })
    };
  } catch (error) {
    // Jika terjadi error saat mengirim pesan ke Telegram
    console.error("Error mengirim pesan ke Telegram:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Gagal mengirim notifikasi ke Telegram", error: error.message })
    };
  }
};
