// File: netlify/functions/handle404.js
const axios = require('axios');

// Ganti URL di bawah ini dengan URL webhook Discord kamu
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1360898630655152351/sLC0UFBL6bf3U3q7z9HAKqL8-ZU012-8E9vjY2jg7NSZCPcfXULgDO1hDk2yzguc82E8';

exports.handler = async (event, context) => {
  // Periksa jika path ini adalah 404
  if (event.path.includes('/.netlify/functions/handle404')) {
    // Dapatkan path asli dari query parameter atau header referer
    const originalPath = event.queryStringParameters?.path || event.headers.referer || 'Unknown path';
    
    // Data untuk Discord webhook
    const data = {
      embeds: [{
        title: "⚠️ 404 Error Detected",
        description: `Path yang tidak ditemukan: \`${originalPath}\``,
        color: 15548997, // Warna merah
        fields: [
          {
            name: "User Agent",
            value: event.headers['user-agent'] || 'Unknown',
            inline: true
          },
          {
            name: "Timestamp",
            value: new Date().toISOString(),
            inline: true
          }
        ],
        footer: {
          text: "Netlify 404 Monitoring"
        }
      }]
    };

    try {
      if (!DISCORD_WEBHOOK_URL) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Discord webhook URL tidak dikonfigurasi" })
        };
      }

      // Kirim notifikasi ke Discord
      await axios.post(DISCORD_WEBHOOK_URL, data);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Notifikasi 404 berhasil dikirim ke Discord" })
      };
    } catch (error) {
      console.error("Error mengirim webhook:", error);
      
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Gagal mengirim notifikasi ke Discord", error: error.message })
      };
    }
  }
  
  // Jika bukan panggilan langsung ke function
  return {
    statusCode: 404,
    body: JSON.stringify({ message: "Halaman tidak ditemukan" })
  };
};
