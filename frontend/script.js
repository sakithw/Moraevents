let events = [];

async function loadEvents() {
    try {
        const response = await fetch('http://localhost:5000/api/events');
        const data = await response.json();
        
        if (data.success) {
            events = data.events;
            
            if (document.getElementById('event-container')) {
                renderEvents(events.slice(0, 3), 'event-container');
            }
            if (document.getElementById('event-grid')) {
                renderEvents(events, 'event-grid');
            }
        }
    } catch (error) {
        const container = document.getElementById('event-container') || document.getElementById('event-grid');
        if (container) container.innerHTML = "<p>Error loading events.</p>";
    }
}

function renderEvents(data, targetId) {
    const grid = document.getElementById(targetId);
    if (!grid) return;

    grid.innerHTML = data.length ? "" : "<p class='text-center w-100'>No events found.</p>";

    data.forEach(event => {
        grid.innerHTML += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${event.img}" class="card-img-top" style="height:180px; object-fit:cover;">
                    <div class="card-body">
                        <span class="badge bg-primary mb-2">${event.category}</span>
                        <h5 class="card-title h6 fw-bold">${event.title}</h5>
                        <p class="card-text text-muted small mb-3">${event.date} | ${event.venue}</p>
                        <a href="event-view.html?id=${event._id}" class="btn btn-outline-primary btn-sm w-100">View Full Details</a>
                    </div>
                </div>
            </div>
        `;
    });
}

function filterEvents() {
    const category = document.getElementById('categoryFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    const filtered = events.filter(event => {
        const matchesCategory = (category === "All" || event.category === category);
        const matchesSearch = event.title.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    renderEvents(filtered, 'event-grid');
}

async function register(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please login first to register for events!");
        window.location.href = "auth.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/events/${id}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        if (data.success) {
            alert(data.message);
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        alert("Could not connect to the server.");
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

window.onload = () => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const navLinks = document.getElementById('navbar-links');

    if (token && userName && navLinks) {
        const loginBtn = navLinks.querySelector('.btn-primary');
        if (loginBtn) loginBtn.parentElement.remove();

        let adminButton = "";
        if (userRole === 'admin') {
            adminButton = `
                <li class="nav-item">
                    <a class="nav-link text-warning fw-bold" href="admin.html">⚙️ Admin Dashboard</a>
                </li>
            `;
        }

        navLinks.innerHTML += `
            ${adminButton}
            <li class="nav-item d-flex align-items-center ms-3">
                <span class="nav-link text-info fw-bold">Hi, ${userName}</span>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="logout()">Logout</a>
            </li>
        `;
    }

    loadEvents();
};