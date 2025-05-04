export async function handler(event, context) {
    const webhookUrl = "https://discord.com/api/webhooks/1360898630655152351/sLC0UFBL6bf3U3q7z9HAKqL8-ZU012-8E9vjY2jg7NSZCPcfXULgDO1hDk2yzguc82E8";
  
    try {
      const requestPath = event.path;
  
      // Cetak log ke Netlify
      console.log("Request path:", requestPath);
  
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: `❌ 404 Error: Pengguna mengakses path "${requestPath}"`
        })
      });
  
      console.log("Webhook berhasil dikirim");
  
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "Laporan 404 terkirim", path: requestPath })
      };
    } catch (error) {
      console.error("Gagal mengirim webhook:", error);
  
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Gagal mengirim laporan 404" })
      };
    }
  }
  