import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Check, Pill, FileText, Activity } from 'lucide-react';

const NewMedicine = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        medicine_name: '',
        dosage_form: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.medicine_name || !formData.dosage_form) {
            alert("Please fill in the required fields.");
            return;
        }

        try {
            setLoading(true);
            const res = await api.createMedicine(formData);
            if (res.medicine_id) {
                alert("Medicine created successfully!");
                navigate('/medicine');
            } else {
                alert("Failed to create medicine. Please try again.");
            }
        } catch (error) {
            console.error("Error creating medicine:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/medicine')}
                    className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-1" /> Back to Catalog
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <h1 className="text-2xl font-bold text-gray-900">Add New Medicine</h1>
                        <p className="text-gray-500 mt-1">Register a new medicine in the system database.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Medicine Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Pill className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="medicine_name"
                                    value={formData.medicine_name}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="e.g. Paracetamol"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dosage Form <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Activity className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    name="dosage_form"
                                    value={formData.dosage_form}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
                                    required
                                >
                                    <option value="">Select Form</option>
                                    <option value="Tablet">Tablet</option>
                                    <option value="Capsule">Capsule</option>
                                    <option value="Syrup">Syrup</option>
                                    <option value="Injection">Injection</option>
                                    <option value="Cream">Cream</option>
                                    <option value="Drops">Drops</option>
                                    <option value="Inhaler">Inhaler</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="Enter details about the medicine..."
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Creating...' : (
                                    <>
                                        <Check className="h-5 w-5 mr-2" />
                                        Create Medicine
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

export default NewMedicine;
