
import React, { useState } from 'react';
import { Package, AlertTriangle, Search, Plus } from 'lucide-react';
import { MOCK_INVENTORY } from '../mockData';

const PharmacyDashboard = () => {
    const [inventory, setInventory] = useState(MOCK_INVENTORY);
    const [searchTerm, setSearchTerm] = useState('');

    const handleStockUpdate = (id, newStock) => {
        setInventory(prev => prev.map(item =>
            item.id === id ? { ...item, stock: parseInt(newStock) || 0 } : item
        ));
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockItems = inventory.filter(item => item.stock < 10).length;

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Stats */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pharmacy Inventory</h1>
                        <p className="text-gray-500">Manage medicine stock and track prescriptions.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg text-primary">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Items</p>
                                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-red-50 rounded-lg text-red-500">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Low Stock</p>
                                <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search medicines..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus className="h-5 w-5" /> Add Medicine
                    </button>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Medicine Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Manufacturer</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Price</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Stock</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Expiry</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredInventory.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.manufacturer}</td>
                                        <td className="px-6 py-4 text-gray-600">₹{item.price}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={item.stock}
                                                    onChange={(e) => handleStockUpdate(item.id, e.target.value)}
                                                    className={`w-20 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${item.stock < 10 ? 'border-red-300 bg-red-50 text-red-900' : 'border-gray-300'
                                                        }`}
                                                />
                                                {item.stock < 10 && (
                                                    <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-sm">{item.expiry}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.stock > 10
                                                    ? 'bg-green-100 text-green-800'
                                                    : item.stock > 0
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.stock > 10 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredInventory.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No medicines found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PharmacyDashboard;
