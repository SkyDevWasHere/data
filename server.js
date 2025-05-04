
import express from 'express';
import chalk from 'chalk';
import axios from 'axios'; 
const app = express();

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL';

app.use((req, res, next) => {
  const { method, url } = req;
  const statusCode = res.statusCode;

  if (statusCode >= 200 && statusCode < 300) {
    console.log(chalk.green(`[INFO] ${method} ${url} (${statusCode})`));
  } else if (statusCode === 404) {
    console.log(chalk.red(`[WARN] ${method} ${url} (${statusCode})`));

    axios.post(DISCORD_WEBHOOK_URL, {
      content: `404 Not Found: ${method} ${url}`
    }).catch(err => {
      console.error('Error sending to Discord:', err);
    });
  } else {
    console.log(`[INFO] ${method} ${url} (${statusCode})`);
  }

  next();
});

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.get('/notfound', (req, res) => {
  res.status(404).send('Not Found');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
