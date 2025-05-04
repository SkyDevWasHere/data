const axios = require('axios');

const TELEGRAM_BOT_TOKEN = "7781366082:AAGcABsFljdIfO0kn8MPB6F1xhCYy-LAVnM";
const TELEGRAM_CHAT_ID = "1099301022";

exports.handler = async (event, context) => {
  const originalPath = event.queryStringParameters?.path;

  // Jika tidak ada path, langsung return 404
  if (!originalPath) {
    return { statusCode: 404, body: 'Not Found' };
  }

  // Dapatkan host dari header request
  const host = event.headers.host;
  const checkUrl = `https://${host}/${originalPath}?bypass=true`;

  try {
    // Cek apakah file benar-benar tidak ada dengan HEAD request
    const response = await axios.head(checkUrl, { timeout: 5000 });
    
    // Jika file ada (status 200), redirect ke path tersebut
    if (response.status === 200) {
      return {
        statusCode: 302,
        headers: { Location: `/${originalPath}` },
        body: ''
      };
    }
  } catch (error) {
    // Hanya proses jika error 404, selain itu return error
    if (!(error.response && error.response.status === 404)) {
      console.error('Error:', error.message);
      return { statusCode: 500, body: 'Internal Server Error' };
    }
  }

  // Proses mengirim notifikasi Telegram
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

  // Return response 404 ke client
  return {
    statusCode: 404,
    body: JSON.stringify({ message: "Halaman tidak ditemukan" })
  };
};