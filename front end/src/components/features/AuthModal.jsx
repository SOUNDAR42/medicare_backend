
import React, { useState } from 'react';
import { X, Phone, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose, role }) => {
    const [step, setStep] = useState('PHONE'); // PHONE | OTP
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSendOtp = (e) => {
        e.preventDefault();
        setStep('OTP');
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        // Verify OTP logic here (mock)
        if (role === 'Patient') {
            navigate('/patient');
        } else if (role === 'Doctor') {
            navigate('/doctor');
        } else if (role === 'Pharmacy') {
            navigate('/pharmacy');
        } else if (role === 'Hospital') {
            navigate('/hospital');
        }
        onClose();
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return; // Prevent multiple chars
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-xl transform transition-all scale-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {role} Login
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {step === 'PHONE' ? 'Enter your mobile number to continue' : `Verify with OTP sent to ${phone}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                {step === 'PHONE' ? (
                    <form onSubmit={handleSendOtp}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary transition-colors text-lg"
                                    placeholder="98765 43210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full btn-primary bg-primary hover:bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            Get OTP <ArrowRight className="h-5 w-5" />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                Enter 4-digit OTP
                            </label>
                            <div className="flex justify-center gap-4">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        id={`otp-${idx}`}
                                        type="text"
                                        maxLength={1}
                                        className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    />
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full btn-primary bg-primary hover:bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 transition-all"
                        >
                            Verify & Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('PHONE')}
                            className="w-full mt-4 text-gray-500 hover:text-gray-900 text-sm font-medium"
                        >
                            Change Number
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
