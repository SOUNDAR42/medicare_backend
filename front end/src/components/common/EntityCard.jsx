
import React from 'react';
import { MapPin, DollarSign, Clock, Star, ArrowRight, Users } from 'lucide-react';

const EntityCard = ({ type, data, onAction }) => {
    const isDoctor = type === 'doctor';

    return (
        <div className="group card hover:shadow-glow-teal border-gray-100 relative overflow-hidden">
            {/* Subtle gradient accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex justify-between items-start mb-5">
                <div className="flex items-start gap-4">
                    {/* Avatar / Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isDoctor
                            ? 'bg-gradient-to-br from-teal-500 to-emerald-500 shadow-md shadow-teal-200'
                            : 'bg-gradient-to-br from-violet-500 to-purple-500 shadow-md shadow-violet-200'
                        }`}>
                        {isDoctor ? (
                            <span className="text-white text-lg font-bold">{data.name?.[0] || 'D'}</span>
                        ) : (
                            <Users className="h-5 w-5 text-white" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{data.name}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{isDoctor ? data.specialization : data.location}</p>
                        {isDoctor && (
                            <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                                <MapPin className="h-3 w-3" />
                                {data.hospital}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                    <span className="text-xs font-bold text-amber-700">{data.rating}</span>
                </div>
            </div>

            {/* Info Pills */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <span>{data.distance} km</span>
                </div>

                {isDoctor && (
                    <>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                            <span>₹{data.fees}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{data.nextAvailable}</span>
                        </div>
                    </>
                )}

                {!isDoctor && data.avgCost > 0 && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                        <span>~₹{data.avgCost} Avg</span>
                    </div>
                )}
            </div>

            <button
                onClick={() => onAction(data)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold py-3 rounded-xl shadow-md shadow-teal-200 hover:shadow-lg hover:shadow-teal-300 transition-all duration-300 group-hover:scale-[1.01]"
            >
                Book Appointment
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default EntityCard;
