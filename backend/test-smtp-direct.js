require('dotenv').config();
const nodemailer = require('nodemailer');

async function testDirectSMTP() {
    console.log('Testing direct SMTP connection with credentials...');
    
    // Config from .env or fallback
    const config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'pattikadaisuport@gmail.com',
            pass: process.env.EMAIL_PASS || 'apgk nkpx dxgw gphl'
        }
    };
    
    console.log(`Using User: ${config.auth.user}`);
    // Masking password for log
    console.log(`Using Pass: ${config.auth.pass.substring(0, 4)}...`);

    const transporter = nodemailer.createTransport(config);

    try {
        // Verify connection config
        await transporter.verify();
        console.log('✅ SMTP Connection verified successfully');

        // Send mail
        const info = await transporter.sendMail({
            from: '"Patti Kadai Test" <' + config.auth.user + '>',
            to: 'smartseyali@gmail.com',
            subject: 'Direct SMTP Test - Patti Kadai',
            html: '<h3>Direct SMTP Test</h3><p>This email confirms that your Gmail App Password credentials are correct.</p>'
        });

        console.log('✅ Email sent: %s', info.messageId);
    } catch (error) {
        console.error('❌ SMTP Error:', error);
    }
}

testDirectSMTP();
