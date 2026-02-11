import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Check, Pill, FileText, Beaker } from 'lucide-react';

const NewMedicine = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        medicine_name: '', dosage_form: '', description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/medicine')}
                    className="flex items-center gap-1 text-gray-500 hover:text-teal-600 mb-6 transition-colors font-medium text-sm"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Catalog
                </button>

                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-200">
                            <Pill className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Add New Medicine</h1>
                            <p className="text-sm text-gray-500">Register a new medicine in the system database</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Medicine Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Pill className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input type="text" name="medicine_name" value={formData.medicine_name} onChange={handleChange} className="input-modern pl-12" placeholder="e.g. Paracetamol" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Dosage Form <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Beaker className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select name="dosage_form" value={formData.dosage_form} onChange={handleChange} className="input-modern pl-12" required>
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
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="input-modern pl-12" placeholder="Enter details about the medicine..." />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 mt-4">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    Creating...
                                </span>
                            ) : (<> <Check className="h-5 w-5" /> Create Medicine </>)}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewMedicine;
