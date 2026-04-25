const fs = require('fs');
const https = require('https');
const zstd = require('fzstd');

https.get('https://database.lichess.org/lichess_db_puzzle.csv.zst', (res) => {
  let chunks = [];
  let downloaded = 0;
  res.on('data', (chunk) => {
    chunks.push(chunk);
    downloaded += chunk.length;
    // Get 300KB of compressed data
    if (downloaded > 300000) {
      res.destroy();
      console.log('Downloaded. Decompressing...');
      const compressed = Buffer.concat(chunks);
      try {
        const decompressed = zstd.decompress(compressed);
        const text = new TextDecoder().decode(decompressed);
        fs.writeFileSync('sample_puzzles.csv', text.substring(0, 500000));
        console.log('Success!');
      } catch (e) {
        console.error('Decompression error:', e.message);
      }
    }
  });
}).on('error', (e) => {
  console.error(e);
});
