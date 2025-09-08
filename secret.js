const crypto = require('crypto');

const jwtSecret = crypto.randomBytes(64).toString('hex'); // 64 bytes => 128 chars
console.log(jwtSecret);
