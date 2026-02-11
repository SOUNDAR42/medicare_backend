import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Building2, Lock, ArrowRight, Shield } from 'lucide-react';

const HospitalLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ hospital_id: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.loginHospital(credentials);
            if (response.status === 'success') {
                localStorage.setItem('user', JSON.stringify(response.data));
                localStorage.setItem('role', 'hospital');
                navigate('/hospital');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob" />
                <div className="absolute bottom-20 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
            </div>

            <div className="w-full max-w-md relative z-10 animate-slide-up">
                <div className="glass-card p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                            <Building2 className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900">Hospital Login</h2>
                        <p className="text-gray-500 mt-2">Manage hospital operations and analytics</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-2">
                            <span className="block w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hospital ID</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input type="text" name="hospital_id" value={credentials.hospital_id} onChange={handleChange} className="input-modern pl-12" placeholder="E.g., HOSP123" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input type="password" name="password" value={credentials.password} onChange={handleChange} className="input-modern pl-12" placeholder="••••••••" required />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    Logging in...
                                </span>
                            ) : (<> Sign In <ArrowRight className="h-5 w-5" /> </>)}
                        </button>
                    </form>
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                        <Shield className="h-3.5 w-3.5" />
                        <span>Protected by Medicare Security</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalLogin;
