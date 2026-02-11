import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, Building, Store } from 'lucide-react';

const RoleSelection = () => {
    const navigate = useNavigate();

    const RoleCard = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => navigate(`/auth/${id}`)}
            className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-white bg-white hover:border-blue-100 text-gray-500 hover:shadow-lg transition-all transform hover:-translate-y-1 w-full"
        >
            <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                <Icon className="h-10 w-10 text-primary" />
            </div>
            <span className="font-bold text-xl text-gray-800">{label}</span>
            <span className="text-sm text-gray-400 mt-2">Click to proceed</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900">Choose your role</h1>
                    <p className="text-gray-600 text-lg">Select how you want to interact with Medicare</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <RoleCard id="patient" icon={User} label="Patient" />
                    <RoleCard id="doctor" icon={Stethoscope} label="Doctor" />
                    <RoleCard id="hospital" icon={Building} label="Hospital" />
                    <RoleCard id="pharmacy" icon={Store} label="Pharmacy" />
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
