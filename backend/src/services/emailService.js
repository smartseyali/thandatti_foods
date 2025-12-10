const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'pattikadaiofficial@gmail.com',
    pass: process.env.EMAIL_PASS || 'pattikadaiofficial@2025',
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    if (!to) {
        console.warn("Email service: No recipient defined");
        return;
    }
    
    // Check if email configuration is present
    // Credentials are now hardcoded as fallback, so this check is always true unless hardcoded ones fail

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Patti Kadai" <pattikadaiofficial@gmail.com>',
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

const sendWelcomeEmail = async (user) => {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #F97316;">Welcome to Patti Kadai!</h1>
            </div>
            <p>Dear <strong>${user.firstName} ${user.lastName}</strong>,</p>
            <p>Thank you for creating an account with Patti Kadai. We are thrilled to have you as part of our community!</p>
            <p>At Patti Kadai, we bring you the finest traditional foods and products.</p>
            
            <div style="margin: 30px 0; text-align: center;">
                <a href="https://pattikadai.com" style="background-color: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Shopping</a>
            </div>

            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br>The Patti Kadai Team</p>
        </div>
    `;
    await sendEmail(user.email, 'Welcome to Patti Kadai!', html);
};

const sendOrderConfirmation = async (order, email) => {
    // If order.items is not populated, we might want to fetch or just show basics
    const items = order.items || [];
    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName || item.title || 'Product'}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${parseFloat(item.unit_price || item.unitPrice || item.price || 0).toFixed(2)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${parseFloat(item.total_price || item.totalPrice || ((item.price || 0) * item.quantity)).toFixed(2)}</td>
        </tr>
    `).join('');

    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #F97316; padding-bottom: 10px;">Order Confirmation</h2>
            <p>Thank you for your order!</p>
            <div style="background-color: #f8f8f8; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
                <p><strong>Order Number:</strong> #${order.order_number || order.orderNumber || order.id}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ₹${parseFloat(order.total_price || order.totalPrice || order.amount || 0).toFixed(2)}</p>
                <p><strong>Status:</strong> ${order.status || 'Pending'}</p>
            </div>
            
            <h3>Order Details</h3>
            <table border="0" style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th style="padding: 10px; text-align: left;">Product</th>
                        <th style="padding: 10px; text-align: left;">Qty</th>
                        <th style="padding: 10px; text-align: left;">Price</th>
                        <th style="padding: 10px; text-align: left;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <p style="margin-top: 20px;">We will notify you when your order is shipped.</p>
            <p>Thank you,<br>Patti Kadai Team</p>
        </div>
    `;
    
    await sendEmail(email, `Order Confirmation #${order.order_number || order.orderNumber || order.id}`, html);
};

const sendOrderStatusUpdate = async (order, email) => {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #333;">Order Status Update</h2>
            <p>Your order <strong>#${order.order_number || order.orderNumber}</strong> status has been updated.</p>
            <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0;">
                <p style="font-size: 18px;">New Status: <strong style="color: #F97316; text-transform: capitalize;">${order.status}</strong></p>
            </div>
            <p>Thank you for shopping with us!</p>
            <p>Thank you,<br>Patti Kadai Team</p>
        </div>
    `;
    await sendEmail(email, `Order Status Update #${order.order_number || order.orderNumber}`, html);
};

const sendPaymentReceipt = async (order, user) => {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
                <h1 style="color: #28a745; margin: 0;">Payment Successful</h1>
                <p style="color: #666; margin-top: 5px;">Transaction Reference: ${order.transaction_id || 'N/A'}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <p>Dear <strong>${user.firstName || 'Customer'}</strong>,</p>
                <p>We have successfully received your payment for Order <strong>#${order.order_number || order.orderNumber}</strong>.</p>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                <table style="width: 100%;">
                    <tr>
                        <td style="color: #666;">Amount Paid:</td>
                        <td style="font-weight: bold; text-align: right;">₹${parseFloat(order.total_price || order.amount).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="color: #666;">Date:</td>
                        <td style="font-weight: bold; text-align: right;">${new Date().toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td style="color: #666;">Payment Method:</td>
                        <td style="font-weight: bold; text-align: right;">${order.payment_method || 'Online'}</td>
                    </tr>
                </table>
            </div>

            <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
                <p>This is an automated receipt.</p>
                <p>Patti Kadai</p>
            </div>
        </div>
    `;
    await sendEmail(user.email, `Payment Receipt - Order #${order.order_number || order.orderNumber}`, html);
};

module.exports = {
    sendOrderConfirmation,
    sendOrderStatusUpdate,
    sendWelcomeEmail,
    sendPaymentReceipt,
    sendEmail
};
