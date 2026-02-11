const BASE_URL = 'http://127.0.0.1:8000/api/v1'; // Updated to include API version

export const api = {
    // Patients
    getPatients: () => fetch(`${BASE_URL}/patients/`).then(res => res.json()),

    // Doctors
    getDoctors: () => fetch(`${BASE_URL}/doctors/`).then(res => res.json()),

    // Hospitals
    getHospitals: () => fetch(`${BASE_URL}/hospitals/`).then(res => res.json()), // Root of hospitals/ is now API

    // Appointments
    getAppointments: (patient_mobile = null, date = null) => {
        let url = `${BASE_URL}/appointments/`;
        const params = new URLSearchParams();
        if (patient_mobile) params.append('patient_mobile', patient_mobile);
        if (date) params.append('appointment_date', date);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        return fetch(url).then(res => res.json());
    },

    // Pharmacies
    getPharmacies: () => fetch(`${BASE_URL}/pharmacies/`).then(res => res.json()),

    // Medicines
    getMedicines: () => fetch(`${BASE_URL}/medicines/`).then(res => res.json()),
    createMedicine: (data) => fetch(`${BASE_URL}/medicines/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // Manufacturers
    getManufacturers: () => fetch(`${BASE_URL}/manufacturers/`).then(res => res.json()),
    createManufacturer: (data) => fetch(`${BASE_URL}/manufacturers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // Pharmacy Stock
    getPharmacyStock: (pharmacyId = null, pharmacyName = null) => {
        // If pharmacyId is provided, use the nested endpoint: /pharmacies/{id}/medicine/
        if (pharmacyId) {
            return fetch(`${BASE_URL}/pharmacies/${pharmacyId}/medicine/`).then(res => res.json());
        }

        // Otherwise use the general search endpoint (though currently not used by dashboard)
        let url = `${BASE_URL}/pharmacy-stock/`;
        const params = new URLSearchParams();
        if (pharmacyName) params.append('name', pharmacyName);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        return fetch(url).then(res => res.json());
    },

    // Specializations
    getSpecializations: () => fetch(`${BASE_URL}/specializations/`).then(res => res.json()),
    createSpecialization: (data) => fetch(`${BASE_URL}/specializations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // Associations (Doctor-Hospital)
    getDoctorHospitals: () => fetch(`${BASE_URL}/associations/`).then(res => res.json()),

    // Auth
    loginDoctor: (credentials) => fetch(`${BASE_URL}/login/doctor/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }).then(res => res.json()),

    loginHospital: (credentials) => fetch(`${BASE_URL}/login/hospital/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }).then(res => res.json()),

    loginPharmacy: (credentials) => fetch(`${BASE_URL}/login/pharmacy/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }).then(res => res.json()),

    // Registration (POST to respective list endpoints)
    registerPatient: (data) => fetch(`${BASE_URL}/patients/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    registerDoctor: (data) => fetch(`${BASE_URL}/doctors/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    registerHospital: (data) => fetch(`${BASE_URL}/hospitals/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    registerPharmacy: (data) => fetch(`${BASE_URL}/pharmacies/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // Patient OTP Login (Mock)
    loginPatient: (credentials) => {
        // In a real app, this would verify with backend
        return Promise.resolve({
            status: 'success',
            message: 'Logged in successfully',
            data: { mobileno: credentials.mobileno }
        });
    },

    // New Endpoints for Dashboard Logic
    inviteDoctor: (data) => fetch(`${BASE_URL}/associations/invite_doctor/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    respondInvite: (id, status) => fetch(`${BASE_URL}/associations/${id}/respond_invite/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    }).then(res => res.json()),

    toggleAvailability: (id) => fetch(`${BASE_URL}/associations/${id}/toggle_availability/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()),

    searchPharmacyStock: ({ medicine_name, pincode }) => {
        if (medicine_name && pincode) {
            return fetch(`${BASE_URL}/pharmacy-stock/medicine/${pincode}/?medicine_name=${encodeURIComponent(medicine_name)}`)
                .then(res => res.json());
        }
        // Fallback or other search logic if needed
        const query = new URLSearchParams({ name: medicine_name || '' }).toString();
        return fetch(`${BASE_URL}/pharmacy-stock/?${query}`).then(res => res.json());
    },

    bookHospitalAppointment: (data) => fetch(`${BASE_URL}/appointments/book-hospital/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    getHospitalAppointments: (hospitalId) => fetch(`${BASE_URL}/appointments/hospital-list/${hospitalId}/`).then(res => res.json()),

    updatePharmacyStock: (id, stock) => fetch(`${BASE_URL}/pharmacy-stock/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: stock })
    }).then(res => res.json()),

    addPharmacyStock: (data) => fetch(`${BASE_URL}/pharmacy-stock/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    updateAppointmentStatus: (id, status) => fetch(`${BASE_URL}/appointments/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_status: status })
    }).then(res => res.json())
};
