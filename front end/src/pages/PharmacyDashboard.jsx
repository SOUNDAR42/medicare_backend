import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pill, Search, RefreshCw, AlertTriangle, Check, X, Edit, Plus, Minus } from 'lucide-react';
import { api } from '../api';

const PharmacyDashboard = () => {
    const { id } = useParams(); // Get pharmacy ID from URL
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Add Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [newMedicine, setNewMedicine] = useState({
        medicine: '',
        manufacturer: '',
        price: '',
        stock_quantity: '',
        expiry_date: '',
        pharmacy: '' // Will be set from user.pharmacy_id
    });

    // Update Modal
    const [editingItem, setEditingItem] = useState(null);
    const [newStockValue, setNewStockValue] = useState(0);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.role === 'pharmacy') {
            // Handle potentially nested user object (fix for previous bug)
            const flatUser = storedUser.data ? { ...storedUser.data, role: storedUser.role } : storedUser;
            setUser(flatUser);

            // Use ID from URL if available, otherwise from stored user
            const pharmacyId = id || flatUser.pharmacy_id;
            fetchInventory(pharmacyId);
            fetchDropdowns();
        } else {
            setLoading(false);
        }
    }, [id]);

    const fetchDropdowns = async () => {
        try {
            const [meds, manufs] = await Promise.all([
                api.getMedicines(),
                api.getManufacturers()
            ]);
            setMedicines(meds);
            setManufacturers(manufs);
        } catch (error) {
            console.error("Failed to load dropdowns", error);
        }
    };

    const fetchInventory = async (pharmacyId) => {
        try {
            // Pass pharmacyId to filter on backend via nested endpoint
            const res = await api.getPharmacyStock(pharmacyId);
            // ... existing logic ...

            const data = Array.isArray(res) ? res : (res.results || []);

            console.log("Fetched Inventory:", data); // Debugging

            // No need to filter again if backend is doing it.
            // Just use the data directly.
            setInventory(data);
            setFilteredInventory(data);
        } catch (error) {
            console.error("Failed to load inventory", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!inventory) return;
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = inventory.filter(item => {
            const medName = item.medicine_name || 'Unknown';
            const manufName = item.manufacturer_name || 'Unknown';
            return medName.toLowerCase().includes(lowerTerm) || manufName.toLowerCase().includes(lowerTerm);
        });
        setFilteredInventory(filtered);
    }, [searchTerm, inventory]);

    const handleEditClick = (item) => {
        setEditingItem(item);
        setNewStockValue(item.stock_quantity); // Correct field: stock_quantity
    };

    const handleUpdateStock = async () => {
        if (!editingItem) return;
        try {
            // Optimistic Update
            const updatedList = inventory.map(item =>
                item.medicine_instance_id === editingItem.medicine_instance_id ? { ...item, stock_quantity: newStockValue } : item
            );
            setInventory(updatedList);
            // Re-run filter logic to update view immediately
            setFilteredInventory(prev => prev.map(item =>
                item.medicine_instance_id === editingItem.medicine_instance_id ? { ...item, stock_quantity: newStockValue } : item
            ));

            // Use correct ID field for update
            await api.updatePharmacyStock(editingItem.medicine_instance_id, newStockValue);
            setEditingItem(null);
        } catch (error) {
            console.error("Failed to update stock", error);
            fetchInventory(user.pharmacy_id); // Revert on error
            alert("Failed to update stock.");
        }
    };

    const handleAddStock = async () => {
        if (!newMedicine.medicine || !newMedicine.manufacturer || !newMedicine.price || !newMedicine.stock_quantity || !newMedicine.expiry_date) {
            alert("Please fill all fields");
            return;
        }

        try {
            const payload = {
                ...newMedicine,
                pharmacy: user.pharmacy_id
            };
            await api.addPharmacyStock(payload);
            alert("Stock added successfully!");
            setShowAddModal(false);
            setNewMedicine({
                medicine: '',
                manufacturer: '',
                price: '',
                stock_quantity: '',
                expiry_date: '',
                pharmacy: ''
            });
            fetchInventory(user.pharmacy_id);
        } catch (error) {
            console.error("Failed to add stock", error);
            alert("Failed to add stock. Please try again.");
        }
    };

    const QuickStat = ({ label, value, color }) => (
        <div className={`p-4 rounded-xl border ${color} bg-opacity-50 flex flex-col`}>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</span>
            <span className="text-2xl font-bold text-gray-900 mt-1">{value}</span>
        </div>
    );

    if (loading) return <div className="p-8 text-center pt-20">Loading inventory...</div>;
    if (!user) return <div className="p-8 text-center pt-20">Please log in as a pharmacy.</div>;

    const lowStockCount = inventory.filter(i => i.stock_quantity < 10).length;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user.pharmacy_name || 'Pharmacy'} Inventory</h1>
                        <p className="text-gray-500">Manage stock levels and medicine availability</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg"
                    >
                        <Plus className="w-5 h-5" /> Add Medicine
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <QuickStat label="Total Medicines" value={inventory.length} color="border-blue-100 bg-blue-50" />
                    <QuickStat label="Low Stock Items" value={lowStockCount} color="border-red-100 bg-red-50" />
                    <QuickStat label="Last Updated" value="Just Now" color="border-gray-100 bg-white" />
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by medicine or manufacturer..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => fetchInventory(user.pharmacy_id)} className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100" title="Refresh">
                                <RefreshCw className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Medicine Name</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Manufacturer</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Unit Price</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Stock Level</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInventory.length > 0 ? filteredInventory.map(item => (
                                    <tr key={item.medicine_instance_id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-gray-900">
                                            {item.medicine_name || 'Unknown'}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {item.manufacturer_name || 'Unknown'}
                                        </td>
                                        <td className="py-4 px-6 font-mono text-gray-700">
                                            ₹{item.price || 0}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.stock_quantity < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {item.stock_quantity} Units
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => handleEditClick(item)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 shadow-sm transition-all"
                                            >
                                                <Edit className="h-4 w-4" /> Update Stock
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-gray-500">No medicines found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Update Stock Modal */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Update Stock</h3>
                            <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <p className="text-sm text-gray-500 mb-1">Medicine</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {editingItem.medicine_name || 'Unknown'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-4 mb-8">
                                <button
                                    onClick={() => setNewStockValue(prev => Math.max(0, prev - 1))}
                                    className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                >
                                    <Minus className="h-6 w-6" />
                                </button>

                                <div className="text-center">
                                    <span className="text-4xl font-bold text-primary">{newStockValue}</span>
                                    <span className="block text-xs text-gray-400 uppercase font-medium mt-1">Units</span>
                                </div>

                                <button
                                    onClick={() => setNewStockValue(prev => prev + 1)}
                                    className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                >
                                    <Plus className="h-6 w-6" />
                                </button>
                            </div>

                            <button
                                onClick={handleUpdateStock}
                                className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
                            >
                                <Check className="h-5 w-5" /> Confirm Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Medicine Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-900">Add New Medicine</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Medicine Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                                <select
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 px-3 border"
                                    value={newMedicine.medicine}
                                    onChange={(e) => setNewMedicine({ ...newMedicine, medicine: e.target.value })}
                                >
                                    <option value="">Select Medicine</option>
                                    {medicines.map(med => (
                                        <option key={med.medicine_id} value={med.medicine_id}>
                                            {med.medicine_name} - {med.dosage_form}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-right">
                                    Medicine not listed?{' '}
                                    <button
                                        onClick={() => navigate('/medicine/new_medicine')}
                                        className="text-primary hover:text-primary-dark font-medium hover:underline"
                                    >
                                        Create new medicine
                                    </button>
                                </p>
                            </div>

                            {/* Manufacturer Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                                <select
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 px-3 border"
                                    value={newMedicine.manufacturer}
                                    onChange={(e) => setNewMedicine({ ...newMedicine, manufacturer: e.target.value })}
                                >
                                    <option value="">Select Manufacturer</option>
                                    {manufacturers.map(m => (
                                        <option key={m.manufacturer_id} value={m.manufacturer_id}>
                                            {m.manufacturer_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 px-3 border"
                                        value={newMedicine.price}
                                        onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 px-3 border"
                                        value={newMedicine.stock_quantity}
                                        onChange={(e) => setNewMedicine({ ...newMedicine, stock_quantity: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                <input
                                    type="date"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 px-3 border"
                                    value={newMedicine.expiry_date}
                                    onChange={(e) => setNewMedicine({ ...newMedicine, expiry_date: e.target.value })}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleAddStock}
                                    className="w-full btn-primary py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="h-5 w-5" /> Add to Inventory
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PharmacyDashboard;
