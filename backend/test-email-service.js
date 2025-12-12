require('dotenv').config();
const { sendEmail } = require('./src/services/emailService');

async function runTest() {
    console.log('Attempting to send test email to smartseyali@gmail.com...');
    try {
        const result = await sendEmail(
            'smartseyali@gmail.com',
            'Test Email from Patti Kadai System',
            '<div style="padding: 20px; font-family: sans-serif;"><h2>Test Successful</h2><p>Your email service configuration is working correctly.</p><p>Sent at: ' + new Date().toISOString() + '</p></div>'
        );
        
        if (result) {
            console.log('✅ Test email request completed successfully.');
            console.log('Response:', JSON.stringify(result, null, 2));
        } else {
            console.log('❌ Test email request returned null (failed).');
        }
    } catch (error) {
        console.error('❌ Exception during test:', error);
    }
}

runTest();
