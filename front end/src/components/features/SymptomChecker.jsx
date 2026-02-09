
import React, { useState } from 'react';
import { Send, AlertTriangle } from 'lucide-react';

const SymptomChecker = ({ onComplete }) => {
    const [symptoms, setSymptoms] = useState('');
    const [analyzing, setAnalyzing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!symptoms.trim()) return;

        setAnalyzing(true);
        // Simulate analysis delay
        setTimeout(() => {
            setAnalyzing(false);
            // Mock logic: 
            // "chest pain" -> High
            // "fever" -> Medium
            // else -> Low
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

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Symptom Checker</h2>
                <p className="text-gray-500">Describe your symptoms to get a triage assessment.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <textarea
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px] resize-none text-lg"
                        placeholder="e.g., I have a severe headache and fever..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={analyzing || !symptoms.trim()}
                    className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {analyzing ? (
                        <>
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            Analyze Symptoms <Send className="h-5 w-5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default SymptomChecker;
