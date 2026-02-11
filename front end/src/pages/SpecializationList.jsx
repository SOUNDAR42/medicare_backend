import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Search, Stethoscope, RefreshCw, Plus, Heart } from 'lucide-react';

const specIcons = ['💊', '❤️', '🦴', '👶', '🧴', '🧠', '🩺', '👁️', '👂', '🧘'];

const SpecializationList = () => {
    const navigate = useNavigate();
    const [specs, setSpecs] = useState([]);
    const [filteredSpecs, setFilteredSpecs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchSpecializations(); }, []);

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

    const gradients = [
        'from-teal-500 to-emerald-500',
        'from-rose-500 to-pink-500',
        'from-blue-500 to-indigo-500',
        'from-violet-500 to-purple-500',
        'from-amber-500 to-orange-500',
        'from-cyan-500 to-sky-500',
        'from-emerald-500 to-green-500',
        'from-fuchsia-500 to-pink-500',
        'from-indigo-500 to-violet-500',
        'from-lime-500 to-green-500',
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex items-center gap-3 text-teal-600">
                <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600" />
                <span className="font-medium">Loading specializations...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                            <Heart className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Specializations</h1>
                            <p className="text-sm text-gray-500">Browse and manage medical specializations</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/specializtion/add_specializtion')}
                        className="btn-primary flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5" /> Add Specialization
                    </button>
                </div>

                {/* Search Bar */}
                <div className="card mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search specializations..."
                            className="input-modern pl-11"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="badge badge-success">{filteredSpecs.length} Specializations</span>
                        <button onClick={fetchSpecializations} className="p-2.5 text-gray-400 hover:text-teal-600 rounded-xl hover:bg-teal-50 transition-colors" title="Refresh">
                            <RefreshCw className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Specialization Grid */}
                {filteredSpecs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredSpecs.map((s, idx) => (
                            <div
                                key={s.specialization_id}
                                className="group card hover:shadow-glow-teal text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />

                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="text-2xl">{specIcons[idx % specIcons.length]}</span>
                                </div>

                                <h3 className="font-bold text-gray-900 text-lg mb-1">{s.specialization_name}</h3>
                                <p className="text-xs text-gray-400 font-mono">ID: {s.specialization_id}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-16 border-dashed">
                        <Stethoscope className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-400 font-medium">No specializations found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpecializationList;
