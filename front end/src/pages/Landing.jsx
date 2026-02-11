
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Stethoscope, Pill, ArrowRight, Sparkles } from 'lucide-react';
import AuthModal from '../components/features/AuthModal';

const roleCards = [
    {
        icon: User,
        title: 'Patient',
        desc: 'Book appointments, find medicines, and manage your health records.',
        gradient: 'from-teal-500 to-emerald-500',
        shadow: 'shadow-teal-200',
        bg: 'bg-teal-50',
    },
    {
        icon: Stethoscope,
        title: 'Doctor',
        desc: 'Manage live queues, consult patients, and handle multi-hospital schedules.',
        gradient: 'from-violet-500 to-purple-500',
        shadow: 'shadow-violet-200',
        bg: 'bg-violet-50',
    },
    {
        icon: Building2,
        title: 'Hospital',
        desc: 'Manage doctor rosters, appointments, and facility operations.',
        gradient: 'from-blue-500 to-indigo-500',
        shadow: 'shadow-blue-200',
        bg: 'bg-blue-50',
    },
    {
        icon: Pill,
        title: 'Pharmacy',
        desc: 'Track inventory, manage stock levels, and handle prescriptions.',
        gradient: 'from-rose-500 to-pink-500',
        shadow: 'shadow-rose-200',
        bg: 'bg-rose-50',
    },
];

const Landing = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob" />
                <div className="absolute top-60 -left-40 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-full text-sm font-semibold text-teal-700 mb-6">
                        <Sparkles className="h-4 w-4" />
                        <span>Unified Healthcare Platform</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.1]">
                        Healthcare ecosystem <br />
                        for{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-400 animate-gradient">
                            everyone
                        </span>
                    </h1>
                    <p className="text-xl text-gray-500 leading-relaxed">
                        Seamlessly connecting patients, doctors, hospitals, and pharmacies
                        in one intelligent platform.
                    </p>
                </div>

                {/* Role Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {roleCards.map((role, i) => {
                        const Icon = role.icon;
                        return (
                            <button
                                key={role.title}
                                onClick={() => navigate('/auth')}
                                className="group glass-card p-8 text-left relative overflow-hidden hover:shadow-elevated transition-all duration-500"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                    <Icon className="w-32 h-32 transform translate-x-6 -translate-y-6" />
                                </div>

                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-6 shadow-lg ${role.shadow} group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                                    <Icon className="h-7 w-7 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">{role.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 relative z-10">{role.desc}</p>

                                <div className="flex items-center gap-2 text-sm font-semibold text-teal-600 relative z-10 group-hover:gap-3 transition-all duration-300">
                                    Continue
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <AuthModal
                isOpen={!!selectedRole}
                role={selectedRole}
                onClose={() => setSelectedRole(null)}
            />
        </div>
    );
};

export default Landing;
