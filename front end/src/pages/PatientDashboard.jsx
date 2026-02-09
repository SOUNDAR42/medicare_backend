
import React, { useState } from 'react';
import { Filter, DollarSign, MapPin, AlertCircle } from 'lucide-react';
import EntityCard from '../components/common/EntityCard';
import SymptomChecker from '../components/features/SymptomChecker';
import { MOCK_DOCTORS, MOCK_HOSPITALS } from '../mockData';

const PatientDashboard = () => {
    const [urgency, setUrgency] = useState(null); // null | 'Low' | 'Medium' | 'High'
    const [preference, setPreference] = useState('distance'); // 'distance' | 'cost'

    const handleTriageComplete = (score) => {
        setUrgency(score);
    };

    const getUrgencyColor = () => {
        switch (urgency) {
            case 'High': return 'bg-red-100 text-red-800 border-red-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const sortedDoctors = [...MOCK_DOCTORS].sort((a, b) => {
        if (preference === 'cost') return a.fees - b.fees;
        return a.distance - b.distance;
    });

    const sortedHospitals = [...MOCK_HOSPITALS].sort((a, b) => a.distance - b.distance);

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {!urgency ? (
                    <div className="max-w-3xl mx-auto pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Hello, how can we help you today?</h1>
                        <SymptomChecker onComplete={handleTriageComplete} />
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-500">
                        {/* Triage Result Header */}
                        <div className={`p-6 rounded-2xl border mb-8 flex items-center justify-between ${getUrgencyColor()}`}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/50 rounded-full">
                                    <AlertCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Urgency Assessed: {urgency}</h2>
                                    <p className="opacity-90">Based on your symptoms, we recommend consulting a {urgency === 'High' ? 'specialist immediately' : 'doctor soon'}.</p>
                                </div>
                            </div>
                            <button onClick={() => setUrgency(null)} className="text-sm underline font-medium hover:opacity-80">
                                Retake Assessment
                            </button>
                        </div>

                        {/* Controls */}
                        <div className="mb-8 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                            <h2 className="text-2xl font-bold text-gray-900">Recommended Care</h2>

                            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex">
                                <button
                                    onClick={() => setPreference('distance')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${preference === 'distance' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    <MapPin className="h-4 w-4" /> Short Distance
                                </button>
                                <button
                                    onClick={() => setPreference('cost')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${preference === 'cost' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    <DollarSign className="h-4 w-4" /> Cost Efficient
                                </button>
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <section>
                                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs">Doctors</span>
                                </h3>
                                <div className="space-y-4">
                                    {sortedDoctors.map(doc => (
                                        <EntityCard
                                            key={doc.id}
                                            type="doctor"
                                            data={doc}
                                            onAction={(d) => console.log('Book', d)}
                                        />
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-xs">Hospitals</span>
                                </h3>
                                <div className="space-y-4">
                                    {sortedHospitals.map(hosp => (
                                        <EntityCard
                                            key={hosp.id}
                                            type="hospital"
                                            data={hosp}
                                            onAction={(h) => console.log('View', h)}
                                        />
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
