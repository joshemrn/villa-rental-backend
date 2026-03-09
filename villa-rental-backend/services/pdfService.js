const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoicePDF = async (invoice, booking) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `invoice-${invoice.invoiceNumber}.pdf`;
      const filePath = path.join(__dirname, '../pdfs', fileName);

      // Ensure pdfs directory exists
      if (!fs.existsSync(path.join(__dirname, '../pdfs'))) {
        fs.mkdirSync(path.join(__dirname, '../pdfs'), { recursive: true });
      }

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('INVOICE', { align: 'center' });
      doc.fontSize(12).text(invoice.invoiceNumber, { align: 'center' });
      doc.moveDown();

      // Company info
      doc.fontSize(10).text('Orlando Villa Rental', { bold: true });
      doc.text('Email: support@villarental.com');
      doc.text('Phone: (407) 555-1234');
      doc.moveDown();

      // Invoice details
      doc.text(`Invoice Date: ${new Date(invoice.issuedDate).toLocaleDateString()}`);
      doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);
      doc.moveDown();

      // Guest info
      doc.text('Bill To:', { bold: true });
      doc.text(`${booking.guestId.firstName} ${booking.guestId.lastName}`);
      doc.text(booking.guestId.email);
      doc.moveDown();

      // Property info
      doc.text('Property:', { bold: true });
      doc.text(booking.propertyId.title);
      doc.text(`Check-in: ${new Date(booking.checkInDate).toLocaleDateString()}`);
      doc.text(`Check-out: ${new Date(booking.checkOutDate).toLocaleDateString()}`);
      doc.moveDown();

      // Items table
      doc.text('Items', { bold: true, underline: true });
      doc.moveDown(0.5);

      invoice.items.forEach(item => {
        doc.text(`${item.description}`);
        doc.text(`Qty: ${item.quantity} × $${item.unitPrice.toFixed(2)} = $${item.total.toFixed(2)}`);
        doc.moveDown(0.3);
      });

      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Totals
      doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`);
      doc.text(`Service Fee: $${invoice.serviceFee.toFixed(2)}`);
      doc.text(`Taxes: $${invoice.taxes.toFixed(2)}`);
      doc.fontSize(12).text(`Total: $${invoice.total.toFixed(2)}`, { bold: true });

      doc.end();

      stream.on('finish', () => {
        resolve(`/pdfs/${fileName}`);
      });

      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};

const generateContractPDF = async (contract, booking) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `contract-${contract.contractNumber}.pdf`;
      const filePath = path.join(__dirname, '../pdfs', fileName);

      // Ensure pdfs directory exists
      if (!fs.existsSync(path.join(__dirname, '../pdfs'))) {
        fs.mkdirSync(path.join(__dirname, '../pdfs'), { recursive: true });
      }

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Header
      doc.fontSize(18).text('RENTAL AGREEMENT', { align: 'center', bold: true });
      doc.fontSize(12).text(contract.contractNumber, { align: 'center' });
      doc.moveDown();

      // Contract details
      doc.fontSize(11).text(`Property: ${booking.propertyId.title}`, { bold: true });
      doc.text(`Contract Number: ${contract.contractNumber}`);
      doc.text(`Issued Date: ${new Date(contract.createdAt).toLocaleDateString()}`);
      doc.text(`Expiry Date: ${new Date(contract.expiryDate).toLocaleDateString()}`);
      doc.moveDown();

      // Parties info
      doc.text('PARTIES:', { bold: true });
      doc.text(`Property Owner: ${booking.ownerId.firstName} ${booking.ownerId.lastName}`);
      doc.text(`Guest: ${booking.guestId.firstName} ${booking.guestId.lastName}`);
      doc.moveDown();

      // Terms
      doc.text('TERMS AND CONDITIONS:', { bold: true });
      doc.fontSize(10);
      const terms = contract.terms.split('\n');
      terms.forEach(line => {
        if (line.trim()) {
          doc.text(line);
        }
      });

      if (contract.customTerms) {
        doc.moveDown();
        doc.text('CUSTOM TERMS:', { bold: true });
        doc.text(contract.customTerms);
      }

      doc.moveDown(2);
      doc.text('SIGNATURES', { bold: true, underline: true });
      doc.moveDown();

      doc.text('Property Owner Signature: ______________________  Date: ___________');
      doc.moveDown();
      doc.text('Guest Signature: ______________________  Date: ___________');

      doc.end();

      stream.on('finish', () => {
        resolve(`/pdfs/${fileName}`);
      });

      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateInvoicePDF, generateContractPDF };
