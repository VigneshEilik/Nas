/**
 * Mock Email Service for Nas Academy Upgrade.
 * In production, replace the console.log with a real provider like Nodemailer, Postmark, or SendGrid.
 */
const sendEnrollmentEmail = async (userEmail, courseTitle) => {
  console.log(`
    --------------------------------------------------
    📧 EMAIL SENT TO: ${userEmail}
    SUBJECT: Welcome to ${courseTitle}!
    MESSAGE: You have successfully enrolled in the ecosystem. 
    Get ready to scale your skills.
    --------------------------------------------------
  `);
};

module.exports = { sendEnrollmentEmail };
