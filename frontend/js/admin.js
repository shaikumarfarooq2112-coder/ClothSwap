const API = "https://clothswap-backend-ul42.onrender.com/api";


// ========================================
// CHECK LOGIN
// ========================================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


// ========================================
// COMMON HEADERS
// ========================================

const headers = {
    Authorization: `Bearer ${token}`
};


// ========================================
// LOAD ADMIN DASHBOARD
// ========================================

async function loadAdminDashboard() {

    try {

        const response = await fetch(
            `${API}/admin/dashboard`,
            {
                method: "GET",
                headers: headers
            }
        );


        const result = await response.json();


        console.log(
            "Admin Dashboard:",
            result
        );


        if (!response.ok) {

            alert(
                result.message ||
                "Unable to load admin dashboard."
            );

            return;
        }


        const stats =
            result.statistics;


        document.getElementById(
            "totalUsers"
        ).textContent =
            stats.totalUsers;


        document.getElementById(
            "totalListings"
        ).textContent =
            stats.totalListings;


        document.getElementById(
            "availableListings"
        ).textContent =
            stats.availableListings;


        document.getElementById(
            "swappedListings"
        ).textContent =
            stats.swappedListings;


        document.getElementById(
            "totalSwapRequests"
        ).textContent =
            stats.totalSwapRequests;


        document.getElementById(
            "pendingRequests"
        ).textContent =
            stats.pendingRequests;


        document.getElementById(
            "acceptedRequests"
        ).textContent =
            stats.acceptedRequests;


        document.getElementById(
            "rejectedRequests"
        ).textContent =
            stats.rejectedRequests;


    } catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );

    }
}


// ========================================
// LOAD USERS
// ========================================

async function loadUsers() {

    const container =
        document.getElementById(
            "usersContainer"
        );


    try {

        const response = await fetch(
            `${API}/admin/users`,
            {
                method: "GET",
                headers: headers
            }
        );


        const result =
            await response.json();


        console.log(
            "Users:",
            result
        );


        if (!response.ok) {

            container.innerHTML =
                `<p>
                    ${
                        result.message ||
                        "Unable to load users."
                    }
                </p>`;

            return;
        }


        const users =
            result.users || [];


        if (users.length === 0) {

            container.innerHTML =
                "<p>No users found.</p>";

            return;
        }


        container.innerHTML = "";


        users.forEach(user => {

            const card =
                document.createElement("div");


            card.className =
                "swap-card";


            card.innerHTML = `

                <h3>
                    ${user.name || "Unknown"}
                </h3>

                <p>
                    <strong>Email:</strong>
                    ${user.email || "Not available"}
                </p>

                <p>
                    <strong>Role:</strong>
                    ${user.role || "user"}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${
                        user.location?.city ||
                        "Not specified"
                    }

                    ${
                        user.location?.state
                            ? ", " +
                              user.location.state
                            : ""
                    }
                </p>

            `;


            container.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Users error:",
            error
        );


        container.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}


// ========================================
// LOAD LISTINGS
// ========================================

async function loadListings() {

    const container =
        document.getElementById(
            "listingsContainer"
        );


    try {

        const response = await fetch(
            `${API}/admin/listings`,
            {
                method: "GET",
                headers: headers
            }
        );


        const result =
            await response.json();


        console.log(
            "Listings:",
            result
        );


        if (!response.ok) {

            container.innerHTML =
                `<p>
                    ${
                        result.message ||
                        "Unable to load listings."
                    }
                </p>`;

            return;
        }


        const listings =
            result.listings || [];


        if (listings.length === 0) {

            container.innerHTML =
                "<p>No listings found.</p>";

            return;
        }


        container.innerHTML = "";


        listings.forEach(item => {

            const card =
                document.createElement("div");


            card.className =
                "swap-card";


            let imageHTML = "";


            if (
                item.images &&
                item.images.length > 0
            ) {

                imageHTML = `

                    <img
                        src="https://clothswap-backend-ul42.onrender.com${item.images[0]}"
                        alt="${item.title}"
                        style="
                            width: 150px;
                            height: 150px;
                            object-fit: cover;
                            border-radius: 10px;
                        "
                    >

                `;
            }


            card.innerHTML = `

                ${imageHTML}

                <h3>
                    ${item.title || "Untitled"}
                </h3>

                <p>
                    <strong>Brand:</strong>
                    ${item.brand || "Not specified"}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${item.category || "Not specified"}
                </p>

                <p>
                    <strong>Condition:</strong>
                    ${item.condition || "Not specified"}
                </p>

                <p>
                    <strong>Value:</strong>
                    ₹${item.estimatedValue || 0}
                </p>

                <p>
                    <strong>Owner:</strong>
                    ${item.owner?.name || "Unknown"}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${item.status || "available"}
                </p>

                <button
                    class="btn"
                    onclick="removeListing('${item._id}')">

                    🗑️ Remove Listing

                </button>

            `;


            container.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Listings error:",
            error
        );


        container.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}


// ========================================
// REMOVE LISTING
// ========================================

async function removeListing(id) {

    const confirmed =
        confirm(
            "Are you sure you want to remove this listing?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API}/admin/listings/${id}`,
            {
                method: "DELETE",
                headers: headers
            }
        );


        const result =
            await response.json();


        alert(
            result.message ||
            "Listing processed."
        );


        if (response.ok) {

            await loadAdminDashboard();

            await loadListings();

        }


    } catch (error) {

        console.error(
            "Remove listing error:",
            error
        );


        alert(
            "Unable to remove listing."
        );
    }
}


// ========================================
// LOAD SWAP REQUESTS
// ========================================

async function loadSwaps() {

    const container =
        document.getElementById(
            "swapsContainer"
        );


    try {

        const response = await fetch(
            `${API}/admin/swaps`,
            {
                method: "GET",
                headers: headers
            }
        );


        const result =
            await response.json();


        console.log(
            "Swap Requests:",
            result
        );


        if (!response.ok) {

            container.innerHTML =
                `<p>
                    ${
                        result.message ||
                        "Unable to load swap requests."
                    }
                </p>`;

            return;
        }


        const requests =
            result.requests || [];


        if (requests.length === 0) {

            container.innerHTML =
                "<p>No swap requests found.</p>";

            return;
        }


        container.innerHTML = "";


        requests.forEach(request => {

            const card =
                document.createElement("div");


            card.className =
                "swap-card";


            card.innerHTML = `

                <h3>
                    Swap Request
                </h3>

                <p>
                    <strong>Requester:</strong>
                    ${request.requester?.name || "Unknown"}
                </p>

                <p>
                    <strong>Receiver:</strong>
                    ${request.receiver?.name || "Unknown"}
                </p>

                <p>
                    <strong>Offered Item:</strong>
                    ${
                        request.offeredItem?.title ||
                        "Item unavailable"
                    }
                </p>

                <p>
                    <strong>Requested Item:</strong>
                    ${
                        request.requestedItem?.title ||
                        "Item unavailable"
                    }
                </p>

                <p>
                    <strong>Message:</strong>
                    ${request.message || "No message"}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${request.status || "Unknown"}
                </p>

            `;


            container.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Swap requests error:",
            error
        );


        container.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}


// ========================================
// LOGOUT
// ========================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "login.html";
}


// ========================================
// INITIAL LOAD
// ========================================

loadAdminDashboard();

loadUsers();

loadListings();

loadSwaps();