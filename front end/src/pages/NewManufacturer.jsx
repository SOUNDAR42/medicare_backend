import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Check, Building2 } from 'lucide-react';

const NewManufacturer = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) { alert("Please enter manufacturer name."); return; }
        try {
            setLoading(true);
            const res = await api.createManufacturer({ manufacturer_name: name });
            if (res.manufacturer_id) {
                alert("Manufacturer added successfully!");
                navigate('/manufacture');
            } else {
                alert("Failed to add manufacturer.");
            }
        } catch (error) {
            console.error("Error creating manufacturer:", error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/manufacture')}
                    className="flex items-center gap-1 text-gray-500 hover:text-violet-600 mb-6 transition-colors font-medium text-sm"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to List
                </button>

                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-200">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">New Manufacturer</h1>
                            <p className="text-sm text-gray-500">Add a new pharmaceutical partner to the registry</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-modern"
                                placeholder="Enter official manufacturer name (e.g. Pfizer Inc.)"
                                required
                            />
                            <p className="mt-2 text-xs text-gray-400">
                                Please use the official registered name of the company.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => navigate('/manufacture')} className="btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="btn-accent flex items-center gap-2">
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                        Processing...
                                    </span>
                                ) : (<> <Check className="h-4 w-4" /> Save Record </>)}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewManufacturer;
