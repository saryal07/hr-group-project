# EmailJS Setup Guide

This guide explains how to set up EmailJS for sending email notifications in the HR system.

## Prerequisites

1. Create an EmailJS account at [https://www.emailjs.com/](https://www.emailjs.com/)
2. Set up an email service (Gmail, Outlook, etc.)
3. Create an email template

## Installation

Install the EmailJS Node.js package:

```bash
npm install @emailjs/nodejs
```

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# EmailJS Configuration
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
```

## Getting EmailJS Credentials

1. **Service ID**: Go to EmailJS dashboard → Email Services → Copy the Service ID
2. **Template ID**: Go to EmailJS dashboard → Email Templates → Copy the Template ID
3. **Public Key**: Go to EmailJS dashboard → Account → API Keys → Copy the Public Key
4. **Private Key**: Go to EmailJS dashboard → Account → API Keys → Copy the Private Key

## Email Service Setup

1. **Create Email Service**:
   - Go to EmailJS dashboard → Email Services
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the setup instructions for your provider
   - Copy the Service ID

2. **Create Email Template** (Required):
   - Go to EmailJS dashboard → Email Templates
   - Click "Create New Template"
   - Use this template content:

```
To: {{to_email}}
Subject: {{subject}}

Dear {{to_name}},

{{message}}

Best regards,
{{from_name}}
{{company_name}}
```

   - Save the template and copy the Template ID

## Template Variables

The EmailJS template uses these variables:
- `{{to_email}}` - Employee's email address
- `{{to_name}}` - Employee's full name
- `{{message}}` - The notification message
- `{{subject}}` - Email subject
- `{{from_name}}` - Sender name (HR Team)
- `{{company_name}}` - Company name (BeaconFire Inc.)

## Testing

To test the email functionality:

1. Set up your environment variables
2. Start the server
3. Use the "Send Notification" button in the Angular visa status management page
4. Check the console logs for email sending status

## Example Email Output

The emails will look professional with:
- Company header with logo styling
- Personalized greeting
- Highlighted next step requirements
- Urgency indicators (if OPT expires soon)
- Clear action items
- Professional footer

## Troubleshooting

- **"API calls are disabled for non-browser applications"**: This means you need to create a template in EmailJS dashboard
- **"EmailJS configuration is missing"**: Check that all environment variables are set correctly
- **"Email sending failed"**: Verify your EmailJS credentials and template ID
- **Emails not received**: Check spam folder and verify email service configuration

## Security Notes

- Keep your EmailJS private key secure
- Never commit `.env` files to version control
- Use environment variables for all sensitive configuration

## Important Note

EmailJS requires a template to be created in their dashboard for server-side usage. The "API calls are disabled for non-browser applications" error occurs when trying to send emails without a template.

## Benefits of Built-in Template

✅ **No manual template setup required**  
✅ **Consistent branding across all emails**  
✅ **Professional styling included**  
✅ **Easy to customize in code**  
✅ **Responsive design for all devices** 