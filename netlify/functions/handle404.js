const axios = require('axios');

const TELEGRAM_BOT_TOKEN = "7781366082:AAGcABsFljdIfO0kn8MPB6F1xhCYy-LAVnM";
const TELEGRAM_CHAT_ID = "1099301022";

exports.handler = async (event) => {
  const originalPath = event.queryStringParameters?.path;
  
  // 1. Jika tidak ada path parameter
  if (!originalPath) {
    return { statusCode: 404, body: 'Not Found' };
  }

  // 2. Buat URL untuk pengecekan
  const checkUrl = `https://${event.headers.host}/${originalPath}`;
  
  try {
    // 3. Lakukan pengecekan dengan HEAD request
    const response = await axios.head(checkUrl, {
      headers: { 'x-bypass-check': 'true' },
      timeout: 3000
    });
    
    // 4. Jika resource ada (status 200), return 404 tanpa notifikasi
    return { statusCode: 404, body: 'Not Found' };
    
  } catch (error) {
    // 5. Hanya proses jika error 404
    if (error.response?.status === 404) {
      const ip = event.headers['x-nf-client-ip'] || 'Unknown IP';
      const timestamp = new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta'
      });

      // 6. Format pesan telegram
      const message = `
⚠️ *404 ALERT* ⚠️
🕒 Waktu: ${timestamp}
🔗 Path: \`${originalPath}\`
🌐 IP: ${ip}
      `;

      // 7. Kirim notifikasi
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      });
    }
    
    // 8. Return response ke client
    return { statusCode: 404, body: 'Not Found' };
  }
};