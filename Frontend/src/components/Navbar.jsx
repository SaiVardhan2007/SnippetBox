import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Terminal, Menu, X, LogOut, LayoutDashboard, LogIn, ChevronRight } from 'lucide-react';
import { API_URL } from '../config';

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle auth state changes
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Periodically sync login state (fallback for single-page routing changes)
    const interval = setInterval(() => {
      const token = !!localStorage.getItem('token');
      const admin = localStorage.getItem('isAdmin') === 'true';
      if (token !== isLoggedIn) {
        setIsLoggedIn(token);
      }
      if (admin !== isAdmin) {
        setIsAdmin(admin);
      }
    }, 1000);

    // Fetch categories
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(err => console.error("Error fetching categories for navbar:", err));

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isLoggedIn, isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
    // Dispatch storage event to notify navbar instantly
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl text-white shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-200">
            <Terminal size={20} />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent group-hover:opacity-95 transition-opacity">
            SnippetBox
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-indigo-400 ${location.pathname === '/' ? 'text-indigo-400' : 'text-gray-400'}`}
          >
            Home
          </Link>
          
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat._id}`}
              className={`text-sm font-medium transition-colors hover:text-indigo-400 ${location.pathname === `/category/${cat._id}` ? 'text-indigo-400' : 'text-gray-400'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link 
                  to="/admin/dashboard" 
                  className="flex items-center gap-2 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 px-4 py-2 rounded-xl text-sm font-medium text-indigo-300 hover:text-white transition-all"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
              )}
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 bg-red-950/20 hover:bg-red-900/30 border border-red-500/20 hover:border-red-500/40 px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 transition-all cursor-pointer"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl text-sm font-medium text-gray-200 hover:text-white transition-all"
            >
              <LogIn size={15} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-gray-400 hover:text-white p-1 cursor-pointer"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 mt-4 pt-4 flex flex-col gap-4 animate-fade-in">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className={`text-sm font-medium py-1 px-2 rounded-lg ${location.pathname === '/' ? 'text-indigo-400 bg-indigo-500/5' : 'text-gray-400 hover:text-white'}`}
          >
            Home
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat._id}`}
              onClick={() => setIsOpen(false)}
              className={`text-sm font-medium py-1 px-2 rounded-lg flex items-center justify-between ${location.pathname === `/category/${cat._id}` ? 'text-indigo-400 bg-indigo-500/5' : 'text-gray-400 hover:text-white'}`}
            >
              <span>{cat.name}</span>
              <ChevronRight size={14} className="opacity-50" />
            </Link>
          ))}
          <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 bg-indigo-600/10 border border-indigo-500/20 py-2.5 rounded-xl text-sm font-medium text-indigo-300"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => { setIsOpen(false); handleLogout(); }} 
                  className="flex items-center justify-center gap-2 bg-red-950/20 border border-red-500/20 py-2.5 rounded-xl text-sm font-medium text-red-400 cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-2.5 rounded-xl text-sm font-medium text-gray-200"
              >
                <LogIn size={16} />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
