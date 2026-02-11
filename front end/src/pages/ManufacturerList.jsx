import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Search, Factory, RefreshCw, Plus, Building2 } from 'lucide-react';

const ManufacturerList = () => {
    const navigate = useNavigate();
    const [manufacturers, setManufacturers] = useState([]);
    const [filteredManufacturers, setFilteredManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchManufacturers(); }, []);

    const fetchManufacturers = async () => {
        try {
            setLoading(true);
            const data = await api.getManufacturers();
            const list = Array.isArray(data) ? data : (data.results || []);
            setManufacturers(list);
            setFilteredManufacturers(list);
        } catch (error) {
            console.error("Failed to fetch manufacturers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = manufacturers.filter(m =>
            m.manufacturer_name && m.manufacturer_name.toLowerCase().includes(lowerTerm)
        );
        setFilteredManufacturers(filtered);
    }, [searchTerm, manufacturers]);

    const gradients = [
        'from-teal-500 to-emerald-500',
        'from-violet-500 to-purple-500',
        'from-blue-500 to-indigo-500',
        'from-rose-500 to-pink-500',
        'from-amber-500 to-orange-500',
        'from-sky-500 to-cyan-500',
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex items-center gap-3 text-teal-600">
                <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600" />
                <span className="font-medium">Loading manufacturers...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-200">
                            <Building2 className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Manufacturer Registry</h1>
                            <p className="text-sm text-gray-500">All registered pharmaceutical partners</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/manufacture/add_manufacture')}
                        className="btn-accent flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5" /> New Manufacturer
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="stat-card">
                        <p className="text-sm font-medium text-gray-500">Total Manufacturers</p>
                        <p className="text-3xl font-extrabold text-gray-900 mt-1">{manufacturers.length}</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm font-medium text-gray-500">Filtered Results</p>
                        <p className="text-3xl font-extrabold text-gray-900 mt-1">{filteredManufacturers.length}</p>
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
                                placeholder="Search by company name..."
                                className="input-modern pl-11"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="badge badge-purple">{filteredManufacturers.length} Results</span>
                            <button onClick={fetchManufacturers} className="p-2.5 text-gray-400 hover:text-violet-600 rounded-xl hover:bg-violet-50 transition-colors" title="Refresh">
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
                                    <th>Manufacturer Name</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredManufacturers.length > 0 ? (
                                    filteredManufacturers.map((m, idx) => (
                                        <tr key={m.manufacturer_id}>
                                            <td className="font-mono text-xs text-gray-400">
                                                #{String(m.manufacturer_id).padStart(4, '0')}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                                                        {m.manufacturer_name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{m.manufacturer_name}</span>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <button className="text-violet-600 hover:text-violet-800 font-semibold text-sm hover:bg-violet-50 px-3 py-1.5 rounded-lg transition-colors">
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-12 text-center text-gray-400">
                                            <Factory className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                                            No manufacturers found matching your search.
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

export default ManufacturerList;
