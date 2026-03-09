const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDGRID_FROM_EMAIL || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-password'
  }
});

const sendInvoiceEmail = async (recipientEmail, invoice, pdfPath) => {
  try {
    const attachmentPath = path.join(__dirname, `..${pdfPath}`);

    const mailOptions = {
      from: process.env.SENDGRID_FROM_EMAIL,
      to: recipientEmail,
      subject: `Invoice ${invoice.invoiceNumber} - Orlando Villa Rental`,
      html: `
        <h2>Invoice Notification</h2>
        <p>Your invoice for the villa rental has been generated and attached.</p>
        <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Amount Due:</strong> $${invoice.total.toFixed(2)}</p>
        <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p>Please see the attached PDF for complete details.</p>
        <br />
        <p>Best regards,<br />Orlando Villa Rental Team</p>
      `,
      attachments: [
        {
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          path: attachmentPath
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log('Invoice email sent successfully');
  } catch (err) {
    console.error('Error sending invoice email:', err);
  }
};

const sendContractEmail = async (recipientEmail, contract, pdfPath) => {
  try {
    const attachmentPath = path.join(__dirname, `..${pdfPath}`);

    const mailOptions = {
      from: process.env.SENDGRID_FROM_EMAIL,
      to: recipientEmail,
      subject: `Rental Agreement ${contract.contractNumber} - Orlando Villa Rental`,
      html: `
        <h2>Rental Agreement for Signing</h2>
        <p>Your rental agreement is ready for signing. Please review the attached contract.</p>
        <p><strong>Contract Number:</strong> ${contract.contractNumber}</p>
        <p><strong>Expiry Date:</strong> ${new Date(contract.expiryDate).toLocaleDateString()}</p>
        <p>To sign the contract digitally, please visit: ${contract.signatureLink}</p>
        <p>Please sign before the expiry date to confirm your booking.</p>
        <br />
        <p>Best regards,<br />Orlando Villa Rental Team</p>
      `,
      attachments: [
        {
          filename: `contract-${contract.contractNumber}.pdf`,
          path: attachmentPath
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log('Contract email sent successfully');
  } catch (err) {
    console.error('Error sending contract email:', err);
  }
};

const sendConfirmationEmail = async (email, bookingDetails) => {
  try {
    const mailOptions = {
      from: process.env.SENDGRID_FROM_EMAIL,
      to: email,
      subject: 'Booking Confirmed - Orlando Villa Rental',
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Your booking has been confirmed.</p>
        <p><strong>Property:</strong> ${bookingDetails.propertyTitle}</p>
        <p><strong>Check-in:</strong> ${bookingDetails.checkIn}</p>
        <p><strong>Check-out:</strong> ${bookingDetails.checkOut}</p>
        <p><strong>Total Price:</strong> $${bookingDetails.totalPrice}</p>
        <p>Thank you for choosing Orlando Villa Rental!</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending confirmation email:', err);
  }
};

module.exports = { sendInvoiceEmail, sendContractEmail, sendConfirmationEmail };
