const axios = require('axios');

const TELEGRAM_BOT_TOKEN = "7781366082:AAGcABsFljdIfO0kn8MPB6F1xhCYy-LAVnM";
const TELEGRAM_CHAT_ID = "1099301022";

exports.handler = async (event) => {
  try {
    // Debugging 1: Log semua event
    console.log('Raw event:', JSON.stringify(event));
    
    const originalPath = event.queryStringParameters?.path;
    console.log('Original path:', originalPath);

    // Debugging 2: Log headers
    console.log('Headers:', event.headers);

    if (!originalPath) {
      console.log('No path parameter');
      return { statusCode: 404, body: 'Not Found' };
    }

    // Bypass check
    const checkUrl = `https://${event.headers.host}/${originalPath}?nf_rid=bypass-check`;
    console.log('Checking URL:', checkUrl);

    try {
      const response = await axios.head(checkUrl, {
        headers: { 'x-nf-request-id': 'bypass-check' },
        timeout: 3000
      });
      console.log('HEAD response:', response.status);
      return { statusCode: 404, body: 'Not Found' };
    } catch (error) {
      console.log('HEAD error:', error.message);
      if (error.response?.status !== 404) {
        console.error('Unexpected error:', error);
        return { statusCode: 500, body: 'Server Error' };
      }
    }

    // Jika sampai sini, kirim notifikasi
    console.log('Mengirim notifikasi Telegram...');
    
    const ip = event.headers['x-nf-forwarded-for'] || event.headers['x-forwarded-for'] || 'Unknown IP';
    const timestamp = new Date().toISOString();

    const message = `
*⚠️ 404 Error Detected*
Path: \`${originalPath}\`
Waktu: ${timestamp}
IP: ${ip}
    `;

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });

    return { statusCode: 404, body: 'Not Found' };

  } catch (error) {
    console.error('Global error:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};