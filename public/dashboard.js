const API_URL = 'http://app.local:3000';
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = '/';
}

document.getElementById('username').textContent = user.username || 'Admin';

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
});

// Menu navigation
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.dataset.section;

        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

        e.target.classList.add('active');
        document.getElementById(`${section}-section`).classList.add('active');

        if (section === 'absences') {
            loadAbsences();
        }
    });
});

// Message form
const messageError = document.getElementById('messageError');
const messageSuccess = document.getElementById('messageSuccess');

function showMessageError(message) {
    messageError.textContent = message;
    messageError.style.display = 'block';
    messageSuccess.style.display = 'none';
    setTimeout(() => messageError.style.display = 'none', 5000);
}

function showMessageSuccess(message) {
    messageSuccess.textContent = message;
    messageSuccess.style.display = 'block';
    messageError.style.display = 'none';
    setTimeout(() => messageSuccess.style.display = 'none', 5000);
}

document.getElementById('messageForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('messageTitle').value.trim();
    const message = document.getElementById('messageContent').value.trim();

    if (!title || !message) {
        showMessageError('Udfyld venligst alle felter');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/message/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                sender_id: user.id,
                title: title,
                message: message
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showMessageSuccess('Besked sendt!');
            document.getElementById('messageForm').reset();
        } else {
            showMessageError('Kunne ikke sende besked');
        }
    } catch (error) {
        showMessageError('Kunne ikke forbinde til serveren');
        console.error('Message error:', error);
    }
});

// Load absences
async function loadAbsences() {
    try {
        const response = await fetch(`${API_URL}/absence/all`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch absences');

        const absences = await response.json();
        renderAbsenceTable(absences);
    } catch (error) {
        console.error('Error loading absences:', error);
        showAbsenceError('Kunne ikke indlæse fravær');
    }
}

function renderAbsenceTable(absences) {
    const tbody = document.getElementById('absenceTableBody');
    tbody.innerHTML = '';

    if (absences.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Ingen fraværsanmodninger</td></tr>';
        return;
    }

    absences.forEach(absence => {
        const row = document.createElement('tr');

        const statusClass = `status-${absence.status}`;

        row.innerHTML = `
            <td>${absence.user}</td>
            <td>${absence.date}</td>
            <td>${absence.type}</td>
            <td>${absence.reason}</td>
            <td><span class="status-badge ${statusClass}">${absence.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-approve" onclick="updateAbsenceStatus(${absence.id}, 'godkendt')">
                        Godkend
                    </button>
                    <button class="btn-reject" onclick="updateAbsenceStatus(${absence.id}, 'afvist')">
                        Afvis
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });
}

async function updateAbsenceStatus(absenceId, status) {
    try {
        const response = await fetch(`${API_URL}/absence/${absenceId}/set/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) throw new Error('Failed to update status');

        loadAbsences();
    } catch (error) {
        console.error('Error updating absence:', error);
        alert('Kunne ikke opdatere fraværsstatus');
    }
}

function showAbsenceError(message) {
    const tbody = document.getElementById('absenceTableBody');
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #e74c3c;">${message}</td></tr>`;
}
