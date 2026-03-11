import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useAuthStore } from '../store/store';
import { FaCalendarAlt, FaUsers, FaCreditCard, FaFileContract } from 'react-icons/fa';

const statusBadge = (status) => {
  const map = {
    confirmed: 'bg-green-50 text-green-700 ring-1 ring-green-200',
    pending:   'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    cancelled: 'bg-red-50 text-red-600 ring-1 ring-red-200',
    'checked-in':  'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
    'checked-out': 'bg-gray-50 text-gray-600 ring-1 ring-gray-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${map[status] || 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'}`}>
      {status}
    </span>
  );
};

export default function BookingsPage() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = user?.role === 'owner'
          ? await bookingService.getOwnerBookings()
          : await bookingService.getMyBookings();
        setBookings(response.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{user?.role === 'owner' ? 'Guest Bookings' : 'My Bookings'}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-brand-600 font-medium animate-pulse">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📅</div>
          <p className="font-medium text-gray-600">No bookings yet</p>
          <Link to="/properties" className="text-brand-600 hover:text-brand-700 text-sm font-medium mt-2 inline-block">
            Browse available properties →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
              <div className="flex justify-between items-start p-6 pb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{booking.propertyId?.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{booking.propertyId?.location?.address}</p>
                </div>
                {statusBadge(booking.status)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 border-t border-b border-gray-100">
                <div className="bg-white px-5 py-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-0.5">
                    <FaCalendarAlt className="text-xs" /> Check-in
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-white px-5 py-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-0.5">
                    <FaCalendarAlt className="text-xs" /> Check-out
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-white px-5 py-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-0.5">
                    <FaCreditCard className="text-xs" /> Total
                  </div>
                  <p className="text-sm font-bold text-brand-600">${booking.totalPrice}</p>
                </div>
                <div className="bg-white px-5 py-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-0.5">
                    <FaUsers className="text-xs" /> Guests
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{booking.numberOfGuests}</p>
                </div>
              </div>

              <div className="px-6 py-4 flex gap-3">
                {booking.status === 'pending' && (
                  <Link
                    to={`/payment/${booking._id}`}
                    className="inline-flex items-center gap-1.5 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors duration-150"
                  >
                    <FaCreditCard className="text-xs" /> Complete Payment
                  </Link>
                )}
                {booking.status === 'confirmed' && !booking.contractSigned && (
                  <Link
                    to="/contracts"
                    className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-100 transition-colors duration-150"
                  >
                    <FaFileContract className="text-xs" /> Sign Contract
                  </Link>
                )}
                <Link
                  to="/contracts"
                  className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-150"
                >
                  <FaFileContract className="text-xs" /> View Contract
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
