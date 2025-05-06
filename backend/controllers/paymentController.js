import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import Order from '../models/Order.js';
import config from '../config/config.js';

const midtransConfig = config.midtrans;

// Helper to get current ISO timestamp
function getTimestamp() {
  return new Date().toISOString();
}

// Helper to generate HMAC SHA512 signature for Midtrans
function generateSignature(payload, serverKey) {
  return crypto.createHmac('sha512', serverKey).update(payload).digest('hex');
}

// Process cash payment
export const processCashPayment = async (req, res) => {
  try {
    const { orderId, cashReceived } = req.body;
    if (!orderId || cashReceived === undefined) {
      return res.status(400).json({ success: false, message: 'orderId and cashReceived are required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (cashReceived < order.total) {
      return res.status(400).json({ success: false, message: 'Insufficient cash received' });
    }

    const change = cashReceived - order.total;

    order.paymentMethod = 'cash';
    order.paymentStatus = 'paid';
    order.paymentDetails = {
      transactionTime: new Date(),
      cashReceived,
      change,
    };

    await order.save();

    return res.status(200).json({ success: true, message: 'Payment successful', change, order });
  } catch (error) {
    console.error('processCashPayment error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Generate QRIS payment via Midtrans
export const generateQRISPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Prepare Midtrans API request
    const url = `${midtransConfig.apiBaseUrl}${midtransConfig.qrGenerateUrl}`;
    const timestamp = getTimestamp();
    const externalId = uuidv4();

    // Request body per Midtrans docs
    const requestBody = {
      partnerReferenceNo: externalId,
      amount: {
        value: order.total.toFixed(2),
        currency: 'IDR',
      },
      merchantId: midtransConfig.merchantId,
      validityPeriod: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
      additionalInfo: {
        acquirer: 'gopay',
        items: order.items.map(item => ({
          id: item._id.toString(),
          price: {
            value: item.price.toFixed(2),
            currency: 'IDR',
          },
          quantity: item.quantity,
          name: item.name,
          brand: item.brand || '',
          category: item.category || '',
          merchantName: '',
        })),
        customerDetails: {
          email: order.customerEmail || '',
          firstName: order.customerFirstName || '',
          lastName: order.customerLastName || '',
          phone: order.customerPhone || '',
        },
        countryCode: 'ID',
        locale: 'id_ID',
      },
    };

    // Generate signature
    const payloadString = JSON.stringify(requestBody);
    const signature = generateSignature(payloadString, midtransConfig.clientSecret);

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'X-TIMESTAMP': timestamp,
      'X-SIGNATURE': signature,
      'Authorization': `Bearer ${midtransConfig.clientSecret}`,
      'X-PARTNER-ID': midtransConfig.partnerId,
      'X-EXTERNAL-ID': externalId,
      'CHANNEL-ID': midtransConfig.channelId,
    };

    // Call Midtrans API
    const response = await axios.post(url, requestBody, { headers });

    if (response.data && response.data.responseCode === '2004700') {
      // Save payment details to order
      order.paymentMethod = 'qris';
      order.paymentStatus = 'pending';
      order.paymentDetails = {
        midtransReference: response.data.referenceNo,
        qrContent: response.data.qrContent,
        qrUrl: response.data.qrUrl,
        qrImage: response.data.qrImage,
        transactionTime: new Date(),
      };
      await order.save();

      return res.status(200).json({ success: true, data: response.data });
    } else {
      return res.status(400).json({ success: false, message: 'Failed to generate QRIS payment', data: response.data });
    }
  } catch (error) {
    console.error('generateQRISPayment error:', error.response ? error.response.data : error.message);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Check QRIS payment status
export const checkQRISPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.query;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const order = await Order.findById(orderId);
    if (!order || !order.paymentDetails || !order.paymentDetails.midtransReference) {
      return res.status(404).json({ success: false, message: 'Order or payment reference not found' });
    }

    const url = `${midtransConfig.apiBaseUrl}${midtransConfig.qrStatusUrl}`;
    const timestamp = getTimestamp();
    const externalId = uuidv4();

    const requestBody = {
      partnerReferenceNo: order.paymentDetails.midtransReference,
      pageSize: 1,
      pageNumber: 0,
    };

    const payloadString = JSON.stringify(requestBody);
    const signature = generateSignature(payloadString, midtransConfig.clientSecret);

    const headers = {
      'Content-Type': 'application/json',
      'X-TIMESTAMP': timestamp,
      'X-SIGNATURE': signature,
      'Authorization': `Bearer ${midtransConfig.clientSecret}`,
      'X-PARTNER-ID': midtransConfig.partnerId,
      'X-EXTERNAL-ID': externalId,
      'CHANNEL-ID': midtransConfig.channelId,
    };

    const response = await axios.post(url, requestBody, { headers });

    if (response.data && response.data.responseCode === '2001200' && response.data.detailData && response.data.detailData.length > 0) {
      const paymentStatus = response.data.detailData[0].status || 'pending';
      // Update order payment status accordingly
      order.paymentStatus = paymentStatus.toLowerCase();
      await order.save();

      return res.status(200).json({ success: true, paymentStatus });
    } else {
      return res.status(400).json({ success: false, message: 'Failed to get payment status', data: response.data });
    }
  } catch (error) {
    console.error('checkQRISPaymentStatus error:', error.response ? error.response.data : error.message);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Optional: Show receipt
export const showReceipt = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('showReceipt error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
