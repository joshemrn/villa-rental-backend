import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaTimes, FaCheckCircle, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const inputCls = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function PropertyListingPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: { address: '', city: 'Orlando', state: 'FL', zipCode: '' },
    pricePerNight: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    amenities: [],
    images: [],
    rules: [],
    cancellationPolicy: 'Flexible - Free cancellation until 7 days before arrival'
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await propertyService.getMyProperties();
      setProperties(response.data);
    } catch (err) {
      toast.error('Failed to fetch properties');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({ ...formData, [parent]: { ...formData[parent], [child]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAmenitiesChange = (e) => {
    const value = e.target.value.split(',').map(a => a.trim());
    setFormData({ ...formData, amenities: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await propertyService.create(formData);
      setProperties([...properties, response.data]);
      toast.success('Property listed successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        location: { address: '', city: 'Orlando', state: 'FL', zipCode: '' },
        pricePerNight: '',
        bedrooms: '',
        bathrooms: '',
        maxGuests: '',
        amenities: [],
        images: [],
        rules: [],
        cancellationPolicy: 'Flexible - Free cancellation until 7 days before arrival'
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
          <p className="text-sm text-gray-500 mt-0.5">{properties.length} listing{properties.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 ${
            showForm
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-brand-600 text-white hover:bg-brand-700'
          }`}
        >
          {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Property</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-card mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">List a New Property</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelCls}>Property Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputCls} placeholder="e.g. Luxury Villa with Pool" />
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className={inputCls} placeholder="Describe your property..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Address</label>
                <input type="text" name="location.address" value={formData.location.address} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Zip Code</label>
                <input type="text" name="location.zipCode" value={formData.location.zipCode} onChange={handleChange} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={labelCls}>Price / Night ($)</label>
                <input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Bedrooms</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Bathrooms</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Max Guests</label>
                <input type="number" name="maxGuests" value={formData.maxGuests} onChange={handleChange} required className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Amenities <span className="text-gray-400 font-normal">(comma-separated)</span></label>
              <input type="text" value={formData.amenities.join(', ')} onChange={handleAmenitiesChange} placeholder="WiFi, Pool, Parking, AC, Kitchen..." className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Cancellation Policy</label>
              <textarea name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleChange} rows="2" className={inputCls} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 disabled:opacity-50 transition-colors duration-150"
            >
              {loading ? 'Listing...' : 'List Property'}
            </button>
          </form>
        </div>
      )}

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🏠</div>
          <p className="font-medium">No properties listed yet</p>
          <p className="text-sm mt-1">Click "Add Property" to list your first villa</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              <div className="relative h-48">
                <img
                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-3 right-3 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                  property.verified
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                    : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                }`}>
                  {property.verified ? <FaCheckCircle className="text-xs" /> : <FaClock className="text-xs" />}
                  {property.verified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{property.title}</h3>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                  <FaMapMarkerAlt className="text-brand-500 text-xs" />
                  <span>{property.location?.address}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-lg font-bold text-brand-600">${property.pricePerNight}</span>
                    <span className="text-gray-500 text-sm"> / night</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-150">
                    Edit
                  </button>
                  <button className="flex-1 bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors duration-150">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
