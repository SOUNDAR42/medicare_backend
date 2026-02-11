
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { User, Stethoscope, Building, Store, ArrowRight, Lock, Phone, Sparkles, Shield } from 'lucide-react';

const Auth = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('patient');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        password: '', name: '', age: '', gender: 'Male', mobileno: '', pincode: '',
        doctor_name: '', doctor_id: '', experience: '',
        hospital_name: '', hospital_id: '', street: '', district: '', state: '', contact: '', working_hours: '',
        pharmacy_name: '', pharmacy_id: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const handleSendOtp = () => {
        if (!formData.mobileno) { setError("Please enter a mobile number"); return; }
        setOtpSent(true);
        alert(`OTP sent to ${formData.mobileno}: 1234`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            let response;
            if (isLogin) {
                const credentials = { password: formData.password };
                if (role === 'patient') {
                    if (!otpSent) { handleSendOtp(); setLoading(false); return; }
                    if (otp === '1234') {
                        response = await api.loginPatient({ mobileno: formData.mobileno, otp });
                    } else { throw new Error("Invalid OTP"); }
                }
                else if (role === 'doctor') credentials.doctor_id = formData.doctor_id;
                else if (role === 'hospital') credentials.hospital_id = formData.hospital_id;
                else if (role === 'pharmacy') credentials.pharmacy_id = formData.pharmacy_id;

                if (role !== 'patient') {
                    if (role === 'doctor') response = await api.loginDoctor(credentials);
                    if (role === 'hospital') response = await api.loginHospital(credentials);
                    if (role === 'pharmacy') response = await api.loginPharmacy(credentials);
                }

                if (response && response.status === 'success') {
                    const userToStore = { role, ...response.data };
                    localStorage.setItem('user', JSON.stringify(userToStore));
                    if (role === 'patient') navigate('/patient/dashboard');
                    if (role === 'doctor') navigate('/doctor/dashboard');
                    if (role === 'hospital') navigate('/hospital/dashboard');
                    if (role === 'pharmacy') navigate(`/pharmacy/${response.data.pharmacy_id}/dashboard`);
                } else { setError(response?.message || 'Login failed'); }
            } else {
                if (role === 'patient') {
                    response = await api.registerPatient({ name: formData.name, age: parseInt(formData.age), gender: formData.gender, mobileno: formData.mobileno, pincode: parseInt(formData.pincode) });
                    if (response) navigate('/patient/dashboard');
                } else if (role === 'doctor') {
                    response = await api.registerDoctor({ doctor_name: formData.doctor_name, experience: parseInt(formData.experience), password: formData.password });
                    if (response) alert(`Doctor registered! ID: ${response.doctor_id}`);
                } else if (role === 'hospital') {
                    response = await api.registerHospital({ hospital_name: formData.hospital_name, street: formData.street, district: formData.district, state: formData.state, pincode: parseInt(formData.pincode), contact: formData.contact, working_hours: formData.working_hours, password: formData.password });
                    if (response) alert(`Hospital registered! ID: ${response.hospital_id}`);
                } else if (role === 'pharmacy') {
                    response = await api.registerPharmacy({ pharmacy_name: formData.pharmacy_name, street: formData.street, district: formData.district, state: formData.state, pincode: parseInt(formData.pincode), contact: formData.contact, password: formData.password });
                    if (response) alert(`Pharmacy registered! ID: ${response.pharmacy_id}`);
                }
            }
        } catch (err) {
            console.error(err);
            setError("Operation failed. Please check your inputs.");
        } finally { setLoading(false); }
    };

    const roles = [
        { id: 'patient', icon: User, label: 'Patient', gradient: 'from-teal-500 to-emerald-500', shadow: 'shadow-teal-200' },
        { id: 'doctor', icon: Stethoscope, label: 'Doctor', gradient: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-200' },
        { id: 'hospital', icon: Building, label: 'Hospital', gradient: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-200' },
        { id: 'pharmacy', icon: Store, label: 'Pharmacy', gradient: 'from-rose-500 to-pink-500', shadow: 'shadow-rose-200' },
    ];

    const inputClasses = "input-modern";

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob" />
                <div className="absolute bottom-20 -left-40 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
            </div>

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                {/* Left Side */}
                <div className="space-y-8 animate-slide-up">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-full text-sm font-semibold text-teal-700 mb-6">
                            <Shield className="h-4 w-4" />
                            <span>Secure Authentication</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                            Welcome to{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Medicare</span>
                        </h1>
                        <p className="text-gray-500 text-lg">Choose your role to get started with the platform.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {roles.map(r => {
                            const Icon = r.icon;
                            return (
                                <button
                                    key={r.id}
                                    onClick={() => setRole(r.id)}
                                    className={`group glass-card p-6 text-center transition-all duration-300 ${role === r.id
                                            ? 'border-teal-300 shadow-glow-teal'
                                            : 'hover:shadow-elevated'
                                        }`}
                                >
                                    <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center mb-3 shadow-lg ${r.shadow} ${role === r.id ? 'scale-110' : 'group-hover:scale-105'} transition-transform`}>
                                        <Icon className="h-7 w-7 text-white" />
                                    </div>
                                    <span className={`font-bold ${role === r.id ? 'text-gray-900' : 'text-gray-600'}`}>{r.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="glass-card p-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 capitalize">
                                {isLogin ? `${role} Login` : `Join as ${role}`}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {isLogin ? 'Enter your credentials to access your account' : 'Fill in your details to create a new account'}
                            </p>
                        </div>
                        <div className="tab-container">
                            <button onClick={() => setIsLogin(true)} className={`tab-item ${isLogin ? 'active' : ''}`}>Login</button>
                            <button onClick={() => setIsLogin(false)} className={`tab-item ${!isLogin ? 'active' : ''}`}>Register</button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                                <span className="block w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Login Fields */}
                        {isLogin && (
                            <>
                                {role === 'patient' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input type="text" name="mobileno" value={formData.mobileno} onChange={handleInputChange} className={`${inputClasses} pl-12`} placeholder="Enter your mobile number" disabled={otpSent} required />
                                            </div>
                                        </div>
                                        {otpSent && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">OTP</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className={`${inputClasses} pl-12`} placeholder="Enter OTP (1234)" required />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {role === 'doctor' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Doctor ID</label>
                                        <input type="text" name="doctor_id" value={formData.doctor_id} onChange={handleInputChange} className={inputClasses} placeholder="Enter your Doctor ID (e.g. DOC1)" required />
                                    </div>
                                )}
                                {role === 'hospital' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hospital ID</label>
                                        <input type="text" name="hospital_id" value={formData.hospital_id} onChange={handleInputChange} className={inputClasses} placeholder="Enter Hospital ID (e.g. HOS1)" required />
                                    </div>
                                )}
                                {role === 'pharmacy' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pharmacy ID</label>
                                        <input type="text" name="pharmacy_id" value={formData.pharmacy_id} onChange={handleInputChange} className={inputClasses} placeholder="Enter Pharmacy ID (e.g. PH1)" required />
                                    </div>
                                )}
                            </>
                        )}

                        {/* Registration Fields */}
                        {!isLogin && role === 'patient' && (
                            <div className="space-y-4">
                                <input type="text" name="name" placeholder="Full Name" onChange={handleInputChange} className={inputClasses} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" name="age" placeholder="Age" onChange={handleInputChange} className={inputClasses} required />
                                    <select name="gender" onChange={handleInputChange} className={inputClasses}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <input type="text" name="mobileno" placeholder="Mobile Number" onChange={handleInputChange} className={inputClasses} required />
                                <input type="number" name="pincode" placeholder="Pincode" onChange={handleInputChange} className={inputClasses} required />
                            </div>
                        )}
                        {!isLogin && role === 'doctor' && (
                            <div className="space-y-4">
                                <input type="text" name="doctor_name" placeholder="Doctor Name" onChange={handleInputChange} className={inputClasses} required />
                                <input type="number" name="experience" placeholder="Years of Experience" onChange={handleInputChange} className={inputClasses} required />
                            </div>
                        )}
                        {!isLogin && (role === 'hospital' || role === 'pharmacy') && (
                            <div className="space-y-4">
                                <input type="text" name={role === 'hospital' ? 'hospital_name' : 'pharmacy_name'} placeholder={role === 'hospital' ? 'Hospital Name' : 'Pharmacy Name'} onChange={handleInputChange} className={inputClasses} required />
                                <input type="text" name="street" placeholder="Street Address" onChange={handleInputChange} className={inputClasses} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" name="district" placeholder="District" onChange={handleInputChange} className={inputClasses} required />
                                    <input type="text" name="state" placeholder="State" onChange={handleInputChange} className={inputClasses} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" name="pincode" placeholder="Pincode" onChange={handleInputChange} className={inputClasses} required />
                                    <input type="text" name="contact" placeholder="Contact Number" onChange={handleInputChange} className={inputClasses} required />
                                </div>
                                {role === 'hospital' && (
                                    <input type="text" name="working_hours" placeholder="Working Hours (e.g. 24/7)" onChange={handleInputChange} className={inputClasses} required />
                                )}
                            </div>
                        )}

                        {/* Password Field */}
                        {((isLogin && role !== 'patient') || (!isLogin && role !== 'patient')) && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className={`${inputClasses} pl-12`} placeholder="Enter your password" required />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 mt-6 text-lg"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    {isLogin
                                        ? (role === 'patient' && !otpSent ? 'Send OTP' : (role === 'patient' ? 'Verify & Login' : 'Sign In'))
                                        : 'Create Account'
                                    }
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
