import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { propertyService, bookingService } from '../services/api';
import { useAuthStore } from '../store/store';
import { FaStar, FaMapMarkerAlt, FaWifi, FaBed, FaBath, FaUsers, FaCheckCircle } from 'react-icons/fa';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: ''
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await propertyService.getById(id);
        setProperty(response.data);
      } catch (err) {
        toast.error('Failed to load property');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const response = await bookingService.create({ propertyId: id, ...bookingData });
      toast.success('Booking created! Proceeding to payment...');
      navigate(`/payment/${response.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
      <div className="animate-pulse text-brand-600 font-medium">Loading property...</div>
    </div>
  );
  if (!property) return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">Property not found</div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden mb-6 h-80 bg-gray-100">
            <img
              src={property.images?.[0] || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
            {property.verified && (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full ring-1 ring-green-200">
                <FaCheckCircle className="text-xs" /> Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1.5">
              <FaStar className="text-amber-400" />
              <span className="font-semibold text-gray-800">{property.rating}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-brand-500" />
              <span>{property.location?.address}, {property.location?.city}</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-brand-600 mb-1">
                <FaBed /> <span className="font-bold text-lg">{property.bedrooms}</span>
              </div>
              <p className="text-xs text-gray-500">Bedrooms</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="flex items-center justify-center gap-1.5 text-brand-600 mb-1">
                <FaBath /> <span className="font-bold text-lg">{property.bathrooms}</span>
              </div>
              <p className="text-xs text-gray-500">Bathrooms</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-brand-600 mb-1">
                <FaUsers /> <span className="font-bold text-lg">{property.maxGuests}</span>
              </div>
              <p className="text-xs text-gray-500">Max guests</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About this property</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 bg-gray-50 px-4 py-2.5 rounded-xl text-sm text-gray-700">
                    <FaWifi className="text-brand-500 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancellation Policy */}
          {property.cancellationPolicy && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-amber-900 mb-1.5">Cancellation Policy</h3>
              <p className="text-sm text-amber-800">{property.cancellationPolicy}</p>
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-20 shadow-card">
            <div className="mb-5 pb-5 border-b border-gray-100">
              <span className="text-3xl font-bold text-brand-600">${property.pricePerNight}</span>
              <span className="text-gray-500 text-sm"> / night</span>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Check-in</label>
                <input
                  type="date"
                  value={bookingData.checkInDate}
                  onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Check-out</label>
                <input
                  type="date"
                  value={bookingData.checkOutDate}
                  onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Guests</label>
                <input
                  type="number"
                  min="1"
                  max={property.maxGuests}
                  value={bookingData.numberOfGuests}
                  onChange={(e) => setBookingData({ ...bookingData, numberOfGuests: parseInt(e.target.value) })}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">Max {property.maxGuests} guests</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Special Requests</label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  rows="3"
                  placeholder="Any special requests..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors duration-150"
              >
                {isAuthenticated ? 'Book Now' : 'Sign in to Book'}
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-3">You won't be charged yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
