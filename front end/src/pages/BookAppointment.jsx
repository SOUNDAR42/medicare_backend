
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle, XCircle, ArrowLeft, Clock, Stethoscope, Building2, Sparkles } from 'lucide-react';
import { api } from '../api';

const BookAppointment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { hospital, urgency } = location.state || {};

    const [bookingDate, setBookingDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookingSuccessData, setBookingSuccessData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!hospital) navigate('/patient/dashboard');
    }, [hospital, navigate]);

    const handleBook = async () => {
        if (!bookingDate) { setError("Please select a date."); return; }
        setError(null);
        setLoading(true);
        try {
            const patientMobile = localStorage.getItem('user_mobile') || '9876543210';
            const urgencyScore = urgency === 'High' ? 90 : (urgency === 'Medium' ? 60 : 30);
            const res = await api.bookHospitalAppointment({
                hospital_id: hospital.id,
                patient_mobile: patientMobile,
                appointment_date: bookingDate,
                urgency_score: urgencyScore
            });
            if (res.error) { setError(res.error); }
            else { setBookingSuccessData(res); }
        } catch (e) {
            console.error(e);
            setError("Booking failed. Please try again.");
        } finally { setLoading(false); }
    };

    if (!hospital) return null;

    // Success View
    if (bookingSuccessData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                </div>

                <div className="glass-card w-full max-w-md text-center p-8 animate-slide-up relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                        <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Appointment Confirmed!</h2>
                    <p className="text-gray-500 mb-8">Your appointment has been successfully booked.</p>

                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 text-left space-y-4 mb-8 border border-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <span className="text-gray-500 text-sm flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-teal-500" /> Token Number
                            </span>
                            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 text-2xl">
                                {bookingSuccessData.token_no}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <span className="text-gray-500 text-sm flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-violet-500" /> Doctor
                            </span>
                            <span className="font-semibold text-gray-900">{bookingSuccessData.doctor_details?.doctor_name}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <span className="text-gray-500 text-sm flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-blue-500" /> Hospital
                            </span>
                            <span className="font-semibold text-gray-900">{hospital.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-amber-500" /> Date
                            </span>
                            <span className="font-semibold text-gray-900">{bookingSuccessData.appointment_date}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/patient/dashboard', { state: { tab: 'appointments' } })}
                        className="w-full btn-primary py-3.5 rounded-xl"
                    >
                        View My Appointments
                    </button>
                </div>
            </div>
        );
    }

    // Booking Form
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob" />
                <div className="absolute bottom-20 -right-40 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
            </div>

            <div className="max-w-md mx-auto relative z-10 animate-slide-up">
                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white">
                        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Book Appointment</h1>
                            <p className="text-xs text-gray-400">Fill in the details below</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Hospital Details */}
                        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-5 rounded-2xl border border-teal-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-200">
                                    <Building2 className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">{hospital.name}</h3>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-600 ml-13">
                                <MapPin className="h-4 w-4 mt-0.5 text-teal-500 shrink-0" />
                                <span>{hospital.location}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Select Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="date"
                                    className="input-modern pl-12"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-gray-400">Only future dates are available for booking.</p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 text-sm border border-red-100">
                                <XCircle className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleBook}
                            disabled={loading}
                            className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    Booking...
                                </span>
                            ) : (
                                'Confirm Appointment'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
