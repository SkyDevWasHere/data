// File: netlify/functions/handle404.js
const axios = require('axios');

// Simulasi hardcoded atau import dari file konfigurasi
const TELEGRAM_BOT_TOKEN = "7781366082:AAGcABsFljdIfO0kn8MPB6F1xhCYy-LAVnM";
const TELEGRAM_CHAT_ID = "1099301022";

exports.handler = async (event, context) => {
  // Periksa jika ini request untuk function itu sendiri (menghindari loop)
  if (event.path.includes('/.netlify/functions/handle404')) {
    const originalPath = event.queryStringParameters?.path || event.headers.referer || 'Unknown path';

    // Validasi token dan chat ID
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Telegram token atau chat ID tidak dikonfigurasi" })
      };
    }

    // Susun pesan Telegram
    const message = `⚠️ *404 Error Detected*\n\n` +
      `*Path:* \`${originalPath}\`\n` +
      `*User Agent:* ${event.headers['user-agent'] || 'Unknown'}\n` +
      `*Timestamp:* ${new Date().toISOString()}\n` +
      `*Source:* Netlify 404 Monitoring`;

    const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
      await axios.post(TELEGRAM_API, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Notifikasi 404 berhasil dikirim ke Telegram" })
      };
    } catch (error) {
      console.error("Error mengirim pesan ke Telegram:", error);

      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Gagal mengirim notifikasi ke Telegram", error: error.message })
      };
    }
  }

  // Jika bukan request function ini
  return {
    statusCode: 404,
    body: JSON.stringify({ message: "Halaman tidak ditemukan" })
  };
};
