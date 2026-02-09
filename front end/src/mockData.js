
export const MOCK_DOCTORS = [
    {
        id: 'D1',
        name: 'Dr. Sarah Smith',
        specialization: 'Cardiologist',
        hospital: 'City General Hospital',
        fees: 500,
        distance: 2.5,
        nextAvailable: 'T4 (10:30 AM)',
        rating: 4.8
    },
    {
        id: 'D2',
        name: 'Dr. John Doe',
        specialization: 'General Physician',
        hospital: 'Sunrise Clinic',
        fees: 300,
        distance: 1.2,
        nextAvailable: 'T2 (10:00 AM)',
        rating: 4.5
    },
    {
        id: 'D3',
        name: 'Dr. Emily Chen',
        specialization: 'Pediatrician',
        hospital: 'Kids Care Center',
        fees: 600,
        distance: 5.0,
        nextAvailable: 'T1 (Now)',
        rating: 4.9
    }
];

export const MOCK_HOSPITALS = [
    {
        id: 'H1',
        name: 'City General Hospital',
        location: 'Downtown',
        distance: 2.5,
        availableBeds: 15,
        rating: 4.7
    },
    {
        id: 'H2',
        name: 'Sunrise Clinic',
        location: 'Westside',
        distance: 1.2,
        availableBeds: 0,
        rating: 4.4
    }
];

export const MOCK_APPOINTMENTS = [
    { id: 'A1', token: 'T1', patientName: 'Rahul Kumar', time: '10:00 AM', status: 'pending', hospitalId: 'H1' },
    { id: 'A2', token: 'T2', patientName: 'Priya Sharma', time: '10:15 AM', status: 'pending', hospitalId: 'H1' },
    { id: 'A3', token: 'T3', patientName: 'Amit Singh', time: '10:30 AM', status: 'pending', hospitalId: 'H2' },
    { id: 'A4', token: 'T4', patientName: 'Sneha Gupta', time: '10:45 AM', status: 'completed', hospitalId: 'H1' },
    { id: 'A5', token: 'T1', patientName: 'Vikram Malhotra', time: '10:30 AM', status: 'pending', hospitalId: 'H2' },
];

export const DOCTOR_HOSPITALS = [
    { id: 'H1', name: 'City General Hospital' },
    { id: 'H2', name: 'Sunrise Clinic' }
];

export const MOCK_INVENTORY = [
    { id: 'M1', name: 'Paracetamol 500mg', manufacturer: 'GSK', stock: 150, expiry: '2025-12', price: 20 },
    { id: 'M2', name: 'Azithromycin 500mg', manufacturer: 'Cipla', stock: 8, expiry: '2024-08', price: 45 },
    { id: 'M3', name: 'Vitamin C', manufacturer: 'Abbott', stock: 50, expiry: '2026-01', price: 15 },
    { id: 'M4', name: 'Insulin Glargine', manufacturer: 'Sanofi', stock: 5, expiry: '2024-05', price: 450 },
];
