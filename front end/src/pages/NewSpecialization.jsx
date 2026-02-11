import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Check, Heart } from 'lucide-react';

const NewSpecialization = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) { alert("Please enter specialization name."); return; }
        try {
            setLoading(true);
            const res = await api.createSpecialization({ specialization_name: name });
            if (res.specialization_id) {
                alert("Specialization added successfully!");
                navigate('/specializtion');
            } else {
                alert("Failed to add specialization.");
            }
        } catch (error) {
            console.error("Error creating specialization:", error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/specializtion')}
                    className="flex items-center gap-1 text-gray-500 hover:text-teal-600 mb-6 transition-colors font-medium text-sm"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to List
                </button>

                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                            <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Add Specialization</h1>
                            <p className="text-sm text-gray-500">Register a new medical specialization</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Specialization Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Heart className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-modern pl-12"
                                    placeholder="e.g. Cardiology"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 mt-4">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    Saving...
                                </span>
                            ) : (<> <Check className="h-5 w-5" /> Save Specialization </>)}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewSpecialization;
