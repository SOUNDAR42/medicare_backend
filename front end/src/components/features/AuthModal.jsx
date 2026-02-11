
import React, { useState } from 'react';
import { X, Phone, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose, role }) => {
    const [step, setStep] = useState('PHONE');
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
        if (role === 'Patient') navigate('/patient');
        else if (role === 'Doctor') navigate('/doctor');
        else if (role === 'Pharmacy') navigate('/pharmacy');
        else if (role === 'Hospital') navigate('/hospital');
        onClose();
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-md p-8 animate-slide-up border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900">{role} Login</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {step === 'PHONE' ? 'Enter your mobile number to continue' : `Verify with OTP sent to ${phone}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                {step === 'PHONE' ? (
                    <form onSubmit={handleSendOtp}>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="tel"
                                    className="input-modern pl-12 text-lg"
                                    placeholder="98765 43210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full btn-primary py-3.5 rounded-xl text-lg flex items-center justify-center gap-2">
                            Get OTP <ArrowRight className="h-5 w-5" />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">Enter 4-digit OTP</label>
                            <div className="flex justify-center gap-4">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        id={`otp-${idx}`}
                                        type="text"
                                        maxLength={1}
                                        className="w-14 h-14 text-center text-2xl font-extrabold border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-white/80 text-gray-900"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    />
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="w-full btn-primary py-3.5 rounded-xl text-lg">
                            Verify & Login
                        </button>
                        <button type="button" onClick={() => setStep('PHONE')} className="w-full mt-4 text-gray-500 hover:text-teal-600 text-sm font-semibold transition-colors">
                            Change Number
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
