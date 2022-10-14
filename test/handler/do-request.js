// @ts-check

import https from 'https';

export async function handler() {
  return new Promise((resolve, reject) => {
    https
      .get('https://example.com', (res) => {
        resolve(res.statusCode);
      })
      .on('error', reject);
  });
}
