
import React, { useState } from 'react';
import { Send, AlertTriangle, Brain, Sparkles } from 'lucide-react';

const SymptomChecker = ({ onComplete }) => {
    const [symptoms, setSymptoms] = useState('');
    const [analyzing, setAnalyzing] = useState(false);

    const quickSymptoms = ['Headache', 'Fever', 'Chest Pain', 'Cough', 'Back Pain', 'Fatigue'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!symptoms.trim()) return;

        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            const lower = symptoms.toLowerCase();
            let urgency = 'Low';
            if (lower.includes('chest') || lower.includes('breath') || lower.includes('heart')) {
                urgency = 'High';
            } else if (lower.includes('fever') || lower.includes('flu') || lower.includes('pain')) {
                urgency = 'Medium';
            }
            onComplete(urgency);
        }, 1500);
    };

    const addQuickSymptom = (sym) => {
        setSymptoms(prev => prev ? `${prev}, ${sym.toLowerCase()}` : sym.toLowerCase());
    };

    return (
        <div className="w-full max-w-2xl mx-auto relative">
            {/* Decorative background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-100 via-emerald-50 to-violet-100 rounded-[32px] opacity-50 blur-xl" />

            <div className="relative glass-card p-8 border border-white/60">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl rotate-6 opacity-20" />
                        <div className="relative bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl p-3.5 shadow-lg shadow-teal-200">
                            <Brain className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        AI Symptom <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Checker</span>
                    </h2>
                    <p className="text-gray-500">Describe your symptoms for an instant triage assessment</p>
                </div>

                {/* Quick Symptom Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {quickSymptoms.map(sym => (
                        <button
                            key={sym}
                            type="button"
                            onClick={() => addQuickSymptom(sym)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-all duration-200"
                        >
                            + {sym}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6 relative">
                        <textarea
                            className="w-full p-5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-100 focus:border-teal-400 min-h-[130px] resize-none text-base bg-white/80 backdrop-blur-sm placeholder-gray-400 transition-all duration-300"
                            placeholder="e.g., I have a severe headache and fever since last night..."
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        />
                        {analyzing && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <div className="flex items-center gap-3 text-teal-600">
                                    <div className="relative">
                                        <Sparkles className="h-6 w-6 animate-pulse" />
                                    </div>
                                    <span className="font-medium">Analyzing symptoms...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={analyzing || !symptoms.trim()}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-teal-300/40 hover:shadow-xl hover:shadow-teal-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-3 text-lg group"
                    >
                        {analyzing ? (
                            <>
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <span className="relative">Analyze Symptoms</span>
                                <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Trust note */}
                <p className="text-center text-xs text-gray-400 mt-5 flex items-center justify-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" />
                    This is a screening tool, not a medical diagnosis
                </p>
            </div>
        </div>
    );
};

export default SymptomChecker;
