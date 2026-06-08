const nav = document.getElementById("nav");

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

function renderNav() {
    if (!nav) return;

    const token = localStorage.getItem("token");
    const user = parseJwt(token);

    if (!token || !user) {
        nav.innerHTML = `
            <a 
                href="login.html" 
                class="px-3 py-1 rounded hover:bg-gray-700 transition"
            >
                Вхід
            </a>
            <a 
                href="register.html" 
                class="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 transition"
            >
                Реєстрація
            </a>
        `;
    } else {
        nav.innerHTML = `
            <span class="text-sm md:text-base opacity-80">
                👋 ${user.email}
            </span>
            <button 
                onclick="logout()" 
                class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition w-full md:w-auto"
            >
                Вийти
            </button>
        `;
    }

    nav.className = "flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center";
}

function logout() {
    localStorage.removeItem("token");
    alert("Ви вийшли");
    window.location.href = "login.html";
}

renderNav();