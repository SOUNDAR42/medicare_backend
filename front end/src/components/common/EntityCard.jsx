
import React from 'react';
import { MapPin, DollarSign, Clock, Star } from 'lucide-react';

const EntityCard = ({ type, data, onAction }) => {
    const isDoctor = type === 'doctor';

    return (
        <div className="card hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{data.name}</h3>
                    <p className="text-sm text-gray-500">{isDoctor ? data.specialization : data.location}</p>
                    {isDoctor && <p className="text-xs text-primary font-medium mt-1">{data.hospital}</p>}
                </div>
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                    <span className="text-xs font-bold text-yellow-700">{data.rating}</span>
                </div>
            </div>

            <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{data.distance} km away</span>
                </div>

                {isDoctor && (
                    <>
                        <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                            <span>₹{data.fees} Consultation</span>
                        </div>
                        <div className="flex items-center text-sm text-green-600 font-medium">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>Next: {data.nextAvailable}</span>
                        </div>
                    </>
                )}

                {!isDoctor && (
                    <>
                        {data.avgCost > 0 && (
                            <div className="flex items-center text-sm text-gray-600">
                                <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                <span>~₹{data.avgCost} Avg. Fee</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            <button
                onClick={() => onAction(data)}
                className="w-full btn-primary bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
            >
                {isDoctor ? 'Book Appointment' : 'Book Appointment'}
            </button>
        </div>
    );
};

export default EntityCard;
