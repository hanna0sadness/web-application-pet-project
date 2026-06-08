const token = localStorage.getItem("token");

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

const user = parseJwt(token);

if (!token || !user || user.role !== "admin") {
    alert("Доступ тільки для адміністратора");
    window.location.href = "index.html";
}

async function loadDashboard() {
    try {
        const res = await fetch("/api/dashboard", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        const container = document.getElementById("stats");

        container.innerHTML = `
            <div class="bg-white p-4 rounded-xl shadow">
                <div class="text-center text-gray-500">👤 Користувачі</div>
                <div class="text-center text-2xl font-bold">${data.totalUsers}</div>
            </div>

            <div class="bg-white p-4 rounded-xl shadow">
                <div class="text-center text-gray-500">📁 Датасети</div>
                <div class="text-center text-2xl font-bold">${data.totalDatasets}</div>
            </div>

            <div class="bg-white p-4 rounded-xl shadow">
                <div class="text-center text-gray-500">📊 Аналізи</div>
                <div class="text-center text-2xl font-bold">${data.totalResults}</div>
            </div>

            <div class="bg-white p-4 rounded-xl shadow">
                <div class="text-center text-gray-500">📈 Візуалізації</div>
                <div class="text-center text-2xl font-bold">${data.totalVisualizations}</div>
            </div>
        `;


    } catch (error) {
        console.error("❌ ADMIN ERROR: ", error);
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

loadDashboard();