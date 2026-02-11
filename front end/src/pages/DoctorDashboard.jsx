
import React, { useState, useEffect } from 'react';
import { ChevronDown, Users, Calendar, Activity, CheckCircle, Clock, Power, Bell, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../api';

const DoctorDashboard = () => {
    const [user, setUser] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.role === 'doctor') {
            setUser(storedUser);
            fetchData(storedUser.doctor_id);
        } else {
            // Redirect or handle unauth (for demo, maybe allow mock if no user)
            // console.error("No doctor logged in");
            // Fallback for demo if needed, or just let it fail gracefully
            setLoading(false);
        }
    }, []);

    const fetchData = async (doctorId) => {
        setLoading(true);
        try {
            // 1. Fetch Associations (Hospitals)
            // We need a way to filter associations by doctor_id. 
            // The API `getDoctorHospitals` calls `/api/associations/`. 
            // We should append `?doctor_id=...` if supported.
            // The viewset supports it.
            // Let's modify api.js slightly or just append query here manually if api.js is rigid?
            // api.js `getDoctorHospitals` doesn't take args. 
            // I'll assume for now I fetch all and filter in frontend (less efficient but safe) 
            // OR I can use a direct fetch or update api.js. 
            // Updating api.js is better. I'll do that in a separate step if needed, but for now filtering is fine.

            const allAssociationsRes = await api.getDoctorHospitals();
            const allAssociations = Array.isArray(allAssociationsRes) ? allAssociationsRes : (allAssociationsRes.results || []);
            const myAssociations = allAssociations.filter(a => a.doctor === doctorId); // 'doctor' is the ID in serializer

            // Separate Invitations vs Active
            const active = myAssociations.filter(a => a.is_accepted);
            const invites = myAssociations.filter(a => !a.is_accepted);

            setInvitations(invites);

            // Transform Active Hospitals
            const transformedHospitals = active.map(assoc => ({
                id: assoc.hospital, // Hospital ID
                name: assoc.hospital_name,
                assocId: assoc.doctor_instance_id,
                isAvailable: assoc.is_available
            }));
            setHospitals(transformedHospitals);

            if (transformedHospitals.length > 0) {
                // Default to first if not selected
                if (!selectedHospital) setSelectedHospital(transformedHospitals[0]);
            }

            // 2. Fetch Appointments
            // Ideally filter by doctor_id
            const allAppointmentsRes = await api.getAppointments();
            const allAppointments = Array.isArray(allAppointmentsRes) ? allAppointmentsRes : (allAppointmentsRes.results || []);
            const myAppointments = allAppointments.filter(apt => apt.doctor_details?.doctor === doctorId);

            // Transform
            const transformedApts = myAppointments.map(apt => ({
                id: apt.appointment_id,
                token: apt.token_no,
                patientName: apt.patient_details?.name || 'Unknown Patient',
                time: apt.appointment_date,
                status: apt.appointment_status,
                urgencyScore: apt.urgency_score,
                hospitalId: apt.doctor_details?.hospital
            }));

            // Create "Urgency Queue": Sort by Urgency (Desc) then Token (Asc)
            // Urgency > 80 is High
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
                // If selected hospital, update it too
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
            // Refresh Data
            if (user) fetchData(user.doctor_id);
        } catch (error) {
            console.error(`Failed to ${status} invite`, error);
        }
    };


    // Derived State
    const currentHospitalApts = selectedHospital
        ? appointments.filter(a => a.hospitalId === selectedHospital.id)
        : [];

    const pendingApts = currentHospitalApts.filter(a => a.status === 'Pending');
    const consultingApts = currentHospitalApts.filter(a => a.status === 'Consulting');
    const completedApts = currentHospitalApts.filter(a => a.status === 'Completed');

    const handleUpdateStatus = async (apptId, newStatus) => {
        try {
            await api.updateAppointmentStatus(apptId, newStatus);
            // Optimistic update or refetch
            setAppointments(prev => prev.map(a =>
                a.id === apptId ? { ...a, status: newStatus } : a
            ));
        } catch (error) {
            console.error(`Failed to update status to ${newStatus}`, error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
    if (!user) return <div className="p-8 text-center">Please log in to view dashboard.</div>;

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {hospitals.length > 0 ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 font-medium text-gray-700 transition-colors"
                                >
                                    <BuildingIcon className="h-4 w-4 text-gray-500" />
                                    {selectedHospital?.name}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                                        {hospitals.map(hospital => (
                                            <div key={hospital.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <button
                                                    onClick={() => {
                                                        setSelectedHospital(hospital);
                                                        setDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 flex items-center justify-between ${selectedHospital?.id === hospital.id ? 'bg-blue-50 text-primary' : 'text-gray-700'}`}
                                                >
                                                    <span>{hospital.name}</span>
                                                    {selectedHospital?.id === hospital.id && <CheckCircle className="h-4 w-4" />}
                                                </button>
                                                <div className="px-4 pb-2 flex justify-between items-center text-xs">
                                                    <span className={hospital.isAvailable ? 'text-green-600' : 'text-gray-400'}>
                                                        {hospital.isAvailable ? '● Online' : '○ Offline'}
                                                    </span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleToggleAvailability(hospital.assocId); }}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Toggle
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-gray-500 italic">No Active Hospitals</span>
                        )}

                        <span className="text-sm text-gray-400">|</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{user.doctor_name || 'Doctor'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Toggle Availability for Selected */}
                        {selectedHospital && (
                            <button
                                onClick={() => handleToggleAvailability(selectedHospital.assocId)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedHospital.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
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
                {selectedHospital ? (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* 1. Live Queue */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    Live Queue <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">{pendingApts.length}</span>
                                </h2>
                            </div>

                            {pendingApts.length === 0 ? (
                                <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500">Queue is empty</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingApts.map(apt => (
                                        <div key={apt.id} className={`bg-white p-4 rounded-xl border shadow-sm ${apt.urgencyScore > 80 ? 'border-l-4 border-l-red-500' : 'border-gray-100'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className={`text-2xl font-bold block ${apt.urgencyScore > 80 ? 'text-red-500' : 'text-gray-900'}`}>{apt.token}</span>
                                                    <h3 className="font-semibold text-gray-900">{apt.patientName}</h3>
                                                </div>
                                                {apt.urgencyScore > 80 && (
                                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {apt.time}
                                            </div>
                                            <button
                                                onClick={() => handleUpdateStatus(apt.id, 'Consulting')}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                                Call Patient <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. Consulting */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    Consulting <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm">{consultingApts.length}</span>
                                </h2>
                            </div>

                            {consultingApts.length === 0 ? (
                                <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500">No active consultation</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {consultingApts.map(apt => (
                                        <div key={apt.id} className="bg-green-50 p-6 rounded-xl border-2 border-green-200 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                                <Activity className="h-24 w-24 text-green-600" />
                                            </div>

                                            <div className="relative z-10">
                                                <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">IN PROGRESS</span>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                                        <span className="block text-xs text-gray-500 font-bold uppercase">Token</span>
                                                        <span className="text-2xl font-black text-green-700">{apt.token}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900">{apt.patientName}</h3>
                                                        <p className="text-gray-600 text-sm">General Checkup</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
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
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    Completed <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm">{completedApts.length}</span>
                                </h2>
                            </div>

                            {completedApts.length === 0 ? (
                                <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500">No completed appointments yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3 opacity-75">
                                    {completedApts.map(apt => (
                                        <div key={apt.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center">
                                            <div>
                                                <span className="text-lg font-bold text-gray-700 mr-3">{apt.token}</span>
                                                <span className="font-medium text-gray-900">{apt.patientName}</span>
                                            </div>
                                            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">Done</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No Hospitals Selected</h3>
                        <p className="text-gray-500 max-w-md mx-auto mt-2">You are not associated with any hospitals yet, or your invitations are pending.</p>
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
