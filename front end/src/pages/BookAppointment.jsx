
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, User, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { api } from '../api';

const BookAppointment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { hospital, urgency } = location.state || {}; // Expect hospital object and urgency string

    const [bookingDate, setBookingDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookingSuccessData, setBookingSuccessData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!hospital) {
            // Redirect if accessed directly without state
            navigate('/patient/dashboard');
        }
    }, [hospital, navigate]);

    const handleBook = async () => {
        if (!bookingDate) {
            setError("Please select a date.");
            return;
        }
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

            if (res.error) {
                setError(res.error);
            } else {
                setBookingSuccessData(res);
            }
        } catch (e) {
            console.error(e);
            setError("Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!hospital) return null; // Or a loading spinner while redirecting

    if (bookingSuccessData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-center p-8 animate-in fade-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
                    <p className="text-gray-500 mb-6">Your appointment has been successfully booked.</p>

                    <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-8">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500 text-sm">Token Number</span>
                            <span className="font-mono font-bold text-primary text-lg">{bookingSuccessData.token_no}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500 text-sm">Assigned Doctor</span>
                            <span className="font-medium text-gray-900 text-right">{bookingSuccessData.doctor_details?.doctor_name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500 text-sm">Hospital</span>
                            <span className="font-medium text-gray-900 text-right">{hospital.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Time/Date</span>
                            <span className="font-medium text-gray-900 text-right">{bookingSuccessData.appointment_date}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/patient/dashboard', { state: { tab: 'appointments' } })} // Go to appointments tab
                        className="w-full btn-primary py-3 rounded-xl shadow-lg shadow-blue-500/20"
                    >
                        View My Appointments
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-4">
                <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Book Appointment</h1>
                </div>

                <div className="p-8 space-y-6">
                    {/* Hospital Details */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{hospital.name}</h3>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                            <span>{hospital.location}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Select Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none"
                                min={new Date().toISOString().split('T')[0]}
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                            />
                        </div>
                        <p className="text-xs text-gray-500">Only available dates are shown.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 text-sm">
                            <XCircle className="h-5 w-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleBook}
                        disabled={loading}
                        className="w-full btn-primary py-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Booking...' : 'Confirm Appointment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
