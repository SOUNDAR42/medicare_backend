import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, Users, Clock, ArrowRight } from 'lucide-react';

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans">
            {/* Navbar */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-2 rounded-lg">
                        <Activity className="text-white h-6 w-6" />
                    </div>
                    <span className="text-2xl font-bold text-gray-800 tracking-tight">Medicare</span>
                </div>

            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-primary rounded-full text-sm font-semibold">
                        <Shield className="h-4 w-4" />
                        <span>Trusted by 10,000+ Patients</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                        Your Health, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Our Priority</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                        Experience modern healthcare management. Connect with top doctors, manage prescriptions, and track your health journey all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => navigate('/auth')}
                            className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2"
                        >
                            Get Started
                            <ArrowRight className="h-5 w-5" />
                        </button>

                    </div>

                    <div className="pt-8 flex items-center gap-8 text-gray-500">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            <span>Expert Doctors</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            <span>24/7 Support</span>
                        </div>
                    </div>
                </div>

                <div className="relative hidden lg:block">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="relative bg-white/40 backdrop-blur-sm border border-white/50 rounded-3xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                        {/* Abstract UI Mockup */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Activity className="text-primary h-6 w-6" />
                                </div>
                                <div className="h-8 w-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-bold">
                                    Healthy
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="h-24 bg-blue-50 rounded-2xl p-4">
                                    <div className="h-8 w-8 bg-white rounded-full mb-2"></div>
                                    <div className="h-3 bg-blue-200 rounded w-16"></div>
                                </div>
                                <div className="h-24 bg-purple-50 rounded-2xl p-4">
                                    <div className="h-8 w-8 bg-white rounded-full mb-2"></div>
                                    <div className="h-3 bg-purple-200 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WelcomePage;
