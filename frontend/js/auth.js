
const API = "https://clothswap-backend-ul42.onrender.com/api";

// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const data = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            phone: document.getElementById("phone").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value
        };

        try {
            const response = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            document.getElementById("message").textContent =
                result.message || "Registration completed.";

            if (response.ok) {
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);
            }

        } catch (error) {
            document.getElementById("message").textContent =
                "Unable to connect to server.";

            console.error(error);
        }
    });
}


// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (!response.ok) {
                document.getElementById("message").textContent =
                    result.message || "Invalid login details.";
                return;
            }

            // SAVE TOKEN
            localStorage.setItem("token", result.token);

            // SAVE USER
            localStorage.setItem("user", JSON.stringify(result.user));

            document.getElementById("message").textContent =
                "Login successful!";

            // RETURN TO THE PAGE THAT REQUIRED LOGIN
            const redirectURL = sessionStorage.getItem("clothSwapRedirect");

            if (redirectURL) {
                sessionStorage.removeItem("clothSwapRedirect");

                setTimeout(() => {
                    window.location.href = redirectURL;
                }, 800);

            } else {
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 800);
            }

        } catch (error) {
            document.getElementById("message").textContent =
                "Unable to connect to server.";

            console.error(error);
        }
    });
}
