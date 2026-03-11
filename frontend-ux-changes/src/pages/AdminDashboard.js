import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { FaUsers, FaHome, FaCalendarAlt, FaDollarSign, FaCheckCircle, FaClock } from 'react-icons/fa';

const statusBadge = (status) => {
  const map = {
    confirmed: 'bg-green-50 text-green-700 ring-1 ring-green-200',
    pending:   'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    cancelled: 'bg-red-50 text-red-600 ring-1 ring-red-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${map[status] || 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'}`}>
      {status}
    </span>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalProperties: 0, totalBookings: 0, totalRevenue: 0 });
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [statsRes, propertiesRes, bookingsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getProperties(),
        adminService.getBookings()
      ]);
      setStats(statsRes.data);
      setProperties(propertiesRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyProperty = async (propertyId) => {
    try {
      await adminService.verifyProperty(propertyId);
      fetchDashboard();
    } catch (err) {
      console.error('Failed to verify property', err);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: FaUsers, color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-l-4 border-brand-500' },
    { label: 'Properties', value: stats.totalProperties, icon: FaHome, color: 'text-green-600', bg: 'bg-green-50', border: 'border-l-4 border-green-500' },
    { label: 'Bookings', value: stats.totalBookings, icon: FaCalendarAlt, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-l-4 border-amber-500' },
    { label: 'Revenue', value: `$${stats.totalRevenue?.toFixed(0) || 0}`, icon: FaDollarSign, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-l-4 border-rose-500' },
  ];

  const tabs = ['stats', 'properties', 'bookings'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform overview and management</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`bg-white rounded-2xl shadow-card p-6 ${card.border}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{card.label}</p>
                <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`${card.color} text-sm`} />
                </div>
              </div>
              <p className={`text-3xl font-bold ${card.color}`}>{loading ? '—' : card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tab Bar */}
      <div className="mb-6 flex gap-1 border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold capitalize rounded-t-lg transition-colors duration-150 ${
              activeTab === tab
                ? 'text-brand-600 border-b-2 border-brand-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Properties Table */}
      {activeTab === 'properties' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Title', 'Owner', 'Price/night', 'Status', 'Action'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {properties.map((property, i) => (
                <tr key={property._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{property.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{property.owner?.firstName} {property.owner?.lastName}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-brand-600">${property.pricePerNight}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      property.verified
                        ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                        : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                    }`}>
                      {property.verified ? <FaCheckCircle className="text-xs" /> : <FaClock className="text-xs" />}
                      {property.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {!property.verified && (
                      <button
                        onClick={() => handleVerifyProperty(property._id)}
                        className="bg-brand-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-brand-700 transition-colors duration-150"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bookings Table */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Property', 'Guest', 'Check-in', 'Total', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((booking, i) => (
                <tr key={booking._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.propertyId?.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.guestId?.firstName} {booking.guestId?.lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-brand-600">${booking.totalPrice}</td>
                  <td className="px-6 py-4">{statusBadge(booking.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats tab placeholder */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 text-center text-gray-400">
          <p className="text-sm">Switch to Properties or Bookings tabs to manage data.</p>
        </div>
      )}
    </div>
  );
}
