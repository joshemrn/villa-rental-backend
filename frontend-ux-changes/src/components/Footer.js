import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaHome } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaHome className="text-brand-400 text-xl" />
              <h3 className="text-lg font-bold">Orlando Villas</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your premier vacation rental destination in Orlando, Florida.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/properties" className="hover:text-white transition-colors duration-150">Browse Properties</Link></li>
              <li><a href="#about" className="hover:text-white transition-colors duration-150">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors duration-150">Contact</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors duration-150">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors duration-150">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-150">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-150">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-150">Cancellation Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center space-x-2.5">
                <FaPhone className="text-brand-400 flex-shrink-0" />
                <span>(407) 555-1234</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <FaEnvelope className="text-brand-400 flex-shrink-0" />
                <span>support@villarental.com</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <FaMapMarkerAlt className="text-brand-400 flex-shrink-0" />
                <span>Orlando, FL 32801</span>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-slate-800" />
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>&copy; 2024 Orlando Villa Rental. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
