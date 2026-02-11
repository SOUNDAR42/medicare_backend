
import React, { useState, useEffect } from 'react';
import { Users, Plus, Star, MoreVertical, Search, Mail, CheckCircle, XCircle, Clock, MapPin, Building2, Stethoscope, CalendarDays, Activity } from 'lucide-react';
import { api } from '../api';

const HospitalDashboard = () => {
    const [user, setUser] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [tab, setTab] = useState('roster');
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const [inviteForm, setInviteForm] = useState({
        doctorIdentifier: '',
        specializationId: '',
        fees: '',
        workingHours: ''
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.role === 'hospital') {
            setUser(storedUser);
            fetchData(storedUser.hospital_id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchData = async (hospitalId) => {
        try {
            const [assocsRes, specsRes, apptsRes] = await Promise.all([
                api.getDoctorHospitals(),
                api.getSpecializations(),
                api.getAppointments()
            ]);

            const allAssociations = Array.isArray(assocsRes) ? assocsRes : (assocsRes.results || []);
            const allSpecs = Array.isArray(specsRes) ? specsRes : (specsRes.results || []);
            const allAppts = Array.isArray(apptsRes) ? apptsRes : (apptsRes.results || []);

            setSpecializations(allSpecs);

            const hospitalAppts = allAppts.filter(ap => ap.doctor_details?.hospital === hospitalId || ap.doctor_details?.hospital_id === hospitalId);
            setAppointments(hospitalAppts);

            const myAssociations = allAssociations.filter(a => a.hospital === hospitalId);

            const roster = myAssociations.map(assoc => {
                const apptCount = allAppts.filter(ap =>
                    ap.doctor_details?.doctor === assoc.doctor &&
                    ap.doctor_details?.hospital === hospitalId &&
                    ap.appointment_status === 'Pending'
                ).length;

                return {
                    id: assoc.doctor_instance_id,
                    name: assoc.doctor_name,
                    specialization: assoc.specialization_name,
                    status: assoc.is_accepted ? (assoc.is_available ? 'Available' : 'Unavailable') : 'Pending',
                    isAccepted: assoc.is_accepted,
                    isAvailable: assoc.is_available,
                    fees: assoc.fees,
                    workingHours: assoc.working_hours,
                    appointmentCount: apptCount
                };
            });

            setDoctors(roster);

        } catch (error) {
            console.error("Failed to fetch hospital data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInviteSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.inviteDoctor({
                hospital_id: user.hospital_id,
                doctor_identifier: inviteForm.doctorIdentifier,
                specialization_id: inviteForm.specializationId,
                fees: inviteForm.fees,
                working_hours: inviteForm.workingHours
            });
            setIsInviteModalOpen(false);
            setInviteForm({ doctorIdentifier: '', specializationId: '', fees: '', workingHours: '' });
            fetchData(user.hospital_id);
            alert("Invitation sent successfully!");
        } catch (error) {
            console.error("Invite failed", error);
            alert("Failed to send invitation. Check Doctor ID/Mobile.");
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
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Access Denied</h3>
                <p className="text-gray-500 mt-2">Please log in as a hospital to view this dashboard.</p>
            </div>
        </div>
    );

    const pendingAppts = appointments.filter(a => a.appointment_status === 'Pending').length;
    const activeDoctors = doctors.filter(d => d.status === 'Available').length;

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-200">
                            <Building2 className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user.hospital_name}</h1>
                            <p className="text-sm text-gray-500">Manage your doctor roster and appointments</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="btn-primary flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5" /> Add Doctor
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Doctors</p>
                                <p className="text-3xl font-extrabold text-gray-900 mt-1">{doctors.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                                <Stethoscope className="h-6 w-6 text-teal-600" />
                            </div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active Now</p>
                                <p className="text-3xl font-extrabold text-gray-900 mt-1">{activeDoctors}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Activity className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending Appts</p>
                                <p className="text-3xl font-extrabold text-gray-900 mt-1">{pendingAppts}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Appts</p>
                                <p className="text-3xl font-extrabold text-gray-900 mt-1">{appointments.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                                <CalendarDays className="h-6 w-6 text-violet-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tab-container mb-6 w-fit">
                    <button onClick={() => setTab('roster')} className={`tab-item ${tab === 'roster' ? 'active' : ''}`}>
                        <Users className="h-4 w-4" /> Doctor Roster
                    </button>
                    <button onClick={() => setTab('appointments')} className={`tab-item ${tab === 'appointments' ? 'active' : ''}`}>
                        <CalendarDays className="h-4 w-4" /> Appointments
                    </button>
                </div>

                {/* Roster View */}
                {tab === 'roster' && (
                    <div className="card p-0 overflow-hidden animate-fade-in">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Users className="h-5 w-5 text-teal-600" /> Doctor Roster
                            </h2>
                            <span className="badge badge-info">{doctors.length} Doctors</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table-premium">
                                <thead>
                                    <tr>
                                        <th>Doctor Name</th>
                                        <th>Specialization</th>
                                        <th>Schedule</th>
                                        <th>Status</th>
                                        <th>Pending</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.length > 0 ? doctors.map((doc) => (
                                        <tr key={doc.id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                        {doc.name?.[0] || 'D'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{doc.name}</div>
                                                        <div className="text-xs text-gray-400">{doc.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge badge-info">{doc.specialization}</span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <Clock className="h-3.5 w-3.5 text-gray-400" /> {doc.workingHours}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`pulse-dot ${doc.status === 'Available' ? 'green' : doc.status === 'Pending' ? '' : 'red'}`} />
                                                    <span className={`badge ${doc.status === 'Available' ? 'badge-success' :
                                                            doc.status === 'Unavailable' ? 'badge-danger' :
                                                                'badge-warning'
                                                        }`}>
                                                        {doc.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${doc.appointmentCount > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-400'
                                                    }`}>
                                                    {doc.appointmentCount}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <button className="text-gray-400 hover:text-teal-600 p-2 rounded-lg hover:bg-teal-50 transition-colors">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center text-gray-400">
                                                No doctors associated yet. Click "Add Doctor" to invite.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Appointments View */}
                {tab === 'appointments' && (
                    <div className="card p-0 overflow-hidden animate-fade-in">
                        <div className="p-5 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-teal-600" /> Hospital Appointments
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table-premium">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Patient</th>
                                        <th>Assigned Doctor</th>
                                        <th>Token</th>
                                        <th>Urgency</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.length > 0 ? appointments.map((appt) => (
                                        <tr key={appt.appointment_id}>
                                            <td className="text-gray-700 font-medium">{appt.appointment_date}</td>
                                            <td>
                                                <div className="font-semibold text-gray-900">{appt.patient_details?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-400">{appt.patient_details?.mobileno}</div>
                                            </td>
                                            <td>
                                                <div className="font-semibold text-gray-900">{appt.doctor_details?.doctor_name || 'Unassigned'}</div>
                                                <div className="text-xs text-gray-400">{appt.doctor_details?.specialization_name}</div>
                                            </td>
                                            <td>
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 font-bold text-sm text-gray-700">
                                                    {appt.token_no}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${appt.urgency_score > 80 ? 'badge-danger' : 'badge-success'}`}>
                                                    {appt.urgency_score > 80 ? `🔴 ${appt.urgency_score}` : `🟢 ${appt.urgency_score}`}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${appt.appointment_status === 'Pending' ? 'badge-warning' :
                                                        appt.appointment_status === 'Completed' ? 'badge-success' :
                                                            appt.appointment_status === 'Consulting' ? 'badge-info' :
                                                                'badge-purple'
                                                    }`}>
                                                    {appt.appointment_status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center text-gray-400">No appointments found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-elevated w-full max-w-md overflow-hidden animate-slide-up border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-200">
                                    <Mail className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Invite Doctor</h3>
                            </div>
                            <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Doctor ID or Mobile No</label>
                                <input
                                    type="text"
                                    placeholder="e.g. DOC1 or 9876543210"
                                    className="input-modern"
                                    value={inviteForm.doctorIdentifier}
                                    onChange={e => setInviteForm({ ...inviteForm, doctorIdentifier: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization</label>
                                <select
                                    className="input-modern"
                                    value={inviteForm.specializationId}
                                    onChange={e => setInviteForm({ ...inviteForm, specializationId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Specialization</option>
                                    {specializations.map(s => (
                                        <option key={s.specialization_id} value={s.specialization_id}>{s.specialization_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Consultation Fees</label>
                                    <input
                                        type="number"
                                        placeholder="₹"
                                        className="input-modern"
                                        value={inviteForm.fees}
                                        onChange={e => setInviteForm({ ...inviteForm, fees: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Schedule</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 9AM - 5PM"
                                        className="input-modern"
                                        value={inviteForm.workingHours}
                                        onChange={e => setInviteForm({ ...inviteForm, workingHours: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full btn-primary py-3.5 rounded-xl mt-4">
                                Send Invitation
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospitalDashboard;
