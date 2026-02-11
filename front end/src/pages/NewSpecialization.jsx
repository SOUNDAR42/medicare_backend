import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Check, Stethoscope } from 'lucide-react';

const NewSpecialization = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            alert("Please enter specialization name.");
            return;
        }

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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/specializtion')}
                    className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-1" /> Back to List
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <h1 className="text-2xl font-bold text-gray-900">Add Specialization</h1>
                        <p className="text-gray-500 mt-1">Register a new medical specialization.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Specialization Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Stethoscope className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="e.g. Cardiology"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Saving...' : (
                                    <>
                                        <Check className="h-5 w-5 mr-2" />
                                        Save Specialization
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewSpecialization;
