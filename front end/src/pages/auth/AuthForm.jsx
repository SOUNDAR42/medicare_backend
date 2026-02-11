import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api';
import { User, Stethoscope, Building, Store, ArrowRight, Lock, Phone, ArrowLeft } from 'lucide-react';

const AuthForm = () => {
    const navigate = useNavigate();
    const { role, mode } = useParams(); // mode: 'login' or 'register'
    const isLogin = mode === 'login';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        // Common
        password: '',

        // Patient
        name: '',
        age: '',
        gender: 'Male',
        mobileno: '',
        pincode: '',

        // Doctor
        doctor_name: '',
        doctor_id: '', // For Login
        experience: '',

        // Hospital
        hospital_name: '',
        hospital_id: '', // For Login
        street: '',
        district: '',
        state: '',
        contact: '',
        working_hours: '',

        // Pharmacy
        pharmacy_name: '',
        pharmacy_id: '', // For Login
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const handleSendOtp = () => {
        if (!formData.mobileno) {
            setError("Please enter a mobile number");
            return;
        }
        // Simulate OTP sending
        setOtpSent(true);
        alert(`OTP sent to ${formData.mobileno}: 1234`); // Mock OTP
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let response;
            if (isLogin) {
                // Login Logic
                const credentials = { password: formData.password };

                if (role === 'patient') {
                    if (!otpSent) {
                        handleSendOtp();
                        setLoading(false);
                        return;
                    }
                    // Verify OTP
                    if (otp === '1234') {
                        // Mock login success or call API
                        response = await api.loginPatient({ mobileno: formData.mobileno, otp });
                    } else {
                        throw new Error("Invalid OTP");
                    }
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
                    // Store user session (Flatten the object)
                    const userToStore = { role, ...response.data };
                    localStorage.setItem('user', JSON.stringify(userToStore));

                    // Navigate to dashboard
                    if (role === 'patient') navigate('/patient/dashboard');
                    if (role === 'doctor') navigate('/doctor/dashboard');
                    if (role === 'hospital') navigate('/hospital/dashboard');
                    if (role === 'pharmacy') navigate(`/pharmacy/${response.data.pharmacy_id}/dashboard`);
                } else {
                    setError(response?.message || 'Login failed');
                }

            } else {
                // Registration Logic
                if (role === 'patient') {
                    const payload = {
                        name: formData.name,
                        age: parseInt(formData.age),
                        gender: formData.gender,
                        mobileno: formData.mobileno,
                        pincode: parseInt(formData.pincode)
                    };
                    response = await api.registerPatient(payload);
                    if (response) navigate('/patient/dashboard'); // Or login first
                } else if (role === 'doctor') {
                    const payload = {
                        doctor_name: formData.doctor_name,
                        experience: parseInt(formData.experience),
                        password: formData.password
                    };
                    response = await api.registerDoctor(payload);
                    if (response) alert(`Doctor registered! ID: ${response.doctor_id}`);
                } else if (role === 'hospital') {
                    const payload = {
                        hospital_name: formData.hospital_name,
                        street: formData.street,
                        district: formData.district,
                        state: formData.state,
                        pincode: parseInt(formData.pincode),
                        contact: formData.contact,
                        working_hours: formData.working_hours,
                        password: formData.password
                    };
                    response = await api.registerHospital(payload);
                    if (response) alert(`Hospital registered! ID: ${response.hospital_id}`);
                } else if (role === 'pharmacy') {
                    const payload = {
                        pharmacy_name: formData.pharmacy_name,
                        street: formData.street,
                        district: formData.district,
                        state: formData.state,
                        pincode: parseInt(formData.pincode),
                        contact: formData.contact,
                        password: formData.password
                    };
                    response = await api.registerPharmacy(payload);
                    if (response) alert(`Pharmacy registered! ID: ${response.pharmacy_id}`);
                }
            }
        } catch (err) {
            console.error(err);
            setError("Operation failed. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : '';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative">
                <button
                    onClick={() => navigate(`/auth/${role}`)}
                    className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="text-center pt-8 pb-8 space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 capitalize">
                        {isLogin ? `${displayRole} Login` : `Join as ${displayRole}`}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {isLogin ? 'Enter your credentials to access your account' : 'Fill in your details to create a new account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                            <span className="block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            {error}
                        </div>
                    )}

                    {/* Login Fields */}
                    {isLogin && (
                        <>
                            {role === 'patient' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="mobileno"
                                                value={formData.mobileno}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                placeholder="Enter your mobile number"
                                                disabled={otpSent}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {otpSent && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                    placeholder="Enter OTP (1234)"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {role === 'doctor' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID</label>
                                    <input
                                        type="text"
                                        name="doctor_id"
                                        value={formData.doctor_id}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="Enter your Doctor ID (e.g. DOC1)"
                                        required
                                    />
                                </div>
                            )}
                            {role === 'hospital' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital ID</label>
                                    <input
                                        type="text"
                                        name="hospital_id"
                                        value={formData.hospital_id}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="Enter Hospital ID (e.g. HOS1)"
                                        required
                                    />
                                </div>
                            )}
                            {role === 'pharmacy' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy ID</label>
                                    <input
                                        type="text"
                                        name="pharmacy_id"
                                        value={formData.pharmacy_id}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="Enter Pharmacy ID (e.g. PH1)"
                                        required
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Registration Fields - Patient */}
                    {!isLogin && role === 'patient' && (
                        <div className="space-y-4">
                            <input type="text" name="name" placeholder="Full Name" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" name="age" placeholder="Age" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
                                <select name="gender" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <input type="text" name="mobileno" placeholder="Mobile Number" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
                            <input type="number" name="pincode" placeholder="Pincode" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
                        </div>
                    )}

                    {/* Registration Fields - Doctor */}
                    {!isLogin && role === 'doctor' && (
                        <div className="space-y-4">
                            <input type="text" name="doctor_name" placeholder="Doctor Name" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
                            <input type="number" name="experience" placeholder="Years of Experience" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
                        </div>
                    )}

                    {/* Registration Fields - Hospital & Pharmacy Common */}
                    {!isLogin && (role === 'hospital' || role === 'pharmacy') && (
                        <div className="space-y-4">
                            <input
                                type="text"
                                name={role === 'hospital' ? 'hospital_name' : 'pharmacy_name'}
                                placeholder={role === 'hospital' ? 'Hospital Name' : 'Pharmacy Name'}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200"
                                required
                            />
                            <input type="text" name="street" placeholder="Street Address" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" name="district" placeholder="District" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
                                <input type="text" name="state" placeholder="State" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" name="pincode" placeholder="Pincode" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
                                <input type="text" name="contact" placeholder="Contact Number" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
                            </div>
                            {role === 'hospital' && (
                                <input type="text" name="working_hours" placeholder="Working Hours (e.g. 24/7)" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
                            )}
                        </div>
                    )}

                    {/* Password Field - Common for all except Patient (unless we add valid patient auth) */}
                    {((isLogin && role !== 'patient') || (!isLogin && role !== 'patient')) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? 'Processing...' : (
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
    );
};

export default AuthForm;
