import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contractService } from '../services/api';
import { FaFileContract, FaExternalLinkAlt, FaPenNib } from 'react-icons/fa';

const statusBadge = (status) => {
  const map = {
    'fully-signed':  'bg-green-50 text-green-700 ring-1 ring-green-200',
    'guest-signed':  'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
    'pending':       'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] || 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'}`}>
      {status?.replace(/-/g, ' ')}
    </span>
  );
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await contractService.getAll();
        setContracts(response.data);
      } catch (err) {
        console.error('Failed to fetch contracts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Contracts</h1>
        <p className="text-sm text-gray-500 mt-0.5">{contracts.length} contract{contracts.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-brand-600 font-medium animate-pulse">Loading contracts...</div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📄</div>
          <p className="font-medium text-gray-600">No contracts yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <div key={contract._id} className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaFileContract className="text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{contract.contractNumber}</h3>
                    <p className="text-sm text-gray-500">{contract.propertyId?.title}</p>
                  </div>
                </div>
                {statusBadge(contract.status)}
              </div>

              <div className="flex gap-3">
                {contract.pdfUrl && (
                  <a
                    href={contract.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-150"
                  >
                    <FaExternalLinkAlt className="text-xs" /> View PDF
                  </a>
                )}
                {contract.status !== 'fully-signed' && (
                  <Link
                    to={`/sign-contract/${contract._id}`}
                    className="inline-flex items-center gap-1.5 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors duration-150"
                  >
                    <FaPenNib className="text-xs" /> Sign Now
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
