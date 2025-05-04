const axios = require('axios');

const TELEGRAM_BOT_TOKEN = "7781366082:AAGcABsFljdIfO0kn8MPB6F1xhCYy-LAVnM";
const TELEGRAM_CHAT_ID = "1099301022";

exports.handler = async (event, context) => {
  const originalPath = event.queryStringParameters.path;
  
  // 1. Cek header untuk menghindari loop
  if (event.headers['x-nf-request-id'] === 'bypass-check') {
    return { statusCode: 404, body: 'Not Found' };
  }

  // 2. Buat URL pengecekan dengan signature khusus
  const checkUrl = `https://${event.headers.host}/${originalPath}?nf_rid=bypass-check`;

  // 3. Lakukan pengecekan dengan header khusus
  try {
    await axios.head(checkUrl, {
      headers: { 'x-nf-request-id': 'bypass-check' },
      timeout: 3000
    });
    return { statusCode: 404, body: 'Not Found' };
  } catch (error) {
    if (error.response?.status !== 404) {
      return { statusCode: 500, body: 'Server Error' };
    }
  }

  const ip = event.headers['x-forwarded-for'] || event.headers['remote-addr'] || 'Unknown IP';
  const timestamp = new Date().toISOString();

  const message = `
*⚠️ 404 Error Detected*

*Path:* \`${originalPath}\`
*Timestamp:* ${timestamp}
*IP Address:* ${ip}

\`Error Type:\` 404 Not Found
  `;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error("Gagal mengirim ke Telegram:", error.message);
  }

  return { statusCode: 404, body: 'Not Found' };
};