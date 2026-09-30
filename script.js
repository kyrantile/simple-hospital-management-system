const STORAGE_KEY = 'hospital-management-system';

const defaultData = {
  patients: [
    { id: 1, name: 'Alice Johnson', age: 28, gender: 'Female', phone: '123-456-7890', condition: 'Flu' },
    { id: 2, name: 'Mark Lee', age: 52, gender: 'Male', phone: '111-222-3333', condition: 'Hypertension' }
  ],
  doctors: [
    { id: 1, name: 'Dr. Sarah Patel', specialty: 'General Medicine' },
    { id: 2, name: 'Dr. Daniel Kim', specialty: 'Cardiology' }
  ],
  appointments: [
    { id: 1, patientId: 1, doctorId: 1, date: '2026-10-02', time: '09:30' },
    { id: 2, patientId: 2, doctorId: 2, date: '2026-10-03', time: '11:00' }
  ]
};

function loadData() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return structuredClone(defaultData);
  }

  try {
    return JSON.parse(savedData);
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return structuredClone(defaultData);
  }
}

let hospitalData = loadData();

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hospitalData));
}

function renderStats() {
  document.getElementById('patientCount').textContent = hospitalData.patients.length;
  document.getElementById('doctorCount').textContent = hospitalData.doctors.length;
  document.getElementById('appointmentCount').textContent = hospitalData.appointments.length;
}

function getPatientName(patientId) {
  const patient = hospitalData.patients.find(item => item.id === patientId);
  return patient ? patient.name : 'Unknown Patient';
}

function getDoctorName(doctorId) {
  const doctor = hospitalData.doctors.find(item => item.id === doctorId);
  return doctor ? doctor.name : 'Unknown Doctor';
}

function populateSelects() {
  const patientSelect = document.getElementById('patientSelect');
  const doctorSelect = document.getElementById('doctorSelect');

  patientSelect.innerHTML = '<option value="">Select patient</option>' +
    hospitalData.patients.map(patient => `<option value="${patient.id}">${patient.name}</option>`).join('');

  doctorSelect.innerHTML = '<option value="">Select doctor</option>' +
    hospitalData.doctors.map(doctor => `<option value="${doctor.id}">${doctor.name}</option>`).join('');
}

function renderPatients() {
  const tbody = document.getElementById('patientTableBody');
  tbody.innerHTML = hospitalData.patients.map(patient => `
    <tr>
      <td>${patient.name}</td>
      <td>${patient.age}</td>
      <td>${patient.gender}</td>
      <td>${patient.phone}</td>
      <td>${patient.condition}</td>
      <td><button class="action-btn" data-type="patient" data-id="${patient.id}">Delete</button></td>
    </tr>
  `).join('');
}

function renderDoctors() {
  const tbody = document.getElementById('doctorTableBody');
  tbody.innerHTML = hospitalData.doctors.map(doctor => `
    <tr>
      <td>${doctor.name}</td>
      <td>${doctor.specialty}</td>
      <td><button class="action-btn" data-type="doctor" data-id="${doctor.id}">Delete</button></td>
    </tr>
  `).join('');
}

function renderAppointments() {
  const tbody = document.getElementById('appointmentTableBody');
  tbody.innerHTML = hospitalData.appointments.map(appointment => `
    <tr>
      <td>${getPatientName(appointment.patientId)}</td>
      <td>${getDoctorName(appointment.doctorId)}</td>
      <td>${appointment.date}</td>
      <td>${appointment.time}</td>
      <td><button class="action-btn" data-type="appointment" data-id="${appointment.id}">Delete</button></td>
    </tr>
  `).join('');
}

function renderDashboard() {
  renderStats();
  populateSelects();
  renderPatients();
  renderDoctors();
  renderAppointments();
}

document.getElementById('patientForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const patient = {
    id: Date.now(),
    name: formData.get('name').trim(),
    age: Number(formData.get('age')),
    gender: formData.get('gender'),
    phone: formData.get('phone').trim(),
    condition: formData.get('condition').trim()
  };

  hospitalData.patients.push(patient);
  saveData();
  renderDashboard();
  event.target.reset();
});

document.getElementById('doctorForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const doctor = {
    id: Date.now(),
    name: formData.get('name').trim(),
    specialty: formData.get('specialty').trim()
  };

  hospitalData.doctors.push(doctor);
  saveData();
  renderDashboard();
  event.target.reset();
});

document.getElementById('appointmentForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const appointment = {
    id: Date.now(),
    patientId: Number(formData.get('patientId')),
    doctorId: Number(formData.get('doctorId')),
    date: formData.get('date'),
    time: formData.get('time')
  };

  hospitalData.appointments.push(appointment);
  saveData();
  renderDashboard();
  event.target.reset();
});

document.addEventListener('click', function (event) {
  const button = event.target.closest('.action-btn');
  if (!button) return;

  const { type, id } = button.dataset;
  const numericId = Number(id);

  if (type === 'patient') {
    hospitalData.patients = hospitalData.patients.filter(item => item.id !== numericId);
    hospitalData.appointments = hospitalData.appointments.filter(item => item.patientId !== numericId);
  }

  if (type === 'doctor') {
    hospitalData.doctors = hospitalData.doctors.filter(item => item.id !== numericId);
    hospitalData.appointments = hospitalData.appointments.filter(item => item.doctorId !== numericId);
  }

  if (type === 'appointment') {
    hospitalData.appointments = hospitalData.appointments.filter(item => item.id !== numericId);
  }

  saveData();
  renderDashboard();
});

document.getElementById('resetData').addEventListener('click', function () {
  hospitalData = structuredClone(defaultData);
  saveData();
  renderDashboard();
});

renderDashboard();
