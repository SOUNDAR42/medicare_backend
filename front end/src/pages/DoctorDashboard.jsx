
import React, { useState, useEffect } from 'react';
import { ChevronDown, Users, Calendar, Activity, CheckCircle, Clock, Power, Bell, AlertTriangle, ArrowRight, Stethoscope, Building2 } from 'lucide-react';
import { api } from '../api';

const DoctorDashboard = () => {
    const [user, setUser] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.role === 'doctor') {
            setUser(storedUser);
            fetchData(storedUser.doctor_id, selectedDate);
        } else {
            setLoading(false);
        }
    }, [selectedDate]);

    const fetchData = async (doctorId, date) => {
        setLoading(true);
        try {
            const allAssociationsRes = await api.getDoctorHospitals();
            const allAssociations = Array.isArray(allAssociationsRes) ? allAssociationsRes : (allAssociationsRes.results || []);
            const myAssociations = allAssociations.filter(a => a.doctor === doctorId);

            const active = myAssociations.filter(a => a.is_accepted);
            const invites = myAssociations.filter(a => !a.is_accepted);
            setInvitations(invites);

            const transformedHospitals = active.map(assoc => ({
                id: assoc.hospital,
                name: assoc.hospital_name,
                assocId: assoc.doctor_instance_id,
                isAvailable: assoc.is_available
            }));
            setHospitals(transformedHospitals);

            if (transformedHospitals.length > 0) {
                if (!selectedHospital) setSelectedHospital(transformedHospitals[0]);
            }

            const allAppointmentsRes = await api.getAppointments(null, date);
            const allAppointments = Array.isArray(allAppointmentsRes) ? allAppointmentsRes : (allAppointmentsRes.results || []);
            const myAppointments = allAppointments.filter(apt => apt.doctor_details?.doctor === doctorId);

            const transformedApts = myAppointments.map(apt => ({
                id: apt.appointment_id,
                token: apt.token_no,
                patientName: apt.patient_details?.name || 'Unknown Patient',
                time: apt.appointment_date,
                status: apt.appointment_status,
                urgencyScore: apt.urgency_score,
                hospitalId: apt.doctor_details?.hospital
            }));

            transformedApts.sort((a, b) => {
                if (b.urgencyScore !== a.urgencyScore) return b.urgencyScore - a.urgencyScore;
                return a.token.localeCompare(b.token, undefined, { numeric: true });
            });

            setAppointments(transformedApts);
        } catch (error) {
            console.error("Failed to fetch doctor dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAvailability = async (assocId) => {
        try {
            const res = await api.toggleAvailability(assocId);
            if (res.status === 'updated') {
                setHospitals(prev => prev.map(h =>
                    h.assocId === assocId ? { ...h, isAvailable: res.is_available } : h
                ));
                if (selectedHospital && selectedHospital.assocId === assocId) {
                    setSelectedHospital(prev => ({ ...prev, isAvailable: res.is_available }));
                }
            }
        } catch (error) {
            console.error("Failed to toggle availability", error);
        }
    };

    const handleRespondInvite = async (assocId, status) => {
        try {
            await api.respondInvite(assocId, status);
            if (user) fetchData(user.doctor_id);
        } catch (error) {
            console.error(`Failed to ${status} invite`, error);
        }
    };

    const currentHospitalApts = selectedHospital
        ? appointments.filter(a => a.hospitalId === selectedHospital.id)
        : [];

    const pendingApts = currentHospitalApts.filter(a => a.status === 'Pending');
    const consultingApts = currentHospitalApts.filter(a => a.status === 'Consulting');
    const completedApts = currentHospitalApts.filter(a => a.status === 'Completed');

    const handleUpdateStatus = async (apptId, newStatus) => {
        try {
            await api.updateAppointmentStatus(apptId, newStatus);
            setAppointments(prev => prev.map(a =>
                a.id === apptId ? { ...a, status: newStatus } : a
            ));
        } catch (error) {
            console.error(`Failed to update status to ${newStatus}`, error);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex items-center gap-3 text-teal-600">
                <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600" />
                <span className="font-medium">Loading dashboard...</span>
            </div>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="card text-center max-w-md">
                <Stethoscope className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Access Denied</h3>
                <p className="text-gray-500 mt-2">Please log in as a doctor to view this dashboard.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Top Bar */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-16 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {hospitals.length > 0 ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 font-medium text-gray-700 transition-colors"
                                >
                                    <Building2 className="h-4 w-4 text-teal-600" />
                                    {selectedHospital?.name}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-elevated border border-gray-100 overflow-hidden z-50 animate-slide-down">
                                        {hospitals.map(hospital => (
                                            <div key={hospital.id} className="border-b border-gray-50 last:border-0">
                                                <button
                                                    onClick={() => { setSelectedHospital(hospital); setDropdownOpen(false); }}
                                                    className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${selectedHospital?.id === hospital.id ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                                >
                                                    <span className="font-medium">{hospital.name}</span>
                                                    {selectedHospital?.id === hospital.id && <CheckCircle className="h-4 w-4 text-teal-600" />}
                                                </button>
                                                <div className="px-4 pb-2 flex justify-between items-center text-xs">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className={`pulse-dot ${hospital.isAvailable ? 'green' : 'red'}`} />
                                                        {hospital.isAvailable ? 'Online' : 'Offline'}
                                                    </span>
                                                    <button onClick={(e) => { e.stopPropagation(); handleToggleAvailability(hospital.assocId); }}
                                                        className="text-teal-600 hover:underline font-medium">Toggle</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-gray-400 italic text-sm">No Active Hospitals</span>
                        )}

                        <div className="h-6 w-px bg-gray-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                {(user.doctor_name || 'D')[0]}
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{user.doctor_name || 'Doctor'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                            <Calendar className="h-4 w-4 text-teal-600" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
                            />
                        </div>

                        {selectedHospital && (
                            <button
                                onClick={() => handleToggleAvailability(selectedHospital.assocId)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedHospital.isAvailable
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                                    }`}
                            >
                                <Power className="h-4 w-4" />
                                {selectedHospital.isAvailable ? 'Available' : 'Unavailable'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="stat-card" style={{ '--glow-color': 'rgba(59,130,246,0.3)' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Queue</p>
                                <p className="text-3xl font-extrabold text-gray-900 mt-1">{pendingApts.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Consulting</p>
                                <p className="text-3xl font-extrabold text-gray-900 mt-1">{consultingApts.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Activity className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Completed</p>
                                <p className="text-3xl font-extrabold text-gray-900 mt-1">{completedApts.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-violet-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {selectedHospital ? (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* 1. Live Queue */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="pulse-dot green" />
                                    Live Queue
                                    <span className="badge badge-info">{pendingApts.length}</span>
                                </h2>
                            </div>

                            {pendingApts.length === 0 ? (
                                <div className="card text-center border-dashed py-12">
                                    <Clock className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-400 font-medium">Queue is empty</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingApts.map(apt => (
                                        <div key={apt.id} className={`card p-4 relative overflow-hidden ${apt.urgencyScore > 80 ? 'border-l-4 border-l-red-500' : ''}`}>
                                            {apt.urgencyScore > 80 && (
                                                <div className="absolute top-2 right-2">
                                                    <span className="badge badge-danger text-[10px]">URGENT</span>
                                                </div>
                                            )}
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${apt.urgencyScore > 80 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {apt.token}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{apt.patientName}</h3>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <Clock className="h-3 w-3" /> {apt.time}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleUpdateStatus(apt.id, 'Consulting')}
                                                className="w-full btn-primary py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm"
                                            >
                                                Call Patient <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. Consulting */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-emerald-500" />
                                    Consulting
                                    <span className="badge badge-success">{consultingApts.length}</span>
                                </h2>
                            </div>

                            {consultingApts.length === 0 ? (
                                <div className="card text-center border-dashed py-12">
                                    <Stethoscope className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-400 font-medium">No active consultation</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {consultingApts.map(apt => (
                                        <div key={apt.id} className="relative overflow-hidden rounded-2xl border-2 border-emerald-200 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm">
                                            <div className="absolute top-0 right-0 opacity-5">
                                                <Activity className="h-32 w-32 text-emerald-600" />
                                            </div>
                                            <div className="relative">
                                                <span className="badge badge-success mb-3">IN PROGRESS</span>
                                                <div className="flex items-center gap-4 mb-5">
                                                    <div className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100">
                                                        <span className="block text-[10px] text-gray-500 font-bold uppercase">Token</span>
                                                        <span className="text-2xl font-black text-emerald-700">{apt.token}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900">{apt.patientName}</h3>
                                                        <p className="text-gray-600 text-sm">General Checkup</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-200 hover:shadow-xl flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle className="h-5 w-5" /> Finish Consultation
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 3. Completed */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-violet-500" />
                                    Completed
                                    <span className="badge badge-purple">{completedApts.length}</span>
                                </h2>
                            </div>

                            {completedApts.length === 0 ? (
                                <div className="card text-center border-dashed py-12">
                                    <CheckCircle className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-400 font-medium">No completed appointments yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {completedApts.map(apt => (
                                        <div key={apt.id} className="card p-4 bg-gray-50/50 border-gray-100/50">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">{apt.token}</span>
                                                    <span className="font-medium text-gray-700">{apt.patientName}</span>
                                                </div>
                                                <span className="badge badge-purple text-[10px]">Done</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="card text-center py-16 max-w-lg mx-auto">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">No Hospitals Selected</h3>
                        <p className="text-gray-500 max-w-md mx-auto mt-2">You are not associated with any hospitals yet, or your invitations are pending.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
