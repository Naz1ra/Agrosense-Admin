/* script.js */

// --- Authentication Logic ---
function login(event) {
    event.preventDefault(); 
    window.location.href = 'dashboard.html';
}

// --- Global Utility: Show Toast Notification ---
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-4 right-4 z-[100] flex flex-col gap-2';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-600' : (type === 'error' ? 'bg-red-600' : 'bg-blue-600');
    toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium transform transition-all duration-300 translate-y-10 opacity-0 flex items-center`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'} mr-2"></i> ${message}`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Sidebar Toggle for Mobile ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('hidden');
        sidebar.classList.toggle('absolute');
        sidebar.classList.toggle('z-50');
        sidebar.classList.toggle('h-full');
    }
}

// --- User Management Logic ---
let userModal, userForm, viewModal, editModal, editForm;

function openUserModal() {
    if (!userModal) userModal = document.getElementById('userModal');
    if (userModal) {
        userModal.classList.remove('hidden');
        userModal.classList.add('flex');
    }
}

function closeUserModal() {
    if (userModal) {
        userModal.classList.add('hidden');
        userModal.classList.remove('flex');
    }
}

function submitNewUser(event) {
    event.preventDefault();
    const name = document.getElementById('newUserName').value;
    const email = document.getElementById('newUserEmail').value;
    const phone = document.getElementById('newUserPhone').value;
    const location = document.getElementById('newUserLocation').value;

    const tableBody = document.getElementById('userTableBody');
    if (tableBody) {
        const newRow = document.createElement('tr');
        newRow.className = 'hover:bg-gray-50';
        newRow.innerHTML = `
            <td class="px-6 py-4">${name}</td>
            <td class="px-6 py-4">${email}</td>
            <td class="px-6 py-4">${phone}</td>
            <td class="px-6 py-4">${location}</td>
            <td class="px-6 py-4">${new Date().toISOString().split('T')[0]}</td>
            <td class="px-6 py-4"><span class="text-green-600 font-medium text-xs">Active</span></td>
            <td class="px-6 py-4 text-center space-x-3 text-gray-400">
                <i class="fa-solid fa-eye hover:text-blue-500 cursor-pointer" onclick="viewUser(this)"></i>
                <i class="fa-solid fa-pen hover:text-green-500 cursor-pointer" onclick="openEditModal(this)"></i>
                <i class="fa-solid fa-trash hover:text-red-500 cursor-pointer" onclick="deleteUserRow(this)"></i>
            </td>
        `;
        tableBody.insertBefore(newRow, tableBody.firstChild);
        showToast('New farmer added successfully!');
        closeUserModal();
        userForm.reset();
    }
}

// --- NEW: View User Function ---
function viewUser(iconElement) {
    const row = iconElement.closest('tr');
    const name = row.cells[0].textContent;
    const email = row.cells[1].textContent;
    const phone = row.cells[2].textContent;
    const location = row.cells[3].textContent;
    const date = row.cells[4].textContent;
    const status = row.cells[5].textContent.trim();

    if (!viewModal) viewModal = document.getElementById('viewModal');
    
    // Populate the view modal fields
    document.getElementById('viewUserName').textContent = name;
    document.getElementById('viewUserEmail').textContent = email;
    document.getElementById('viewUserPhone').textContent = phone;
    document.getElementById('viewUserLocation').textContent = location;
    document.getElementById('viewUserDate').textContent = date;
    
    const statusBadge = document.getElementById('viewUserStatus');
    statusBadge.textContent = status;
    if(status === 'Active') {
        statusBadge.className = 'text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded';
    } else {
        statusBadge.className = 'text-gray-500 font-medium text-xs bg-gray-200 px-2 py-1 rounded';
    }

    viewModal.classList.remove('hidden');
    viewModal.classList.add('flex');
}

function closeViewModal() {
    if (viewModal) {
        viewModal.classList.add('hidden');
        viewModal.classList.remove('flex');
    }
}

// --- NEW: Edit User Functions ---
function openEditModal(iconElement) {
    const row = iconElement.closest('tr');
    
    // Get data from the table row
    const name = row.cells[0].textContent;
    const email = row.cells[1].textContent;
    const phone = row.cells[2].textContent;
    const location = row.cells[3].textContent;
    const status = row.cells[5].textContent.trim();

    if (!editModal) editModal = document.getElementById('editModal');
    if (!editForm) editForm = document.getElementById('editForm');

    // Store the row reference on the form so we know which row to update
    editForm.dataset.targetRowIndex = Array.from(row.parentNode.children).indexOf(row);

    // Populate the edit modal fields
    document.getElementById('editUserName').value = name;
    document.getElementById('editUserEmail').value = email;
    document.getElementById('editUserPhone').value = phone;
    document.getElementById('editUserLocation').value = location;
    document.getElementById('editUserStatus').value = status;

    editModal.classList.remove('hidden');
    editModal.classList.add('flex');
}

function closeEditModal() {
    if (editModal) {
        editModal.classList.add('hidden');
        editModal.classList.remove('flex');
    }
}

function submitEditUser(event) {
    event.preventDefault();
    
    const targetIndex = editForm.dataset.targetRowIndex;
    const tableBody = document.getElementById('userTableBody');
    const row = tableBody.children[targetIndex];

    // Get new values from the form
    const newName = document.getElementById('editUserName').value;
    const newEmail = document.getElementById('editUserEmail').value;
    const newPhone = document.getElementById('editUserPhone').value;
    const newLocation = document.getElementById('editUserLocation').value;
    const newStatus = document.getElementById('editUserStatus').value;

    // Update the table row cells
    row.cells[0].textContent = newName;
    row.cells[1].textContent = newEmail;
    row.cells[2].textContent = newPhone;
    row.cells[3].textContent = newLocation;
    
    const statusCell = row.cells[5];
    if (newStatus === 'Active') {
        statusCell.innerHTML = `<span class="text-green-600 font-medium text-xs">Active</span>`;
    } else {
        statusCell.innerHTML = `<span class="text-gray-500 font-medium text-xs bg-gray-200 px-2 py-1 rounded">Inactive</span>`;
    }

    showToast('User details updated successfully!');
    closeEditModal();
}

// --- Delete User Function ---
function deleteUserRow(iconElement) {
    if (confirm('Are you sure you want to delete this user?')) {
        const row = iconElement.closest('tr');
        row.style.transition = 'opacity 0.3s';
        row.style.opacity = '0';
        setTimeout(() => {
            row.remove();
            showToast('User deleted.', 'error');
        }, 300);
    }
}

function filterUsers() {
    const searchInput = document.getElementById('userSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value.toLowerCase();
    const tableBody = document.getElementById('userTableBody');
    const rows = tableBody.getElementsByTagName('tr');

    for (let row of rows) {
        const name = row.cells[0].textContent.toLowerCase();
        const email = row.cells[1].textContent.toLowerCase();
        const location = row.cells[3].textContent.toLowerCase();
        const status = row.cells[5].textContent.toLowerCase().trim();

        const matchesSearch = name.includes(searchInput) || email.includes(searchInput) || location.includes(searchInput);
        const matchesStatus = statusFilter === 'all status' || status === statusFilter;

        if (matchesSearch && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

function exportCSV() {
    const table = document.getElementById('userTable');
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = [], cols = rows[i].querySelectorAll('td, th');
        for (let j = 0; j < cols.length - 1; j++) {
            row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
        }
        csv.push(row.join(','));
    }

    const csvFile = new Blob([csv.join('\n')], {type: 'text/csv'});
    const downloadLink = document.createElement('a');
    downloadLink.download = 'agrosense_users.csv';
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    showToast('CSV Exported successfully!');
}

// --- Settings Logic ---
function updateSliderValue(sliderId, outputId, suffix = '') {
    const slider = document.getElementById(sliderId);
    const output = document.getElementById(outputId);
    if (slider && output) {
        output.textContent = slider.value + suffix;
    }
}

function saveDefaults() {
    showToast('Global irrigation defaults saved!');
}

function toggleSwitch(element) {
    const dot = element.querySelector('div');
    if (element.classList.contains('bg-green-500')) {
        element.classList.replace('bg-green-500', 'bg-gray-300');
        dot.classList.replace('right-1', 'left-1');
        showToast('Setting disabled', 'info');
    } else {
        element.classList.replace('bg-gray-300', 'bg-green-500');
        dot.classList.replace('left-1', 'right-1');
        showToast('Setting enabled');
    }
}

// --- Chart.js Implementations ---
document.addEventListener("DOMContentLoaded", function() {
    const waterChartCanvas = document.getElementById('waterChart');
    if (waterChartCanvas) {
        const ctxWater = waterChartCanvas.getContext('2d');
        new Chart(ctxWater, {
            type: 'bar',
            data: {
                labels: ['Day 1-5', 'Day 6-10', 'Day 11-15', 'Day 16-20', 'Day 21-25', 'Day 26-30'],
                datasets: [{ label: 'Water Usage (L)', data: [850, 920, 780, 810, 950, 820], backgroundColor: '#0ea5e9', borderRadius: 4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });

        const accChartCanvas = document.getElementById('accuracyChart');
        if(accChartCanvas) {
            const ctxAcc = accChartCanvas.getContext('2d');
            new Chart(ctxAcc, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{ label: 'Accuracy', data: [82, 83, 86, 90.8], borderColor: '#9333ea', backgroundColor: '#9333ea', tension: 0.1, pointRadius: 4 }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });
        }
    }

    const aiFarmChartCanvas = document.getElementById('aiFarmChart');
    if (aiFarmChartCanvas) {
        const ctxAi = aiFarmChartCanvas.getContext('2d');
        new Chart(ctxAi, {
            type: 'bar',
            data: {
                labels: ['Ahmad H.', 'Fatima A.', 'Mohd I.', 'Sarah A.', 'Ali K.', 'Noor H.'],
                datasets: [{ label: 'Confidence (%)', data: [78, 92, 85, 81, 88, 84], backgroundColor: '#a855f7', borderRadius: 4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
        });
    }
});