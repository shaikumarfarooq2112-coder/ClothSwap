const API = "http://localhost:5000/api";

const token = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");

// Check login
if (!token) {
    window.location.href = "login.html";
}


// ========================================
// LOAD DASHBOARD
// ========================================

async function loadDashboard() {

    // --------------------------------
    // GET SAVED USER
    // --------------------------------

    let user = null;

    try {
        user = JSON.parse(savedUser);
    } catch (error) {
        console.error("User data error:", error);
    }


    if (!user) {

        document.getElementById("userName").textContent =
            "User";

        document.getElementById("userEmail").textContent =
            "";

        return;
    }


    console.log("Logged-in user:", user);


    // --------------------------------
    // SHOW NAME AND EMAIL
    // --------------------------------

    document.getElementById("userName").textContent =
        user.name || "User";

    document.getElementById("userEmail").textContent =
        user.email || "";


    // --------------------------------
    // GET USER ID
    // --------------------------------

    const userId = user._id || user.id;


    console.log("User ID:", userId);


    // --------------------------------
    // LOAD CLOTHING LISTINGS
    // --------------------------------

    try {

        const response = await fetch(
            `${API}/clothing`
        );

        const result = await response.json();

        console.log("Clothing:", result);


        const clothing =
            result.clothing || [];


        // Find this user's listings
        const myListings = clothing.filter(item => {

            const ownerId =
                typeof item.owner === "object"
                    ? item.owner._id
                    : item.owner;

            return ownerId === userId;
        });


        document.getElementById("listingCount").textContent =
            `${myListings.length} listing(s)`;


    } catch (error) {

        console.error(
            "Clothing error:",
            error
        );

        document.getElementById("listingCount").textContent =
            "Unable to load";
    }


    // --------------------------------
    // LOAD SWAP REQUESTS
    // --------------------------------

    try {

        const response = await fetch(
            `${API}/swap/sent`,
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


        const result =
            await response.json();


        console.log(
            "Swap requests:",
            result
        );


        if (!response.ok) {

            document.getElementById("swapCount").textContent =
                "Unable to load";

            return;
        }


        const requests =
            result.requests || [];


        document.getElementById("swapCount").textContent =
            `${requests.length} request(s)`;


    } catch (error) {

        console.error(
            "Swap error:",
            error
        );

        document.getElementById("swapCount").textContent =
            "Unable to load";
    }
}


// ========================================
// LOGOUT
// ========================================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}


// ========================================
// START
// ========================================

loadDashboard();