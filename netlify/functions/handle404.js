const axios = require('axios');

// Simulasi hardcoded atau import dari file konfigurasi
const TELEGRAM_BOT_TOKEN = "7781366082:AAGcABsFljdIfO0kn8MPB6F1xhCYy-LAVnM";
const TELEGRAM_CHAT_ID = "1099301022";

exports.handler = async (event, context) => {
  // Periksa apakah ada query parameter 'path'
  const originalPath = event.queryStringParameters?.path || event.headers.referer || 'Unknown path';

  // Susun URL API Telegram
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=404+Error+Detected%0A%0APath:+${encodeURIComponent(originalPath)}%0AUser+Agent:+${encodeURIComponent(event.headers['user-agent'] || 'Unknown')}`;

  try {
    // Mengirimkan request GET langsung ke API Telegram
    const response = await axios.get(TELEGRAM_API_URL);

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
