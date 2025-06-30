const emailjs = require('@emailjs/nodejs');

// Configure EmailJS
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

class EmailService {
  /**
   * Send email notification to employee
   * @param {string} toEmail - Employee's email address
   * @param {string} employeeName - Employee's full name
   * @param {string} message - Notification message
   * @param {string} subject - Email subject
   * @returns {Promise<Object>} - Email sending result
   */
  static async sendNotification(toEmail, employeeName, message, subject = 'OPT Document Reminder') {
    try {
      console.log('EmailService: Starting email send process...');
      console.log('EmailService: Environment variables check:');
      console.log('- EMAILJS_SERVICE_ID:', EMAILJS_SERVICE_ID ? 'Set' : 'Missing');
      console.log('- EMAILJS_TEMPLATE_ID:', EMAILJS_TEMPLATE_ID ? 'Set' : 'Missing');
      console.log('- EMAILJS_PUBLIC_KEY:', EMAILJS_PUBLIC_KEY ? 'Set' : 'Missing');
      console.log('- EMAILJS_PRIVATE_KEY:', EMAILJS_PRIVATE_KEY ? 'Set' : 'Missing');

      // Validate required environment variables
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
        const missingVars = [];
        if (!EMAILJS_SERVICE_ID) missingVars.push('EMAILJS_SERVICE_ID');
        if (!EMAILJS_TEMPLATE_ID) missingVars.push('EMAILJS_TEMPLATE_ID');
        if (!EMAILJS_PUBLIC_KEY) missingVars.push('EMAILJS_PUBLIC_KEY');
        if (!EMAILJS_PRIVATE_KEY) missingVars.push('EMAILJS_PRIVATE_KEY');
        
        throw new Error(`EmailJS configuration is missing. Missing variables: ${missingVars.join(', ')}`);
      }

      console.log('EmailService: Preparing email parameters...');
      // Prepare email parameters for EmailJS
      const templateParams = {
        to_email: toEmail,
        to_name: employeeName,
        message: message,
        subject: subject,
        from_name: 'HR Team',
        company_name: 'BeaconFire Inc.'
      };

      console.log('EmailService: Sending email via EmailJS...');
      console.log('EmailService: Service ID:', EMAILJS_SERVICE_ID);
      console.log('EmailService: Template ID:', EMAILJS_TEMPLATE_ID);
      console.log('EmailService: To email:', toEmail);
      console.log('EmailService: Subject:', subject);

      // Send email using EmailJS with template
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        {
          publicKey: EMAILJS_PUBLIC_KEY,
          privateKey: EMAILJS_PRIVATE_KEY,
        }
      );

      console.log('EmailService: Email sent successfully:', result);
      return {
        success: true,
        messageId: result.text,
        email: toEmail
      };

    } catch (error) {
      console.error('EmailService: Failed to send email - Full error:', error);
      console.error('EmailService: Error message:', error.message);
      console.error('EmailService: Error stack:', error.stack);
      
      // Check if it's an EmailJS specific error
      if (error.response) {
        console.error('EmailService: EmailJS response error:', error.response);
      }
      
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  /**
   * Send OPT document reminder email
   * @param {string} toEmail - Employee's email address
   * @param {string} employeeName - Employee's full name
   * @param {string} nextStep - Next step message
   * @param {number} daysRemaining - Days remaining on visa
   * @returns {Promise<Object>} - Email sending result
   */
  static async sendOptReminder(toEmail, employeeName, nextStep, daysRemaining) {
    const subject = 'OPT Document Reminder - Action Required';
    
    // Create a formatted message
    const urgencyMessage = daysRemaining <= 30 ? 
      `⚠️ URGENT: Your OPT authorization expires in ${daysRemaining} days!` : 
      `Your OPT authorization expires in ${daysRemaining} days.`;
    
    const message = `
Dear ${employeeName},

This is a reminder regarding your OPT documentation process.

📋 Next Step Required:
${nextStep}

${urgencyMessage}

🚀 Action Required:
Please log into your employee portal and complete the required documentation as soon as possible.

Important: Completing this step is crucial for maintaining your OPT status and work authorization.

If you have any questions or need assistance, please contact the HR team.

Best regards,
HR Team
BeaconFire Inc.
    `.trim();

    return this.sendNotification(toEmail, employeeName, message, subject);
  }
}

module.exports = EmailService;