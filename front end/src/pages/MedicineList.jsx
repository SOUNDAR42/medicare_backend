import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Search, Pill, RefreshCw, Plus, Beaker } from 'lucide-react';

const MedicineList = () => {
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchMedicines(); }, []);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const data = await api.getMedicines();
            const medList = Array.isArray(data) ? data : (data.results || []);
            setMedicines(medList);
            setFilteredMedicines(medList);
        } catch (error) {
            console.error("Failed to fetch medicines", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = medicines.filter(med =>
            (med.medicine_name && med.medicine_name.toLowerCase().includes(lowerTerm)) ||
            (med.description && med.description.toLowerCase().includes(lowerTerm))
        );
        setFilteredMedicines(filtered);
    }, [searchTerm, medicines]);

    const formColors = {
        'Tablet': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
        'Capsule': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
        'Injection': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
        'Inhaler': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex items-center gap-3 text-teal-600">
                <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600" />
                <span className="font-medium">Loading medicines...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-200">
                            <Pill className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Medicine Catalog</h1>
                            <p className="text-sm text-gray-500">Browse all available medicines in the system</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/medicine/new_medicine')}
                        className="btn-primary flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5" /> New Medicine
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="stat-card">
                        <p className="text-sm font-medium text-gray-500">Total Medicines</p>
                        <p className="text-3xl font-extrabold text-gray-900 mt-1">{medicines.length}</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm font-medium text-gray-500">Tablets</p>
                        <p className="text-3xl font-extrabold text-gray-900 mt-1">{medicines.filter(m => m.dosage_form === 'Tablet').length}</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm font-medium text-gray-500">Other Forms</p>
                        <p className="text-3xl font-extrabold text-gray-900 mt-1">{medicines.filter(m => m.dosage_form !== 'Tablet').length}</p>
                    </div>
                </div>

                {/* Content Card */}
                <div className="card p-0 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search medicines..."
                                className="input-modern pl-11"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="badge badge-info">{filteredMedicines.length} Results</span>
                            <button onClick={fetchMedicines} className="p-2.5 text-gray-400 hover:text-teal-600 rounded-xl hover:bg-teal-50 transition-colors" title="Refresh">
                                <RefreshCw className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Medicine Name</th>
                                    <th>Dosage Form</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMedicines.length > 0 ? filteredMedicines.map(med => {
                                    const colors = formColors[med.dosage_form] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
                                    return (
                                        <tr key={med.medicine_id}>
                                            <td className="font-mono text-xs text-gray-400">{med.medicine_id}</td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-sm">
                                                        <Pill className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{med.medicine_name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${colors.bg} ${colors.text} border ${colors.border}`}>
                                                    {med.dosage_form}
                                                </span>
                                            </td>
                                            <td className="text-gray-500 text-sm max-w-xs truncate" title={med.description}>
                                                {med.description}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="4" className="p-12 text-center text-gray-400">
                                            <Beaker className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                                            No medicines found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicineList;
