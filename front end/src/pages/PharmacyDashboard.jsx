import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pill, Search, RefreshCw, AlertTriangle, Check, X, Edit, Plus, Minus, Package, TrendingDown, Clock } from 'lucide-react';
import { api } from '../api';

const PharmacyDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [showAddModal, setShowAddModal] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [newMedicine, setNewMedicine] = useState({
        medicine: '', manufacturer: '', price: '', stock_quantity: '', expiry_date: '', pharmacy: ''
    });

    const [editingItem, setEditingItem] = useState(null);
    const [newStockValue, setNewStockValue] = useState(0);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.role === 'pharmacy') {
            const flatUser = storedUser.data ? { ...storedUser.data, role: storedUser.role } : storedUser;
            setUser(flatUser);
            const pharmacyId = id || flatUser.pharmacy_id;
            fetchInventory(pharmacyId);
            fetchDropdowns();
        } else {
            setLoading(false);
        }
    }, [id]);

    const fetchDropdowns = async () => {
        try {
            const [meds, manufs] = await Promise.all([api.getMedicines(), api.getManufacturers()]);
            setMedicines(meds);
            setManufacturers(manufs);
        } catch (error) { console.error("Failed to load dropdowns", error); }
    };

    const fetchInventory = async (pharmacyId) => {
        try {
            const res = await api.getPharmacyStock(pharmacyId);
            const data = Array.isArray(res) ? res : (res.results || []);
            setInventory(data);
            setFilteredInventory(data);
        } catch (error) { console.error("Failed to load inventory", error); }
        finally { setLoading(false); }
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
        setNewStockValue(item.stock_quantity);
    };

    const handleUpdateStock = async () => {
        if (!editingItem) return;
        try {
            const updatedList = inventory.map(item =>
                item.medicine_instance_id === editingItem.medicine_instance_id ? { ...item, stock_quantity: newStockValue } : item
            );
            setInventory(updatedList);
            setFilteredInventory(prev => prev.map(item =>
                item.medicine_instance_id === editingItem.medicine_instance_id ? { ...item, stock_quantity: newStockValue } : item
            ));
            await api.updatePharmacyStock(editingItem.medicine_instance_id, newStockValue);
            setEditingItem(null);
        } catch (error) {
            console.error("Failed to update stock", error);
            fetchInventory(user.pharmacy_id);
            alert("Failed to update stock.");
        }
    };

    const handleAddStock = async () => {
        if (!newMedicine.medicine || !newMedicine.manufacturer || !newMedicine.price || !newMedicine.stock_quantity || !newMedicine.expiry_date) {
            alert("Please fill all fields");
            return;
        }
        try {
            const payload = { ...newMedicine, pharmacy: user.pharmacy_id };
            await api.addPharmacyStock(payload);
            alert("Stock added successfully!");
            setShowAddModal(false);
            setNewMedicine({ medicine: '', manufacturer: '', price: '', stock_quantity: '', expiry_date: '', pharmacy: '' });
            fetchInventory(user.pharmacy_id);
        } catch (error) {
            console.error("Failed to add stock", error);
            alert("Failed to add stock. Please try again.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex items-center gap-3 text-teal-600">
                <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600" />
                <span className="font-medium">Loading inventory...</span>
            </div>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="card text-center max-w-md">
                <Pill className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Access Denied</h3>
                <p className="text-gray-500 mt-2">Please log in as a pharmacy to view this dashboard.</p>
            </div>
        </div>
    );

    const lowStockCount = inventory.filter(i => i.stock_quantity < 10).length;
    const totalStock = inventory.reduce((sum, i) => sum + (i.stock_quantity || 0), 0);

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-200">
                            <Pill className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user.pharmacy_name || 'Pharmacy'} Inventory</h1>
                            <p className="text-sm text-gray-500">Manage stock levels and medicine availability</p>
                        </div>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center justify-center gap-2">
                        <Plus className="h-5 w-5" /> Add Medicine
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Items</p>
                                <p className="text-3xl font-extrabold text-gray-900 mt-1">{inventory.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                                <Package className="h-6 w-6 text-teal-600" />
                            </div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Stock</p>
                                <p className="text-3xl font-extrabold text-gray-900 mt-1">{totalStock.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Pill className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Low Stock</p>
                                <p className={`text-3xl font-extrabold mt-1 ${lowStockCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>{lowStockCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                                <TrendingDown className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                <p className="text-xl font-extrabold text-gray-900 mt-1">Just Now</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
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
                                placeholder="Search by medicine or manufacturer..."
                                className="input-modern pl-11"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="badge badge-info">{filteredInventory.length} Results</span>
                            <button onClick={() => fetchInventory(user.pharmacy_id)} className="p-2.5 text-gray-400 hover:text-teal-600 rounded-xl hover:bg-teal-50 transition-colors" title="Refresh">
                                <RefreshCw className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    <th>Medicine Name</th>
                                    <th>Manufacturer</th>
                                    <th>Unit Price</th>
                                    <th>Stock Level</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInventory.length > 0 ? filteredInventory.map(item => (
                                    <tr key={item.medicine_instance_id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-sm">
                                                    <Pill className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-semibold text-gray-900">{item.medicine_name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="text-gray-600">{item.manufacturer_name || 'Unknown'}</td>
                                        <td>
                                            <span className="font-bold text-emerald-600">₹{item.price || 0}</span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {item.stock_quantity < 10 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                                                <span className={`badge ${item.stock_quantity < 10 ? 'badge-danger' : 'badge-success'}`}>
                                                    {item.stock_quantity} Units
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                onClick={() => handleEditClick(item)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl text-sm font-semibold shadow-sm shadow-teal-200 hover:shadow-md transition-all"
                                            >
                                                <Edit className="h-4 w-4" /> Update
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-gray-400">
                                            <Package className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                                            No medicines found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Update Stock Modal */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-elevated w-full max-w-sm overflow-hidden animate-slide-up border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-200">
                                    <Edit className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Update Stock</h3>
                            </div>
                            <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-6 text-center">
                                <p className="text-sm text-gray-500">Medicine</p>
                                <p className="text-lg font-bold text-gray-900">{editingItem.medicine_name || 'Unknown'}</p>
                            </div>

                            <div className="flex items-center justify-center gap-6 mb-8">
                                <button
                                    onClick={() => setNewStockValue(prev => Math.max(0, prev - 1))}
                                    className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                >
                                    <Minus className="h-6 w-6" />
                                </button>

                                <div className="text-center">
                                    <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">{newStockValue}</span>
                                    <span className="block text-xs text-gray-400 uppercase font-bold mt-1 tracking-wider">Units</span>
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
                                className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2"
                            >
                                <Check className="h-5 w-5" /> Confirm Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Medicine Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-elevated w-full max-w-lg overflow-hidden animate-slide-up border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-md shadow-rose-200">
                                    <Plus className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Add New Medicine</h3>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Medicine Name</label>
                                <select
                                    className="input-modern"
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
                                <p className="mt-1.5 text-xs text-right text-gray-400">
                                    Not listed?{' '}
                                    <button
                                        onClick={() => navigate('/medicine/new_medicine')}
                                        className="text-teal-600 hover:text-teal-700 font-semibold hover:underline"
                                    >
                                        Create new medicine
                                    </button>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Manufacturer</label>
                                <select
                                    className="input-modern"
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="input-modern"
                                        value={newMedicine.price}
                                        onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Quantity</label>
                                    <input
                                        type="number"
                                        className="input-modern"
                                        value={newMedicine.stock_quantity}
                                        onChange={(e) => setNewMedicine({ ...newMedicine, stock_quantity: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Expiry Date</label>
                                <input
                                    type="date"
                                    className="input-modern"
                                    value={newMedicine.expiry_date}
                                    onChange={(e) => setNewMedicine({ ...newMedicine, expiry_date: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={handleAddStock}
                                className="w-full btn-primary py-3.5 rounded-xl mt-4 flex items-center justify-center gap-2"
                            >
                                <Plus className="h-5 w-5" /> Add to Inventory
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PharmacyDashboard;
