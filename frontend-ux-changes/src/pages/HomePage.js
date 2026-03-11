import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaShieldAlt, FaCreditCard, FaHeadset, FaArrowRight, FaSearch } from 'react-icons/fa';

export default function HomePage() {
  const featuredProperties = [
    {
      id: 1,
      title: 'Luxury Paradise Villa',
      location: 'Orlando, FL',
      price: 250,
      rating: 4.9,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80'
    },
    {
      id: 2,
      title: 'Modern Family Estate',
      location: 'Orlando, FL',
      price: 180,
      rating: 4.8,
      reviews: 95,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80'
    },
    {
      id: 3,
      title: 'Tropical Beach House',
      location: 'Orlando, FL',
      price: 220,
      rating: 4.7,
      reviews: 110,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-brand-900 to-brand-700 text-white py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center bg-white/10 border border-white/20 text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <FaMapMarkerAlt className="mr-2 text-brand-300" /> Orlando, Florida's #1 Villa Rental Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-tight">
            Find Your Perfect Villa<br className="hidden md:block" /> in Orlando
          </h1>
          <p className="text-xl text-white/75 mb-10 max-w-xl mx-auto">
            Experience luxury vacation rentals with world-class amenities and seamless booking.
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-brand-50 transition-all duration-200"
          >
            Explore Properties <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Search Available Villas</h2>
          <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Check-in</label>
                <input type="date" className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Check-out</label>
                <input type="date" className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Guests</label>
                <input type="number" min="1" className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="How many?" />
              </div>
              <div className="flex flex-col justify-end">
                <Link
                  to="/properties"
                  className="flex items-center justify-center gap-2 bg-brand-600 text-white rounded-lg py-2.5 font-semibold hover:bg-brand-700 transition-colors duration-150 text-sm"
                >
                  <FaSearch /> Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
            <Link to="/properties" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="group bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-gray-100"
              >
                <div className="relative overflow-hidden h-52">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                    <FaStar className="text-amber-400 text-xs" />
                    <span className="text-xs font-semibold text-gray-800">{property.rating}</span>
                    <span className="text-xs text-gray-500">({property.reviews})</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-1.5">{property.title}</h3>
                  <div className="flex items-center gap-1.5 text-gray-500 mb-4">
                    <FaMapMarkerAlt className="text-xs text-brand-500" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xl font-bold text-brand-600">${property.price}</span>
                      <span className="text-sm text-gray-500">/night</span>
                    </div>
                    <span className="text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">View details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-10 text-center text-gray-900">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-card hover:shadow-md transition-shadow duration-200 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl mb-5 text-2xl">
                <FaShieldAlt />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Verified Properties</h3>
              <p className="text-sm text-gray-500 leading-relaxed">All our properties are verified and inspected regularly for quality and safety.</p>
            </div>
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-card hover:shadow-md transition-shadow duration-200 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-50 text-green-600 rounded-2xl mb-5 text-2xl">
                <FaCreditCard />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Safe and secure payment processing powered by Stripe with multiple options.</p>
            </div>
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-card hover:shadow-md transition-shadow duration-200 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl mb-5 text-2xl">
                <FaHeadset />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Our dedicated support team is always ready to help you whenever you need it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-brand-700 py-14">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to book your dream villa?</h2>
          <p className="text-white/75 mb-7 text-sm">Browse hundreds of verified properties and find your perfect Orlando getaway.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-brand-50 transition-colors duration-150 shadow-md"
          >
            Get started for free <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </section>
    </div>
  );
}
