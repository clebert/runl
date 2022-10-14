// @ts-check

import https from 'https';

export function handler(_event, _context, callback) {
  https
    .get('https://docs.aws.amazon.com/lambda/latest/dg/welcome.html', (res) => {
      callback(null, res.statusCode);
    })
    .on('error', callback);
}
