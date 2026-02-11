
import React, { useState, useEffect } from 'react';
import { Users, Plus, Star, MoreVertical, Search, Mail, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';
import { api } from '../api';

const HospitalDashboard = () => {
    const [user, setUser] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [tab, setTab] = useState('roster'); // 'roster' | 'appointments'
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    // Invite Form
    const [inviteForm, setInviteForm] = useState({
        doctorIdentifier: '', // ID or Mobile
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

            // Filter appointments for this hospital (Client-side filtering for now as getAppointments returns all)
            // Or better, we could call getHospitalAppointments if we want server-side.
            // But since getAppointments is already called, let's filter.
            // Check if appt has doctor_details with hospital info
            const hospitalAppts = allAppts.filter(ap => ap.doctor_details?.hospital === hospitalId || ap.doctor_details?.hospital_id === hospitalId);
            setAppointments(hospitalAppts);

            // Filter for this hospital
            const myAssociations = allAssociations.filter(a => a.hospital === hospitalId);

            // Transform to Roster
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
            fetchData(user.hospital_id); // Refresh
            alert("Invitation sent successfully!");
        } catch (error) {
            console.error("Invite failed", error);
            alert("Failed to send invitation. Check Doctor ID/Mobile.");
        }
    };

    if (loading) return <div className="p-8 text-center pt-20">Loading...</div>;
    if (!user) return <div className="p-8 text-center pt-20">Please log in as a hospital.</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user.hospital_name} Dashboard</h1>
                        <p className="text-gray-500">Manage your doctor roster and appointments</p>
                    </div>
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="btn-primary flex items-center justify-center gap-2 px-6 py-3 shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="h-5 w-5" /> Add Doctor
                    </button>
                </div>

                {/* Tabs (Simple Toggle for now, or just stack them) - Let's use a Tab system if asked, 
                    but user said "add a another page" which usually implies a view/tab. 
                    I'll add a Tab switcher.
                */}

                <div className="flex space-x-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setTab('roster')}
                        className={`pb-3 px-4 font-medium transition-colors ${tab === 'roster' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Doctor Roster
                    </button>
                    <button
                        onClick={() => setTab('appointments')}
                        className={`pb-3 px-4 font-medium transition-colors ${tab === 'appointments' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Appointments
                    </button>
                </div>

                {/* Roster View */}
                {tab === 'roster' && (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Users className="h-5 w-5 text-gray-500" /> Doctor Roster
                            </h2>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                {doctors.length} Doctors
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Doctor Name</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Specialization</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Schedule</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Pending Appts</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.length > 0 ? doctors.map((doc) => (
                                        <tr key={doc.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{doc.name}</div>
                                                <div className="text-xs text-gray-500">ID: {doc.id}</div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-700">{doc.specialization}</td>
                                            <td className="py-4 px-6 text-gray-700">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Clock className="h-3 w-3 text-gray-400" /> {doc.workingHours}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${doc.status === 'Available' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    doc.status === 'Unavailable' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                                                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                    }`}>
                                                    {doc.status === 'Available' && <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>}
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-medium text-gray-900">{doc.appointmentCount}</span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center text-gray-500">
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
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-gray-500" /> Hospital Appointments
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Assigned Doctor</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Token</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Urgency</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.length > 0 ? appointments.map((appt) => (
                                        <tr key={appt.appointment_id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-4 px-6 text-gray-700">{appt.appointment_date}</td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{appt.patient_details?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">{appt.patient_details?.mobileno}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{appt.doctor_details?.doctor_name || 'Unassigned'}</div>
                                                <div className="text-xs text-gray-500">{appt.doctor_details?.specialization_name}</div>
                                            </td>
                                            <td className="py-4 px-6 font-mono text-gray-700">{appt.token_no}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${appt.urgency_score > 80 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {appt.urgency_score}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${appt.appointment_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {appt.appointment_status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center text-gray-500">No appointments found.</td>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Invite Doctor</h3>
                            <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID or Mobile No</label>
                                <input
                                    type="text"
                                    placeholder="e.g. DOC1 or 9876543210"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary"
                                    value={inviteForm.doctorIdentifier}
                                    onChange={e => setInviteForm({ ...inviteForm, doctorIdentifier: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fees</label>
                                    <input
                                        type="number"
                                        placeholder="₹"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary"
                                        value={inviteForm.fees}
                                        onChange={e => setInviteForm({ ...inviteForm, fees: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 9AM - 5PM"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary"
                                        value={inviteForm.workingHours}
                                        onChange={e => setInviteForm({ ...inviteForm, workingHours: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full btn-primary py-3 rounded-xl mt-4">
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
