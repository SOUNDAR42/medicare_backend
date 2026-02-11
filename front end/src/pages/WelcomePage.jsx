import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, Users, Clock, ArrowRight, Heart, Stethoscope, Zap, Star, ChevronRight, Sparkles } from 'lucide-react';

const WelcomePage = () => {
    const navigate = useNavigate();

    const features = [
        { icon: Stethoscope, title: 'Smart Triage', desc: 'AI-powered symptom analysis for instant urgency assessment', color: 'from-teal-500 to-emerald-500', bg: 'bg-teal-50' },
        { icon: Heart, title: 'Priority Care', desc: 'Urgent cases get priority tokens — no long waiting queues', color: 'from-rose-500 to-pink-500', bg: 'bg-rose-50' },
        { icon: Zap, title: 'Instant Booking', desc: 'Find & book appointments at nearby hospitals in seconds', color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50' },
        { icon: Shield, title: 'Medicine Finder', desc: 'Search real-time pharmacy stock with pincode-based lookup', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
    ];

    const stats = [
        { value: '10K+', label: 'Patients Served' },
        { value: '500+', label: 'Expert Doctors' },
        { value: '50+', label: 'Top Hospitals' },
        { value: '24/7', label: 'Support' },
    ];

    return (
        <div className="min-h-screen bg-background font-sans overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-40 -right-40 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="relative bg-gradient-to-br from-teal-500 to-emerald-500 p-2.5 rounded-xl shadow-lg shadow-teal-200">
                        <Activity className="text-white h-6 w-6" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">
                            Medi<span className="text-teal-600">Care</span>
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 -mt-0.5">
                            Healthcare Platform
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/auth')}
                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:border-teal-300 hover:bg-teal-50 transition-all duration-300"
                >
                    Sign In
                    <ChevronRight className="h-4 w-4" />
                </button>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-slide-up">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 text-teal-700 rounded-full text-sm font-semibold">
                            <Sparkles className="h-4 w-4" />
                            <span>AI-Powered Healthcare Platform</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                            Your Health,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-400 animate-gradient">
                                Our Priority
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
                            Experience next-gen healthcare management. Smart triage, instant booking, and real-time pharmacy search — all in one place.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button
                                onClick={() => navigate('/auth')}
                                className="group relative px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 shadow-xl shadow-teal-500/30 hover:shadow-teal-500/40 hover:scale-[1.02] flex items-center justify-center gap-3"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative">Get Started</span>
                                <ArrowRight className="h-5 w-5 relative group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/medicine')}
                                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:border-teal-300 hover:text-teal-700 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Browse Medicines
                            </button>
                        </div>

                        {/* Stats Strip */}
                        <div className="pt-6 flex flex-wrap items-center gap-8">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-2xl font-extrabold text-gray-900 bg-clip-text">{stat.value}</div>
                                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Feature Cards */}
                    <div className="relative hidden lg:block">
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full opacity-40 animate-blob" />
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full opacity-40 animate-blob animation-delay-2000" />

                        <div className="relative grid grid-cols-2 gap-4">
                            {features.map((feat, i) => {
                                const Icon = feat.icon;
                                return (
                                    <div
                                        key={i}
                                        className="group glass-card p-6 hover:shadow-elevated transition-all duration-500 cursor-pointer"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-1.5 text-lg">{feat.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Floating trust badge */}
                        <div className="absolute -bottom-4 right-8 glass-card px-5 py-3 flex items-center gap-3 animate-float shadow-elevated">
                            <div className="flex -space-x-2">
                                {['bg-teal-500', 'bg-violet-500', 'bg-amber-500'].map((c, i) => (
                                    <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                                        {['R', 'A', 'S'][i]}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-3 w-3 text-amber-400 fill-current" />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 font-medium">Trusted by 10K+ Users</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom gradient line */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 pb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent opacity-30" />
            </div>
        </div>
    );
};

export default WelcomePage;
