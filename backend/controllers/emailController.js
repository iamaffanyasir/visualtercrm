const { sendEmail } = require('../services/emailService');

exports.sendTestEmail = async (req, res) => {
  try {
    const testEmailData = {
      to: 'visualter4dev@gmail.com', // Your email address
      subject: 'Test Email from Law Firm CRM',
      text: 'This is a test email from your CRM system.',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from your Law Firm CRM system.</p>
        <p>If you receive this, your email configuration is working correctly!</p>
      `
    };

    await sendEmail(testEmailData);
    res.json({ message: 'Test email sent successfully!' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: error.message });
  }
}; 