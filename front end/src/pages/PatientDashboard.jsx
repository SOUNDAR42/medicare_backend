

import React, { useState, useEffect } from 'react';
import { Filter, DollarSign, MapPin, AlertCircle, Calendar, Pill, Search, User, Clock, CheckCircle, XCircle, ArrowRight, Activity, Sparkles } from 'lucide-react';
import EntityCard from '../components/common/EntityCard';
import SymptomChecker from '../components/features/SymptomChecker';
import { api } from '../api';
import { useNavigate, useLocation } from 'react-router-dom';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'find-care');

    const [urgency, setUrgency] = useState(null);
    const [bookingStep, setBookingStep] = useState('urgency');
    const [preference, setPreference] = useState('distance');
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);

    const [selectedHospital, setSelectedHospital] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingSuccessData, setBookingSuccessData] = useState(null);

    const [appointments, setAppointments] = useState([]);
    const [loadingAppts, setLoadingAppts] = useState(false);

    const [medSearch, setMedSearch] = useState({ name: '', pincode: '' });
    const [medResults, setMedResults] = useState([]);
    const [loadingMeds, setLoadingMeds] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (activeTab === 'appointments') fetchAppointments();
    }, [activeTab]);

    const fetchDashboardData = async () => {
        try {
            const [docsData, hospsData] = await Promise.all([
                api.getDoctorHospitals(),
                api.getHospitals()
            ]);

            const doctorsList = Array.isArray(docsData) ? docsData : (docsData.results || []);
            const transformedDoctors = doctorsList.map(d => ({
                id: d.doctor_instance_id,
                name: d.doctor_name || 'Unknown Doctor',
                specialization: d.specialization_name || 'General',
                hospital: d.hospital_name || 'Unknown Hospital',
                fees: parseInt(d.fees) || 0,
                distance: Math.floor(Math.random() * 10) + 1,
                nextAvailable: 'Today',
                rating: 4.5
            }));
            setDoctors(transformedDoctors);

            const hospitalsList = Array.isArray(hospsData) ? hospsData : (hospsData.results || []);
            const transformedHospitals = hospitalsList.map(h => ({
                id: h.hospital_id,
                name: h.hospital_name,
                location: `${h.street || ''}, ${h.district || ''}, ${h.state || ''}`.replace(/^, /, '').replace(/, $/, ''),
                distance: Math.floor(Math.random() * 10) + 1,
                availableBeds: Math.floor(Math.random() * 20),
                rating: 4.0
            }));
            setHospitals(transformedHospitals);

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointments = async () => {
        setLoadingAppts(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const patientMobile = user?.mobileno;
            const data = await api.getAppointments(patientMobile);
            setAppointments(data);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        } finally {
            setLoadingAppts(false);
        }
    };

    const handleMedicineSearch = async (e) => {
        e.preventDefault();
        setLoadingMeds(true);
        try {
            const data = await api.searchPharmacyStock({
                medicine_name: medSearch.name,
                pincode: medSearch.pincode
            });
            setMedResults(data.results || data);
        } catch (error) {
            console.error("Failed to search medicines", error);
        } finally {
            setLoadingMeds(false);
        }
    };

    // --- Tabs ---
    const tabs = [
        { id: 'find-care', label: 'Find Care', icon: User },
        { id: 'appointments', label: 'My Appointments', icon: Calendar },
        { id: 'medicines', label: 'Medicine Finder', icon: Pill },
    ];

    const renderTabs = () => (
        <div className="tab-container mb-8 w-fit">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                </button>
            ))}
        </div>
    );

    const renderFindCare = () => {
        const getUrgencyConfig = () => {
            switch (urgency) {
                case 'High': return { bg: 'from-red-50 to-rose-50', border: 'border-red-200', text: 'text-red-800', icon: 'bg-red-100', badge: 'badge-danger' };
                case 'Medium': return { bg: 'from-amber-50 to-yellow-50', border: 'border-amber-200', text: 'text-amber-800', icon: 'bg-amber-100', badge: 'badge-warning' };
                case 'Low': return { bg: 'from-emerald-50 to-green-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: 'bg-emerald-100', badge: 'badge-success' };
                default: return {};
            }
        };

        const cfg = getUrgencyConfig();

        const hospitalCosts = doctors.reduce((acc, doc) => {
            const hospName = doc.hospital;
            if (!acc[hospName]) acc[hospName] = { total: 0, count: 0 };
            acc[hospName].total += doc.fees;
            acc[hospName].count += 1;
            return acc;
        }, {});

        const hospitalsWithCost = hospitals.map(h => ({
            ...h,
            avgCost: hospitalCosts[h.name] ? Math.round(hospitalCosts[h.name].total / hospitalCosts[h.name].count) : 0,
            doctorCount: hospitalCosts[h.name] ? hospitalCosts[h.name].count : 0
        })).filter(h => h.doctorCount > 0);

        const sortedHospitals = [...hospitalsWithCost].sort((a, b) => {
            if (preference === 'cost') {
                if (a.avgCost === 0) return 1;
                if (b.avgCost === 0) return -1;
                return a.avgCost - b.avgCost;
            }
            return a.distance - b.distance;
        });

        return (
            <div className="animate-fade-in">
                {!urgency ? (
                    <div className="max-w-3xl mx-auto pt-4">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello, how can we help you today?</h1>
                            <p className="text-gray-500">Describe your symptoms and we'll guide you to the right care</p>
                        </div>
                        <SymptomChecker onComplete={(level) => {
                            setUrgency(level);
                            setBookingStep('prompt');
                        }} />
                    </div>
                ) : (
                    <>
                        {/* Urgency Banner */}
                        <div className={`relative overflow-hidden p-6 rounded-2xl border mb-8 bg-gradient-to-r ${cfg.bg} ${cfg.border}`}>
                            <div className="absolute right-0 top-0 bottom-0 w-40 opacity-10">
                                <Activity className="w-full h-full" />
                            </div>
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 ${cfg.icon} rounded-xl`}>
                                        <AlertCircle className={`h-6 w-6 ${cfg.text}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className={`text-xl font-bold ${cfg.text}`}>Urgency: {urgency}</h2>
                                            <span className={`badge ${cfg.badge}`}>{urgency}</span>
                                        </div>
                                        <p className={`${cfg.text} opacity-80`}>
                                            {urgency === 'High' ? 'We recommend immediate specialist consultation' : 'We recommend consulting a doctor soon'}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => { setUrgency(null); setBookingStep('urgency'); }}
                                    className={`text-sm font-medium ${cfg.text} underline decoration-dotted hover:opacity-80 transition-opacity`}>
                                    Retake
                                </button>
                            </div>
                        </div>

                        {/* Step 2: Prompt */}
                        {bookingStep === 'prompt' && (
                            <div className="card max-w-lg mx-auto text-center animate-slide-up">
                                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
                                    <Sparkles className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Would you like to book an appointment?</h3>
                                <p className="text-gray-500 mb-8">We'll find the best hospitals and doctors based on your needs.</p>
                                <div className="flex gap-4 justify-center">
                                    <button onClick={() => setUrgency(null)}
                                        className="btn-secondary">
                                        Not now
                                    </button>
                                    <button onClick={() => setBookingStep('preference')}
                                        className="btn-primary flex items-center gap-2">
                                        Yes, find care <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Preference */}
                        {bookingStep === 'preference' && (
                            <div className="card max-w-lg mx-auto text-center animate-slide-up">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">How would you like to choose?</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => { setPreference('distance'); setBookingStep('results'); }}
                                        className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-teal-300 hover:bg-teal-50/30 transition-all text-left"
                                    >
                                        <div className="bg-gradient-to-br from-teal-500 to-emerald-500 p-3 rounded-xl w-fit mb-4 shadow-lg shadow-teal-200 group-hover:scale-110 transition-transform">
                                            <MapPin className="h-6 w-6 text-white" />
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-1">Short Distance</h4>
                                        <p className="text-sm text-gray-500">Find nearest hospitals to you</p>
                                    </button>
                                    <button
                                        onClick={() => { setPreference('cost'); setBookingStep('results'); }}
                                        className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-violet-300 hover:bg-violet-50/30 transition-all text-left"
                                    >
                                        <div className="bg-gradient-to-br from-violet-500 to-purple-500 p-3 rounded-xl w-fit mb-4 shadow-lg shadow-violet-200 group-hover:scale-110 transition-transform">
                                            <DollarSign className="h-6 w-6 text-white" />
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-1">Cost Efficient</h4>
                                        <p className="text-sm text-gray-500">Find affordable consultation fees</p>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Results */}
                        {bookingStep === 'results' && (
                            <div className="animate-slide-up">
                                <div className="mb-6 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                        Suggested Hospitals
                                        <span className="badge badge-info">
                                            Sorted by {preference === 'cost' ? 'Cost' : 'Distance'}
                                        </span>
                                    </h2>
                                    <button onClick={() => setBookingStep('preference')} className="text-teal-600 text-sm font-semibold hover:underline">
                                        Change Preference
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {sortedHospitals.length > 0 ? sortedHospitals.map(hosp => (
                                        <EntityCard
                                            key={hosp.id}
                                            type="hospital"
                                            data={hosp}
                                            onAction={() => {
                                                navigate('/patient/book_appointment', {
                                                    state: { hospital: hosp, urgency: urgency }
                                                });
                                            }}
                                        />
                                    )) : (
                                        <div className="text-center p-12 card border-dashed">
                                            <p className="text-gray-500">No hospitals found matching your criteria.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    const renderAppointments = () => {
        const pending = appointments.filter(a => a.appointment_status === 'Pending');
        const history = appointments.filter(a => a.appointment_status !== 'Pending');

        const statusConfig = {
            'Pending': 'badge-warning',
            'Consulting': 'badge-info',
            'Completed': 'badge-success',
            'Cancelled': 'badge-danger',
        };

        const ApptRow = ({ appt }) => (
            <tr className="border-b border-gray-50 last:border-0 hover:bg-teal-50/30 transition-colors">
                <td className="py-4 px-5">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm ${appt.urgency_score > 80 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {appt.token_no}
                    </span>
                </td>
                <td className="py-4 px-5 text-gray-700 font-medium">{appt.appointment_date}</td>
                <td className="py-4 px-5">
                    <div className="font-semibold text-gray-900">{appt.doctor_details?.doctor_name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{appt.doctor_details?.specialization_name} · {appt.doctor_details?.hospital_name}</div>
                </td>
                <td className="py-4 px-5">
                    <span className={`badge ${appt.urgency_score > 80 ? 'badge-danger' : 'badge-success'}`}>
                        {appt.urgency_score > 80 ? 'Urgent' : 'Routine'}
                    </span>
                </td>
                <td className="py-4 px-5">
                    <span className={`badge ${statusConfig[appt.appointment_status] || 'badge-info'}`}>
                        {appt.appointment_status}
                    </span>
                </td>
            </tr>
        );

        const renderTable = (title, icon, iconColor, data, emptyMsg) => (
            <section className="animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    {React.createElement(icon, { className: `h-5 w-5 ${iconColor}` })} {title}
                    <span className="badge badge-info ml-1">{data.length}</span>
                </h3>
                <div className="card p-0 overflow-hidden">
                    <table className="table-premium">
                        <thead>
                            <tr>
                                <th>Token</th>
                                <th>Date</th>
                                <th>Doctor</th>
                                <th>Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingAppts ? <tr><td colSpan="5" className="p-6 text-center text-gray-400">Loading...</td></tr> :
                                data.length > 0 ? data.map(a => <ApptRow key={a.appointment_id} appt={a} />) :
                                    <tr><td colSpan="5" className="p-10 text-center text-gray-400">{emptyMsg}</td></tr>}
                        </tbody>
                    </table>
                </div>
            </section>
        );

        return (
            <div className="space-y-8">
                {renderTable('Pending Appointments', Clock, 'text-amber-500', pending, 'No pending appointments.')}
                {renderTable('History', CheckCircle, 'text-emerald-500', history, 'No appointment history.')}
            </div>
        );
    };

    const renderMedicineFinder = () => (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-200">
                        <Search className="h-5 w-5 text-white" />
                    </div>
                    Find Medicines
                </h2>
                <form onSubmit={handleMedicineSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Medicine Name (e.g. Paracetamol)"
                        className="input-modern"
                        value={medSearch.name}
                        onChange={e => setMedSearch({ ...medSearch, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Pincode (Optional)"
                        className="input-modern"
                        value={medSearch.pincode}
                        onChange={e => setMedSearch({ ...medSearch, pincode: e.target.value })}
                    />
                    <button type="submit" disabled={loadingMeds} className="btn-primary flex items-center justify-center gap-2">
                        {loadingMeds ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <Search className="h-4 w-4" />
                                Search
                            </>
                        )}
                    </button>
                </form>
            </div>

            {medResults.length > 0 && (
                <div className="card p-0 overflow-hidden">
                    <table className="table-premium">
                        <thead>
                            <tr>
                                <th>Pharmacy</th>
                                <th>Medicine</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medResults.map((stock, idx) => (
                                <tr key={idx}>
                                    <td className="font-semibold text-gray-900">{stock.pharmacy_name || 'Unknown'}</td>
                                    <td className="text-gray-700">{stock.medicine_name || medSearch.name}</td>
                                    <td>
                                        <span className="font-bold text-emerald-600">₹{stock.price}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${stock.stock > 10 ? 'badge-success' : 'badge-danger'}`}>
                                            {stock.stock} Left
                                        </span>
                                    </td>
                                    <td className="text-sm text-gray-500">{stock.pharmacy_location || 'Local'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex items-center gap-3 text-teal-600">
                <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600" />
                <span className="font-medium">Loading dashboard...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderTabs()}
                {activeTab === 'find-care' && renderFindCare()}
                {activeTab === 'appointments' && renderAppointments()}
                {activeTab === 'medicines' && renderMedicineFinder()}
            </div>
        </div>
    );
};

export default PatientDashboard;
