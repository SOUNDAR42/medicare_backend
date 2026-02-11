
import React, { useState, useEffect } from 'react';
import { Heart, Menu, X, Home, User, Building2, Pill, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const navLinks = [
        { label: 'Medicine', path: '/medicine', icon: Pill },
        { label: 'Manufacturers', path: '/manufacture', icon: Building2 },
        { label: 'Specializations', path: '/specializtion', icon: Heart },
    ];

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100'
                : 'bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
                        <div className={`relative p-2 rounded-xl transition-all duration-300 ${scrolled
                                ? 'bg-gradient-to-br from-teal-500 to-emerald-500 shadow-md shadow-teal-200'
                                : 'bg-white/15 backdrop-blur-sm border border-white/25'
                            } group-hover:scale-105`}>
                            <Heart className={`h-5 w-5 transition-colors ${scrolled ? 'text-white' : 'text-white'} fill-current`} />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-lg font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                                Medi<span className={`${scrolled ? 'text-teal-600' : 'text-emerald-200'}`}>Care</span>
                            </span>
                            <span className={`text-[10px] font-medium uppercase tracking-[0.2em] -mt-1 transition-colors ${scrolled ? 'text-gray-400' : 'text-white/60'}`}>
                                Healthcare Platform
                            </span>
                        </div>
                    </button>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => {
                            const isActive = location.pathname.startsWith(link.path);
                            const Icon = link.icon;
                            return (
                                <button
                                    key={link.path}
                                    onClick={() => navigate(link.path)}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive
                                            ? scrolled
                                                ? 'bg-teal-50 text-teal-700'
                                                : 'bg-white/20 text-white'
                                            : scrolled
                                                ? 'text-gray-600 hover:text-teal-700 hover:bg-teal-50/50'
                                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {link.label}
                                    {isActive && (
                                        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full ${scrolled ? 'bg-teal-500' : 'bg-white'
                                            }`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {user && (
                            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${scrolled ? 'bg-gray-100 text-gray-700' : 'bg-white/15 text-white/90'
                                }`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${scrolled ? 'bg-teal-500 text-white' : 'bg-white/25 text-white'
                                    }`}>
                                    {(user.doctor_name || user.hospital_name || user.pharmacy_name || 'U')[0]}
                                </div>
                                <span className="font-medium">
                                    {user.doctor_name || user.hospital_name || user.pharmacy_name || 'User'}
                                </span>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                                }`}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-xl animate-slide-down">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map(link => {
                            const Icon = link.icon;
                            return (
                                <button
                                    key={link.path}
                                    onClick={() => { navigate(link.path); setMobileOpen(false); }}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-5 w-5" />
                                        <span className="font-medium">{link.label}</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
