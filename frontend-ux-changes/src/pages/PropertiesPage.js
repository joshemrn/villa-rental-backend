import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/api';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    sort: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyService.getAll(filters);
      setProperties(response.data);
    } catch (err) {
      console.error('Failed to fetch properties', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    fetchProperties();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Properties</h1>

      {/* Filters */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-bold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleFilter}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilter}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilter}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="number"
            name="bedrooms"
            placeholder="Bedrooms"
            value={filters.bedrooms}
            onChange={handleFilter}
            className="border rounded-lg px-4 py-2"
          />
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilter}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="text-center py-12">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">No properties found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Link
              key={property._id}
              to={`/properties/${property._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={property.images?.[0] || 'https://via.placeholder.com/300x200'}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                <div className="flex items-center space-x-2 text-gray-600 mb-3">
                  <FaMapMarkerAlt className="text-sm" />
                  <span className="text-sm">{property.location?.address}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">${property.pricePerNight}/night</span>
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-400" />
                    <span className="font-semibold">{property.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
