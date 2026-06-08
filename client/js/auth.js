const API = "http://localhost:3000/api/auth";

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
    
        if (username.length < 2) {
            alert("Ім'я занадто коротке");
            return;
        }

        const emailRejex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRejex.test(email)) {
            alert("Некоректний email");
            return;
        }

        if (password.length < 6) {
            alert("Пароль мінімум 6 символів");
            return;
        }

        try {
            const res = await fetch(`${API}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error);
                return;
            }

            alert("Реєстрація успішна!");
            window.location.href = "login.html";

        } catch (err) {
            console.error(err);
            alert("Помилка сервера");
        }

    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Заповніть всі поля");
            return;
        }

        try {
            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error);
                return;
            }

            localStorage.setItem("token", data.token);

            const user = parseJwt(data.token);

             alert("Вхід успішний!");

            if (user && user.role === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "index.html";
            }

        } catch (err) {
            console.error(err);
            alert("Помилка сервера");
        }

    });
}

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