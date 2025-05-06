import dotenv from 'dotenv';
dotenv.config();

const config = {
  midtrans: {
    clientId: process.env.MIDTRANS_CLIENT_ID,
    clientSecret: process.env.MIDTRANS_CLIENT_SECRET,
    partnerId: process.env.MIDTRANS_PARTNER_ID,
    merchantId: process.env.MIDTRANS_MERCHANT_ID,
    apiBaseUrl: process.env.MIDTRANS_API_BASE_URL || 'https://merchants.sandbox.midtrans.com',
    accessTokenUrl: '/v1.0/access-token/b2b',
    qrGenerateUrl: '/v1.0/qr/qr-mpm-generate',
    qrStatusUrl: '/v1.0/qr/qr-mpm-status',
    channelId: process.env.MIDTRANS_CHANNEL_ID || '12345',
  },
  server: {
    port: process.env.PORT || 5000,
  },
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017/posapp',
  },
};

export default config;
