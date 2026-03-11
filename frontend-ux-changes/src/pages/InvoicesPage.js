import React, { useState, useEffect } from 'react';
import { invoiceService } from '../services/api';
import { FaDownload, FaFileInvoice } from 'react-icons/fa';

const statusBadge = (status) => {
  const map = {
    paid:  'bg-green-50 text-green-700 ring-1 ring-green-200',
    sent:  'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
    draft: 'bg-gray-50 text-gray-600 ring-1 ring-gray-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${map[status] || 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'}`}>
      {status}
    </span>
  );
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await invoiceService.getAll();
        setInvoices(response.data);
      } catch (err) {
        console.error('Failed to fetch invoices', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>
        <p className="text-sm text-gray-500 mt-0.5">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-brand-600 font-medium animate-pulse">Loading invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🧾</div>
          <p className="font-medium text-gray-600">No invoices yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice._id} className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaFileInvoice className="text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                    <p className="text-sm text-gray-500">{invoice.propertyId?.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Issued {new Date(invoice.issuedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${invoice.total}</span>
                  </div>
                  {statusBadge(invoice.status)}
                </div>
              </div>
              {invoice.pdfUrl && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={invoice.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    <FaDownload className="text-xs" /> Download PDF
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
