import React, { useState } from 'react';
import { authService } from '../services/api';
import { useAuthStore } from '../store/store';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';

const inputCls = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: user?.address || {}
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({ ...formData, [parent]: { ...formData[parent], [child]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.updateProfile(formData);
      setUser(response.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Update your personal information</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
        <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center">
          <FaUser className="text-brand-600 text-2xl" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize bg-brand-50 text-brand-700 ring-1 ring-brand-200 mt-1">
            {user?.role}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>First name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Last name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputCls} placeholder="+1 (555) 000-0000" />
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Address</h2>
          <div>
            <label className={labelCls}>Street</label>
            <input type="text" name="address.street" value={formData.address?.street || ''} onChange={handleChange} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>City</label>
              <input type="text" name="address.city" value={formData.address?.city || ''} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input type="text" name="address.state" value={formData.address?.state || ''} onChange={handleChange} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Zip Code</label>
              <input type="text" name="address.zipCode" value={formData.address?.zipCode || ''} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <input type="text" name="address.country" value={formData.address?.country || ''} onChange={handleChange} className={inputCls} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 disabled:opacity-50 transition-colors duration-150"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
