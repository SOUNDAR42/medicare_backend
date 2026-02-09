
import React, { useState } from 'react';
import { ChevronDown, Users, Calendar, Activity, CheckCircle, Clock } from 'lucide-react';
import { MOCK_APPOINTMENTS, DOCTOR_HOSPITALS } from '../mockData';

const DoctorDashboard = () => {
    const [selectedHospital, setSelectedHospital] = useState(DOCTOR_HOSPITALS[0]);
    const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const filteredAppointments = appointments.filter(
        apt => apt.hospitalId === selectedHospital.id && apt.status === 'pending'
    );

    const completedCount = appointments.filter(
        apt => apt.hospitalId === selectedHospital.id && apt.status === 'completed'
    ).length;

    const handleCallNext = (id) => {
        // Optimistic update
        setAppointments(prev => prev.map(apt =>
            apt.id === id ? { ...apt, status: 'completed' } : apt
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Top Bar with Context Switcher */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 font-medium text-gray-700 transition-colors"
                            >
                                <BuildingIcon className="h-4 w-4 text-gray-500" />
                                {selectedHospital.name}
                                <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                                    {DOCTOR_HOSPITALS.map(hospital => (
                                        <button
                                            key={hospital.id}
                                            onClick={() => {
                                                setSelectedHospital(hospital);
                                                setDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between ${selectedHospital.id === hospital.id ? 'bg-blue-50 text-primary' : 'text-gray-700'
                                                }`}
                                        >
                                            {hospital.name}
                                            {selectedHospital.id === hospital.id && <CheckCircle className="h-4 w-4" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <span className="text-sm text-gray-400">|</span>
                        <span className="text-sm text-gray-500">Dr. Sarah Smith</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Completed</p>
                                <p className="font-bold text-gray-900">{completedCount}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Remaining</p>
                                <p className="font-bold text-gray-900">{filteredAppointments.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Live Queue</h1>

                {filteredAppointments.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                        <p className="text-gray-500">No pending appointments for {selectedHospital.name}.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredAppointments.map((apt, index) => (
                            <div
                                key={apt.id}
                                className={`bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between transition-all ${index === 0 ? 'ring-2 ring-primary ring-offset-2' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="text-center w-16">
                                        <span className="block text-xs text-gray-500 font-medium uppercase tracking-wider">Token</span>
                                        <span className="block text-3xl font-bold text-primary">{apt.token}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{apt.patientName}</h3>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {apt.time}</span>
                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleCallNext(apt.id)}
                                    className="btn-primary py-3 px-8 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                                >
                                    Call Next <Users className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const BuildingIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>
)

export default DoctorDashboard;
