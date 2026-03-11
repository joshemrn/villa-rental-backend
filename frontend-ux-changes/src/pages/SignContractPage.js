import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import SignaturePad from 'react-signature-canvas';
import { contractService } from '../services/api';
import { toast } from 'react-toastify';

export default function SignContractPage() {
  const { contractId } = useParams();
  const [signatureRef, setSignatureRef] = useState(null);
  const [signedBy, setSignedBy] = useState('guest');
  const [loading, setLoading] = useState(false);

  const handleSign = async () => {
    if (!signatureRef) {
      toast.error('Signature pad error');
      return;
    }

    const signature = signatureRef.toDataURL();
    setLoading(true);
    try {
      await contractService.sign(contractId, signature, signedBy);
      toast.success('Contract signed successfully!');
    } catch (err) {
      toast.error('Failed to sign contract');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sign Contract</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Signed By</label>
          <select
            value={signedBy}
            onChange={(e) => setSignedBy(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full"
          >
            <option value="guest">Guest</option>
            <option value="owner">Owner</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sign Below</label>
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
            <SignaturePad
              ref={setSignatureRef}
              canvasProps={{
                width: 500,
                height: 200,
                className: 'w-full'
              }}
            />
          </div>
        </div>

        <button
          onClick={handleSign}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Signing...' : 'Sign Contract'}
        </button>
      </div>
    </div>
  );
}
