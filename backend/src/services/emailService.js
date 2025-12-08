const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g. 'gmail'
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    if (!to) {
        console.warn("Email service: No recipient defined");
        return;
    }
    
    // Check if email configuration is present
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Email service: Credentials missing. Skipping email.");
        return;
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Thandatti Foods" <noreply@thandattifoods.com>',
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Log error but don't break the application flow
    return null;
  }
};

const sendOrderConfirmation = async (order, email) => {
    // If order.items is not populated, we might want to fetch or just show basics
    const items = order.items || [];
    const itemsHtml = items.map(item => `
        <tr>
            <td>${item.productName || item.product_id}</td>
            <td>${item.quantity}</td>
            <td>₹${item.unitPrice || item.unit_price}</td>
            <td>₹${item.totalPrice || item.total_price}</td>
        </tr>
    `).join('');

    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #333;">Order Confirmation</h2>
            <p>Thank you for your order!</p>
            <div style="background-color: #f8f8f8; padding: 15px; margin-bottom: 20px;">
                <p><strong>Order Number:</strong> ${order.order_number || order.orderNumber}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ₹${order.total_price || order.totalPrice}</p>
                <p><strong>Payment Method:</strong> ${order.payment_method || order.paymentMethod}</p>
            </div>
            
            <h3>Order Details</h3>
            <table border="1" style="border-collapse: collapse; width: 100%; border-color: #eee;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th style="padding: 10px; text-align: left;">Product</th>
                        <th style="padding: 10px; text-align: left;">Quantity</th>
                        <th style="padding: 10px; text-align: left;">Price</th>
                        <th style="padding: 10px; text-align: left;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <p style="margin-top: 20px;">We will notify you when your order is shipped.</p>
            <p>Thank you,<br>Thandatti Foods Team</p>
        </div>
    `;
    
    await sendEmail(email, `Order Confirmation #${order.order_number || order.orderNumber}`, html);
};

const sendOrderStatusUpdate = async (order, email) => {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #333;">Order Status Update</h2>
            <p>Your order <strong>#${order.order_number || order.orderNumber}</strong> status has been updated.</p>
            <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0;">
                <p style="font-size: 18px;">New Status: <strong style="color: #007bff; text-transform: capitalize;">${order.status}</strong></p>
            </div>
            <p>Thank you for shopping with us!</p>
            <p>Thank you,<br>Thandatti Foods Team</p>
        </div>
    `;
    await sendEmail(email, `Order Status Update #${order.order_number || order.orderNumber}`, html);
};

module.exports = {
    sendOrderConfirmation,
    sendOrderStatusUpdate,
    sendEmail
};
