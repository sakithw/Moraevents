document.addEventListener('DOMContentLoaded', loadAdminEvents);

let allEvents = [];

async function loadAdminEvents() {
    try {
        const response = await fetch('http://localhost:5000/api/events');
        const data = await response.json();
        allEvents = data.events;
        const list = document.getElementById('admin-event-list');
        list.innerHTML = "";

        allEvents.forEach(event => {
            list.innerHTML += `
                <tr>
                    <td class="fw-bold text-primary">${event.title}</td>
                    <td>${event.date}</td>
                    <td>${event.venue}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-warning me-1" onclick="openEditModal('${event._id}')">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent('${event._id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Failed to load events");
    }
}

function openEditModal(id) {
    const event = allEvents.find(e => e._id === id);
    if (!event) return;

    document.getElementById('editEventId').value = event._id;
    document.getElementById('editTitle').value = event.title;
    document.getElementById('editCategory').value = event.category;
    document.getElementById('editDate').value = event.date;
    document.getElementById('editTime').value = event.time;
    document.getElementById('editVenue').value = event.venue;
    document.getElementById('editImg').value = event.img || "";
    document.getElementById('editDesc').value = event.description;

    const modalElement = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEdit() {
    const id = document.getElementById('editEventId').value;
    const token = localStorage.getItem('token');
    
    const payload = {
        title: document.getElementById('editTitle').value,
        category: document.getElementById('editCategory').value,
        date: document.getElementById('editDate').value,
        time: document.getElementById('editTime').value,
        venue: document.getElementById('editVenue').value,
        img: document.getElementById('editImg').value,
        description: document.getElementById('editDesc').value
    };

    try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        if (data.success) {
            alert("Changes saved successfully!");
            location.reload();
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        alert("Server connection failed during update");
    }
}

async function handleAddEvent(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    
    const payload = {
        title: document.getElementById('eventTitle').value,
        category: document.getElementById('eventCategory').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        venue: document.getElementById('eventVenue').value,
        description: document.getElementById('eventDesc').value
    };

    const img = document.getElementById('eventImg').value;
    if (img) payload.img = img;

    try {
        const response = await fetch('http://localhost:5000/api/events', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        if (data.success) {
            alert("New Event Published!");
            location.reload();
        }
    } catch (error) {
        alert("Error creating event");
    }
}

async function deleteEvent(id) {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        if (data.success) {
            alert("Event removed.");
            loadAdminEvents();
        }
    } catch (error) {
        alert("Failed to delete event");
    }
}