const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = 3000;

const urlMap = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.post('/shorten', (req, res) => {
  const originalUrl = req.body.originalUrl;
  const shortUrl = generateShortUrl();
  urlMap[shortUrl] = originalUrl;
  res.json({ shortUrl: `http://localhost:${PORT}/${shortUrl}` });
});

app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const originalUrl = urlMap[shortUrl];
  if (originalUrl) {
    res.redirect(301, originalUrl);
  } else {
    res.status(404).send('Not Found');
  }
});

function generateShortUrl() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortUrl = '';

  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortUrl += characters.charAt(randomIndex);
  }

  return shortUrl;
}

// const options = {
//   key: fs.readFileSync('path/to/private-key.pem'),
//   cert: fs.readFileSync('path/to/certificate.pem'),
// };

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
