import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Menu, X, User, LogOut, LogIn, BookCopy, Users, Home, Shield } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // Desktop navigation items based on user role
  const renderDesktopNavItems = () => {
    if (isAdmin) {
      return (
        <div className="flex items-center space-x-6">
          <Link to="/admin/dashboard" className="hover:text-blue-200 transition duration-300">Admin Dashboard</Link>
          <Link to="/admin/books" className="hover:text-blue-200 transition duration-300">Manage Books</Link>
          <Link to="/admin/users" className="hover:text-blue-200 transition duration-300">Manage Users</Link>
          <div className="flex items-center space-x-4 ml-4 border-l pl-4 border-blue-700">
            <span className="text-blue-200">Admin: {user?.name}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 py-1 px-3 rounded-md transition duration-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      );
    }

    if (user) {
      return (
        <div className="flex items-center space-x-6">
          <Link to="/books" className="hover:text-blue-200 transition duration-300">Browse Books</Link>
          <Link to="/my-books" className="hover:text-blue-200 transition duration-300">My Books</Link>
          <div className="flex items-center space-x-4 ml-4 border-l pl-4 border-blue-700">
            <span className="text-blue-200">Hello, {user.name}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 py-1 px-3 rounded-md transition duration-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-3">
        <Link 
          to="/login" 
          className="flex items-center space-x-1 hover:text-blue-200 transition duration-300"
        >
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </Link>
        <Link 
          to="/register" 
          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-md transition duration-300"
        >
          <User className="h-4 w-4" />
          <span>Register</span>
        </Link>
        <Link 
          to="/admin/login" 
          className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 py-1 px-3 rounded-md transition duration-300"
        >
          <Shield className="h-4 w-4" />
          <span>Admin Login</span>
        </Link>
      </div>
    );
  };

  // Render mobile navigation items
  const renderMobileNavItems = () => {
    if (isAdmin) {
      return (
        <>
          <Link 
            to="/admin/dashboard" 
            className="flex items-center space-x-2 hover:bg-blue-800 px-2 py-2 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <Users className="h-5 w-5" />
            <span>Admin Dashboard</span>
          </Link>
          <Link 
            to="/admin/books" 
            className="flex items-center space-x-2 hover:bg-blue-800 px-2 py-2 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <BookCopy className="h-5 w-5" />
            <span>Manage Books</span>
          </Link>
          <Link 
            to="/admin/users" 
            className="flex items-center space-x-2 hover:bg-blue-800 px-2 py-2 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <Users className="h-5 w-5" />
            <span>Manage Users</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-left text-red-300 hover:bg-red-900 hover:text-white px-2 py-2 rounded-md transition duration-300"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </>
      );
    }

    if (user) {
      return (
        <>
          <Link 
            to="/my-books" 
            className="flex items-center space-x-2 hover:bg-blue-800 px-2 py-2 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <BookOpen className="h-5 w-5" />
            <span>My Books</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-left text-red-300 hover:bg-red-900 hover:text-white px-2 py-2 rounded-md transition duration-300"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </>
      );
    }

    return (
      <>
        <Link 
          to="/login" 
          className="flex items-center space-x-2 hover:bg-blue-800 px-2 py-2 rounded-md"
          onClick={() => setIsMenuOpen(false)}
        >
          <LogIn className="h-5 w-5" />
          <span>Login</span>
        </Link>
        <Link 
          to="/register" 
          className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-600 px-2 py-2 rounded-md"
          onClick={() => setIsMenuOpen(false)}
        >
          <User className="h-5 w-5" />
          <span>Register</span>
        </Link>
        <Link 
          to="/admin/login" 
          className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 px-2 py-2 rounded-md"
          onClick={() => setIsMenuOpen(false)}
        >
          <Shield className="h-5 w-5" />
          <span>Admin Login</span>
        </Link>
      </>
    );
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and site name */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8" />
            <span className="text-xl font-bold">E-Library</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            {!isAdmin && (
              <>
                <Link to="/" className="hover:text-blue-200 transition duration-300 mr-6">Home</Link>
                <Link to="/books" className="hover:text-blue-200 transition duration-300 mr-6">Books</Link>
              </>
            )}
            {renderDesktopNavItems()}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-700 animate-fadeIn">
            <nav className="flex flex-col space-y-3">
              {!isAdmin && (
                <>
                  <Link 
                    to="/" 
                    className="flex items-center space-x-2 hover:bg-blue-800 px-2 py-2 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link 
                    to="/books" 
                    className="flex items-center space-x-2 hover:bg-blue-800 px-2 py-2 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookCopy className="h-5 w-5" />
                    <span>Books</span>
                  </Link>
                </>
              )}
              {renderMobileNavItems()}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;