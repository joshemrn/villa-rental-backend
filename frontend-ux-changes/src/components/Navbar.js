import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt, FaList, FaClipboard } from 'react-icons/fa';
import { useAuthStore } from '../store/store';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`text-sm font-medium transition-colors duration-150 pb-0.5 ${
          active
            ? 'text-brand-600 border-b-2 border-brand-600'
            : 'text-gray-600 hover:text-brand-600'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <FaHome className="text-2xl text-brand-600" />
              <span className="text-xl font-bold text-brand-700">Orlando Villas</span>
            </Link>
          </div>

          {/* Center Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLink('/', 'Home')}
            {navLink('/properties', 'Browse')}
            {isAuthenticated && user?.role === 'owner' && navLink('/list-property', 'List Property')}
            {isAuthenticated && user?.role === 'admin' && navLink('/admin', 'Admin')}
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/bookings"
                  className="hidden md:flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors duration-150"
                >
                  <FaList className="text-xs" /> <span>Bookings</span>
                </Link>
                <Link
                  to="/invoices"
                  className="hidden md:flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors duration-150"
                >
                  <FaClipboard className="text-xs" /> <span>Invoices</span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-brand-600 bg-gray-50 hover:bg-brand-50 border border-gray-200 px-3 py-1.5 rounded-lg transition-all duration-150">
                    <FaUser className="text-xs" />
                    <span>{user?.firstName}</span>
                  </button>
                  <div className="hidden group-hover:block absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                    >
                      <FaSignOutAlt className="inline mr-2" /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-brand-600 transition-colors duration-150"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors duration-150"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
