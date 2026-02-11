import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react';

const ActionSelection = () => {
    const navigate = useNavigate();
    const { role } = useParams();

    // Capitalize role for display
    const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : '';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative">
                <button
                    onClick={() => navigate('/auth')}
                    className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="text-center pt-8 pb-8 space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Welcome, {displayRole}</h2>
                    <p className="text-gray-500">Please select an option to continue</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate(`/auth/${role}/login`)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-primary bg-blue-50 text-primary hover:bg-blue-100 transition-all group"
                    >
                        <span className="font-semibold text-lg">Login</span>
                        <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={() => navigate(`/auth/${role}/register`)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all group"
                    >
                        <span className="font-semibold text-lg">Register</span>
                        <UserPlus className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionSelection;
