const axios = require('axios');
const crypto = require('crypto');

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_API_ACCESS_TOKEN;

const hash = (str) => {
    if (!str) return null;
    return crypto.createHash('sha256').update(str).digest('hex');
};

const sendPurchaseEvent = async (order, req) => {
    // If credentials are not set, just warn and return
    if (!PIXEL_ID || !ACCESS_TOKEN) {
        // Can be noisy, maybe check config first or silent fail
        // console.warn("Meta CAPI: Missing PIXEL_ID or META_API_ACCESS_TOKEN");
        return;
    }

    try {
        const userData = {
            client_ip_address: req.ip || req.connection.remoteAddress,
            client_user_agent: req.headers['user-agent'],
        };
        
        if (order.email) userData.em = hash(order.email.toLowerCase().trim());
        if (order.shipping_phone || order.phone_number || order.user_phone) {
            // simple normalization
            const phone = (order.shipping_phone || order.phone_number || order.user_phone).replace(/[^0-9]/g, '');
            if (phone) userData.ph = hash(phone);
        }
        if (order.first_name || order.shipping_first_name || order.user_first_name) {
             userData.fn = hash((order.first_name || order.shipping_first_name || order.user_first_name).toLowerCase().trim());
        }
        if (order.last_name || order.shipping_last_name || order.user_last_name) {
             userData.ln = hash((order.last_name || order.shipping_last_name || order.user_last_name).toLowerCase().trim());
        }

        const eventData = {
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            event_id: order.id, // Must match frontend eventID
            user_data: userData,
            custom_data: {
                currency: 'INR',
                value: parseFloat(order.total_price),
                content_type: 'product',
            }
        };
        
        // If order items are available
        if (order.items && Array.isArray(order.items)) {
             eventData.custom_data.content_ids = order.items.map(i => i.product_id || i.id);
             eventData.custom_data.num_items = order.items.reduce((acc, i) => acc + (parseInt(i.quantity) || 1), 0);
        }

        const response = await axios.post(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events`, {
            data: [eventData],
            access_token: ACCESS_TOKEN
        });
        
        console.log("Meta CAPI Purchase Sent:", response.data);
    } catch (error) {
        console.error("Meta CAPI Error:", error.response ? error.response.data : error.message);
    }
};

module.exports = { sendPurchaseEvent };
