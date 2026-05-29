import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, LayoutDashboard, User, LogOut, ShieldAlert, Receipt } from 'lucide-react';
import Logo from '../../assets/icons/LogoAccident.png';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/AuthContext';
import NotificationCenter from '../notifications/NotificationCenter';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const navLinks = [
    { name: t('Home'), href: '/#home' },
    { name: 'Network', href: '/#network' },
    { name: 'Claims', href: '/claims' },
    { name: 'Disputes', href: '/disputes' },
    { name: 'Nearby Help', href: '/nearby' },
    ...(isAuthenticated ? [
      { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    ] : []),
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={Logo} alt="Accident Alert Logo" className="h-8 w-auto grayscale shrink-0" />
            <span className="text-lg font-black text-slate-900 tracking-tight uppercase">
              AccidentAlert
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isHash = link.href.startsWith('/#');
              return (
                <button
                  key={link.name}
                  onClick={() => {
                    if (isHash) {
                      const id = link.href.split('#')[1];
                      if (window.location.pathname === '/') {
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      } else {
                        navigate(link.href);
                      }
                    } else {
                      navigate(link.href);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                >
                  {link.name}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-3 text-[10px] font-black text-slate-300 hover:text-slate-900 transition-colors px-2"
            >
              <Globe className="h-3 w-3 shrink-0" />
              {i18n.language === 'en' ? 'HI' : 'EN'}
            </button>

            {isAuthenticated && <NotificationCenter />}

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest px-4">
                  {t('Login')}
                </Link>
                <Link to="/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                  {t('Register')}
                </Link>
              </>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 pr-4 rounded-xl hover:border-slate-900 transition-all"
                >
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{user?.name?.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 overflow-hidden"
                    >
                      <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-brand-500" /> My Dashboard
                      </Link>
                      {user?.role === 'mediator' && (
                        <Link to="/mediator" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                          <ShieldAlert className="w-4 h-4" /> Mediator Hub
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                        <User className="w-4 h-4 text-slate-400" /> Profile Settings
                      </Link>
                      <Link to="/transactions" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                        <Receipt className="w-4 h-4 text-slate-400" /> My Transactions
                      </Link>
                      <hr className="border-slate-50 my-1" />
                      <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/report"
                className="bg-white border-2 border-slate-900 text-slate-900 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center gap-3"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                CAPTURE INCIDENT
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => {
                const isHash = link.href.startsWith('/#');
                return (
                  <button
                    key={link.name}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (isHash) {
                        const id = link.href.split('#')[1];
                        if (window.location.pathname === '/') {
                          const element = document.getElementById(id);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        } else {
                          navigate(link.href);
                        }
                      } else {
                        navigate(link.href);
                      }
                    }}
                    className="block w-full text-left px-4 py-3 text-base font-bold text-slate-600 hover:text-blue-500 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    {link.name}
                  </button>
                );
              })}
              {user?.role === 'mediator' && (
                <Link
                  to="/mediator"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  Mediator Hub
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
