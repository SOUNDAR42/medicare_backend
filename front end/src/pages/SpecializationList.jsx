import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Search, Stethoscope, RefreshCw, Plus } from 'lucide-react';

const SpecializationList = () => {
    const navigate = useNavigate();
    const [specs, setSpecs] = useState([]);
    const [filteredSpecs, setFilteredSpecs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSpecializations();
    }, []);

    const fetchSpecializations = async () => {
        try {
            setLoading(true);
            const data = await api.getSpecializations();
            const list = Array.isArray(data) ? data : (data.results || []);
            setSpecs(list);
            setFilteredSpecs(list);
        } catch (error) {
            console.error("Failed to fetch specializations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = specs.filter(s =>
            s.specialization_name && s.specialization_name.toLowerCase().includes(lowerTerm)
        );
        setFilteredSpecs(filtered);
    }, [searchTerm, specs]);

    if (loading) return <div className="p-8 text-center pt-20">Loading specializations...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Specializations</h1>
                        <p className="text-gray-500">Manage medical specializations.</p>
                    </div>
                    <button
                        onClick={() => navigate('/specializtion/add_specializtion')}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
                    >
                        <Plus className="h-5 w-5" />
                        Add Specialization
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search specializations..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button onClick={fetchSpecializations} className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100" title="Refresh">
                            <RefreshCw className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">ID</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Specialization Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSpecs.length > 0 ? filteredSpecs.map(s => (
                                    <tr key={s.specialization_id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 font-mono text-xs text-gray-500">
                                            {s.specialization_id}
                                        </td>
                                        <td className="py-4 px-6 font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                                    <Stethoscope className="h-5 w-5" />
                                                </div>
                                                {s.specialization_name}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" className="p-12 text-center text-gray-500">No specializations found.</td>
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

export default SpecializationList;
