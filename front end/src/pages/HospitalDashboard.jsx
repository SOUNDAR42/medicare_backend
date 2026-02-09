
import React from 'react';
import { Activity, Users, DollarSign, Calendar, TrendingUp, UserPlus } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
        <div className="flex items-center text-sm">
            <span className="text-green-600 font-medium flex items-center mr-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                {change}
            </span>
            <span className="text-gray-400">vs last month</span>
        </div>
    </div>
);

const ActivityItem = ({ title, time, user, type }) => (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
        <div className={`p-2 rounded-full ${type === 'appointment' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
            {type === 'appointment' ? <Calendar className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
        </div>
        <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="text-xs text-gray-500">{user} • {time}</p>
        </div>
    </div>
);

const HospitalDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Hospital Overview</h1>
                    <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Appointments"
                        value="1,284"
                        change="+12%"
                        icon={Calendar}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Active Doctors"
                        value="42"
                        change="+4%"
                        icon={Users}
                        color="bg-emerald-500"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value="₹45.2L"
                        change="+8.5%"
                        icon={DollarSign}
                        color="bg-indigo-500"
                    />
                    <StatCard
                        title="Patient Satisfaction"
                        value="98%"
                        change="+2%"
                        icon={Activity}
                        color="bg-rose-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
                        <div className="space-y-2">
                            <ActivityItem
                                title="New Appointment Scheduled"
                                user="Dr. Sarah Smith"
                                time="2 mins ago"
                                type="appointment"
                            />
                            <ActivityItem
                                title="New Patient Registration"
                                user="Rahul Kumar"
                                time="15 mins ago"
                                type="user"
                            />
                            <ActivityItem
                                title="Appointment Completed"
                                user="Dr. John Doe"
                                time="1 hour ago"
                                type="appointment"
                            />
                            <ActivityItem
                                title="New Staff Added"
                                user="Admin"
                                time="2 hours ago"
                                type="user"
                            />
                        </div>
                    </div>

                    {/* Quick Actions (Placeholder) */}
                    <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-lg p-6 text-white text-center">
                        <h3 className="text-xl font-bold mb-4">Add New Doctor</h3>
                        <p className="opacity-90 mb-6 text-sm">Onboard new medical staff to the platform efficiently.</p>
                        <button className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">
                            Register Doctor
                        </button>
                        <button className="w-full mt-4 bg-primary/20 backdrop-blur-sm border border-white/20 text-white font-medium py-3 rounded-xl hover:bg-white/10 transition-colors">
                            View All Staff
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;
