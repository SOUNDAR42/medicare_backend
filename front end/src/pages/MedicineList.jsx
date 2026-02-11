import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Search, Pill, RefreshCw, Plus } from 'lucide-react';

const MedicineList = () => {
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const data = await api.getMedicines();
            // Handle potentially different response structures (array vs paginated)
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

    if (loading) return <div className="p-8 text-center pt-20">Loading medicines...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medicine Catalog</h1>
                        <p className="text-gray-500">Browse all available medicines in the system.</p>
                    </div>
                    <button
                        onClick={() => navigate('/medicine/new_medicine')}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
                    >
                        <Plus className="h-5 w-5" />
                        New Medicine
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search medicines..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button onClick={fetchMedicines} className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100" title="Refresh">
                            <RefreshCw className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">ID</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Medicine Name</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Dosage Form</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMedicines.length > 0 ? filteredMedicines.map(med => (
                                    <tr key={med.medicine_id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 font-mono text-xs text-gray-500">
                                            {med.medicine_id}
                                        </td>
                                        <td className="py-4 px-6 font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                    <Pill className="h-5 w-5" />
                                                </div>
                                                {med.medicine_name}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {med.dosage_form}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500 text-sm max-w-xs truncate" title={med.description}>
                                            {med.description}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="p-12 text-center text-gray-500">No medicines found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 text-right">
                        Total Items: {filteredMedicines.length}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicineList;
