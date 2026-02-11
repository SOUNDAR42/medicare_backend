

import React, { useState, useEffect } from 'react';
import { Filter, DollarSign, MapPin, AlertCircle, Calendar, Pill, Search, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import EntityCard from '../components/common/EntityCard';
import SymptomChecker from '../components/features/SymptomChecker';
import { api } from '../api';

import { useNavigate, useLocation } from 'react-router-dom';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'find-care'); // 'find-care' | 'appointments' | 'medicines'

    // Care Finder State
    const [urgency, setUrgency] = useState(null);
    const [bookingStep, setBookingStep] = useState('urgency'); // urgency -> prompt -> preference -> results
    const [preference, setPreference] = useState('distance');
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);

    // Booking Confirmation State
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingSuccessData, setBookingSuccessData] = useState(null);

    // Appointments State
    const [appointments, setAppointments] = useState([]);
    const [loadingAppts, setLoadingAppts] = useState(false);

    // Medicine Finder State
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
                distance: Math.floor(Math.random() * 10) + 1, // Mock
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
            // Get logged-in user
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

    // --- Render Helpers ---

    const renderTabs = () => (
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
            <button
                onClick={() => setActiveTab('find-care')}
                className={`pb-4 px-4 font-medium transition-colors flex items-center gap-2 ${activeTab === 'find-care' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <User className="h-5 w-5" /> Find Care
            </button>
            <button
                onClick={() => setActiveTab('appointments')}
                className={`pb-4 px-4 font-medium transition-colors flex items-center gap-2 ${activeTab === 'appointments' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Calendar className="h-5 w-5" /> My Appointments
            </button>
            <button
                onClick={() => setActiveTab('medicines')}
                className={`pb-4 px-4 font-medium transition-colors flex items-center gap-2 ${activeTab === 'medicines' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Pill className="h-5 w-5" /> Medicine Finder
            </button>
        </div>
    );

    const renderFindCare = () => {
        const getUrgencyColor = () => {
            switch (urgency) {
                case 'High': return 'bg-red-100 text-red-800 border-red-200';
                case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                case 'Low': return 'bg-green-100 text-green-800 border-green-200';
                default: return 'bg-gray-100 text-gray-800';
            }
        };

        // Prepare sorted lists
        // 1. Calculate Average Cost per Hospital from Doctors List
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
        })).filter(h => h.doctorCount > 0); // Filter out hospitals with no doctors

        const sortedHospitals = [...hospitalsWithCost].sort((a, b) => {
            if (preference === 'cost') {
                // If 0, put at end? or start (assume cheap)? Let's put at end if cost unknown.
                if (a.avgCost === 0) return 1;
                if (b.avgCost === 0) return -1;
                return a.avgCost - b.avgCost;
            }
            return a.distance - b.distance;
        });

        return (
            <div className="animate-in fade-in duration-500">
                {!urgency ? (
                    <div className="max-w-3xl mx-auto pt-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Hello, how can we help you today?</h1>
                        <SymptomChecker onComplete={(level) => {
                            setUrgency(level);
                            setBookingStep('prompt');
                        }} />
                    </div>
                ) : (
                    <>
                        {/* Urgency Prompt */}
                        <div className={`p-6 rounded-2xl border mb-8 flex items-center justify-between ${getUrgencyColor()}`}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/50 rounded-full"><AlertCircle className="h-6 w-6" /></div>
                                <div>
                                    <h2 className="text-xl font-bold">Urgency Assessed: {urgency}</h2>
                                    <p className="opacity-90">Based on your symptoms, we recommend consulting a {urgency === 'High' ? 'specialist immediately' : 'doctor soon'}.</p>
                                </div>
                            </div>
                            <button onClick={() => { setUrgency(null); setBookingStep('urgency'); }} className="text-sm underline font-medium hover:opacity-80">Retake Assessment</button>
                        </div>

                        {/* Step 2: Prompt to Book */}
                        {bookingStep === 'prompt' && (
                            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center max-w-lg mx-auto">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Would you like to book an appointment?</h3>
                                <p className="text-gray-500 mb-8">We can help you find the best care based on your needs.</p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => setUrgency(null)}
                                        className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        No, just satisfied
                                    </button>
                                    <button
                                        onClick={() => setBookingStep('preference')}
                                        className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                                    >
                                        Yes, find care
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Preference Selection */}
                        {bookingStep === 'preference' && (
                            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center max-w-lg mx-auto">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">How would you like to choose?</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => { setPreference('distance'); setBookingStep('results'); }}
                                        className="p-6 rounded-xl border-2 border-gray-100 hover:border-primary hover:bg-blue-50 transition-all group text-left"
                                    >
                                        <div className="bg-blue-100 p-3 rounded-full w-fit mb-4 group-hover:bg-blue-200 transition-colors">
                                            <MapPin className="h-6 w-6 text-primary" />
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-1">Short Distance</h4>
                                        <p className="text-sm text-gray-500">Find nearest hospitals to your location</p>
                                    </button>

                                    <button
                                        onClick={() => { setPreference('cost'); setBookingStep('results'); }}
                                        className="p-6 rounded-xl border-2 border-gray-100 hover:border-primary hover:bg-blue-50 transition-all group text-left"
                                    >
                                        <div className="bg-green-100 p-3 rounded-full w-fit mb-4 group-hover:bg-green-200 transition-colors">
                                            <DollarSign className="h-6 w-6 text-green-700" />
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-1">Cost Efficient</h4>
                                        <p className="text-sm text-gray-500">Find affordable consultation fees</p>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Results (Hospitals Only) */}
                        {bookingStep === 'results' && (
                            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                                <div className="mb-6 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Suggested Hospitals
                                        <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                            Sorted by {preference === 'cost' ? 'Cost' : 'Distance'}
                                        </span>
                                    </h2>
                                    <button onClick={() => setBookingStep('preference')} className="text-primary text-sm font-medium hover:underline">Change Preference</button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {sortedHospitals.length > 0 ? sortedHospitals.map(hosp => (
                                        <EntityCard
                                            key={hosp.id}
                                            type="hospital"
                                            data={hosp}
                                            onAction={() => {
                                                navigate('/patient/book_appointment', {
                                                    state: {
                                                        hospital: hosp,
                                                        urgency: urgency
                                                    }
                                                });
                                            }}
                                        />
                                    )) : (
                                        <div className="text-center p-12 bg-white rounded-2xl border border-gray-200">
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

        const ApptRow = ({ appt }) => (
            <tr className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">{appt.token_no}</td>
                <td className="py-4 px-4 text-gray-700">{appt.appointment_date}</td>
                <td className="py-4 px-4 text-gray-700">
                    <div className="font-medium text-gray-900">{appt.doctor_details?.doctor_name}</div>
                    <div className="text-xs text-gray-500">{appt.doctor_details?.specialization_name} - {appt.doctor_details?.hospital_name}</div>
                </td>
                <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${appt.urgency_score > 80 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                        {appt.urgency_score > 80 ? 'Urgent' : 'Routine'}
                    </span>
                </td>
                <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${appt.appointment_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        appt.appointment_status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {appt.appointment_status}
                    </span>
                </td>
            </tr>
        );

        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-500" /> Pending Appointments
                    </h3>
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Token</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingAppts ? <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr> :
                                    pending.length > 0 ? pending.map(a => <ApptRow key={a.appointment_id} appt={a} />) :
                                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">No pending appointments.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-500" /> History
                    </h3>
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Token</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingAppts ? <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr> :
                                    history.length > 0 ? history.map(a => <ApptRow key={a.appointment_id} appt={a} />) :
                                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">No appointment history.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        );
    };

    const renderMedicineFinder = () => (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Search className="h-6 w-6 text-primary" /> Find Medicines
                </h2>
                <form onSubmit={handleMedicineSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Medicine Name (e.g. Paracetamol)"
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={medSearch.name}
                        onChange={e => setMedSearch({ ...medSearch, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Pincode (Optional)"
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={medSearch.pincode}
                        onChange={e => setMedSearch({ ...medSearch, pincode: e.target.value })}
                    />
                    <button type="submit" disabled={loadingMeds} className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
                        {loadingMeds ? 'Searching...' : 'Search Inventory'}
                    </button>
                </form>
            </div>

            {medResults.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Pharmacy</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Medicine</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medResults.map((stock, idx) => (
                                <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="py-4 px-4 font-medium text-gray-900">{stock.pharmacy_name || 'Unknown'}</td>
                                    <td className="py-4 px-4 text-gray-700">{stock.medicine_name || medSearch.name}</td>
                                    <td className="py-4 px-4 font-medium text-green-600">₹{stock.price}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${stock.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {stock.stock} Left
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500">{stock.pharmacy_location || 'Local'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    if (loading) return <div className="p-8 text-center">Loading...</div>;

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
