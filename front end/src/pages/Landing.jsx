

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Stethoscope, Pill } from 'lucide-react';
import AuthModal from '../components/features/AuthModal';

const RoleCard = ({ icon: Icon, title, description, color, onClick }) => (
    <button
        onClick={onClick}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-300 group text-left w-full h-full relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 ${color.replace('bg-', 'text-')}`}>
            <Icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${color} bg-opacity-10 group-hover:scale-110 transition-transform relative z-10`}>
            <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed relative z-10">{description}</p>
    </button>
);

const Landing = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-accent-teal/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-primary text-sm font-semibold mb-4 tracking-wide uppercase">
                        Unified Healthcare Platform
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                        Healthcare ecosystem <br />
                        for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">everyone</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Seamlessly connecting patients, doctors, hospitals, and pharmacies
                        in one intelligent platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <RoleCard
                        icon={User}
                        title="Patient"
                        description="Book appointments, find medicines, and manage your health records."
                        color="bg-blue-500"
                        onClick={() => navigate('/auth')}
                    />
                    <RoleCard
                        icon={Stethoscope}
                        title="Doctor"
                        description="Manage appointments, view patient history, and handle queues."
                        color="bg-teal-500"
                        onClick={() => navigate('/auth')}
                    />
                    <RoleCard
                        icon={Building2}
                        title="Hospital"
                        description="Manage facility operations, doctors, and patient admissions."
                        color="bg-indigo-500"
                        onClick={() => navigate('/auth')}
                    />
                    <RoleCard
                        icon={Pill}
                        title="Pharmacy"
                        description="Manage inventory, track orders, and dispensations."
                        color="bg-rose-500"
                        onClick={() => navigate('/auth')}
                    />
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
