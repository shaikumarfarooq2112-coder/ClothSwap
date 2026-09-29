const API = "http://localhost:5000/api";

const token = localStorage.getItem("token");
const currentUser = JSON.parse(localStorage.getItem("user"));

const params = new URLSearchParams(window.location.search);
const requestedItemId = params.get("itemId");

const itemDetails = document.getElementById("itemDetails");
const offeredItem = document.getElementById("offeredItem");
const swapForm = document.getElementById("swapForm");
const swapMessage = document.getElementById("swapMessage");

let requestedItem = null;


// ==========================================
// CHECK LOGIN
// ==========================================

if (!token || !currentUser) {
    alert("Please login first.");
    window.location.href = "login.html";
}


// ==========================================
// LOAD REQUESTED CLOTHING
// ==========================================

async function loadRequestedItem() {

    if (!requestedItemId) {
        itemDetails.innerHTML = `
            <p style="color:red;">
                Requested clothing item is missing.
            </p>
        `;

        return;
    }

    try {

        const response = await fetch(
            `${API}/clothing/${requestedItemId}`
        );

        const data = await response.json();

        console.log("Requested item response:", data);

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load clothing item"
            );
        }

        requestedItem =
            data.clothing ||
            data.item ||
            data;

        if (!requestedItem || !requestedItem._id) {
            throw new Error("Clothing item data not found.");
        }

        // Get owner ID
        let ownerId = null;

        if (requestedItem.owner) {

            if (typeof requestedItem.owner === "object") {
                ownerId = requestedItem.owner._id;
            } else {
                ownerId = requestedItem.owner;
            }
        }

        requestedItem.receiverId = ownerId;

        console.log("Receiver ID:", ownerId);


        // Display requested clothing
        itemDetails.innerHTML = `

            <div class="feature-card">

                <h2>${requestedItem.title || "Clothing Item"}</h2>

                ${
                    requestedItem.images &&
                    requestedItem.images.length > 0
                    ?
                    `
                    <img
                        src="http://localhost:5000${requestedItem.images[0]}"
                        alt="${requestedItem.title}"
                        style="
                            width:250px;
                            max-width:100%;
                            border-radius:10px;
                            margin:10px 0;
                        "
                    >
                    `
                    :
                    ""
                }

                <p>
                    <strong>Description:</strong>
                    ${requestedItem.description || "No description"}
                </p>

                <p>
                    <strong>Brand:</strong>
                    ${requestedItem.brand || "N/A"}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${requestedItem.category || "N/A"}
                </p>

                <p>
                    <strong>Size:</strong>
                    ${requestedItem.size || "N/A"}
                </p>

                <p>
                    <strong>Condition:</strong>
                    ${requestedItem.condition || "N/A"}
                </p>

                <p>
                    <strong>Estimated Value:</strong>
                    ₹${requestedItem.estimatedValue || 0}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${requestedItem.location?.city || ""}
                    ${requestedItem.location?.state || ""}
                </p>

                <p>
                    <strong>Owner:</strong>
                    ${
                        typeof requestedItem.owner === "object"
                        ? requestedItem.owner.name || "Unknown"
                        : "Unknown"
                    }
                </p>

            </div>
        `;

    } catch (error) {

        console.error("Load requested item error:", error);

        itemDetails.innerHTML = `
            <p style="color:red;">
                Unable to load clothing item.
            </p>
        `;
    }
}


// ==========================================
// LOAD MY CLOTHES
// ==========================================

async function loadMyClothes() {

    try {

        const response = await fetch(`${API}/clothing`);

        const data = await response.json();

        console.log("All clothing:", data);

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load clothes"
            );
        }

        const clothes = data.clothing || [];

        offeredItem.innerHTML = `
            <option value="">Select an item</option>
        `;


        // Get current user's ID
        const currentUserId =
            currentUser._id ||
            currentUser.id ||
            currentUser.userId;

        console.log("Current user ID:", currentUserId);


        // Find only current user's clothes
        const myClothes = clothes.filter(item => {

            let ownerId = null;

            if (item.owner) {

                if (typeof item.owner === "object") {
                    ownerId = item.owner._id;
                } else {
                    ownerId = item.owner;
                }
            }

            return String(ownerId) === String(currentUserId);
        });


        console.log("My clothes:", myClothes);


        if (myClothes.length === 0) {

            offeredItem.innerHTML = `
                <option value="">
                    You have no available clothes
                </option>
            `;

            return;
        }


        // Add user's clothes to dropdown
        myClothes.forEach(item => {

            const option =
                document.createElement("option");

            option.value = item._id;

            option.textContent =
                `${item.title} - ${item.brand} - ${item.size}`;

            offeredItem.appendChild(option);
        });

    } catch (error) {

        console.error("Load my clothes error:", error);

        offeredItem.innerHTML = `
            <option value="">
                Unable to load your clothes
            </option>
        `;
    }
}


// ==========================================
// SEND SWAP REQUEST
// ==========================================

swapForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    const offeredItemId = offeredItem.value;

    const message =
        document.getElementById("message").value.trim();


    // Check requested item
    if (!requestedItemId) {

        alert("Requested clothing item is missing.");

        return;
    }


    // Check offered item
    if (!offeredItemId) {

        alert("Please select your clothing item.");

        return;
    }


    // Check requested item data
    if (!requestedItem) {

        alert(
            "Requested clothing information is not loaded yet."
        );

        return;
    }


    // Get receiver
    const receiverId =
        requestedItem.receiverId;


    if (!receiverId) {

        alert(
            "Unable to identify the clothing owner."
        );

        return;
    }


    console.log("Sending swap request:");
    console.log("Receiver:", receiverId);
    console.log("Offered Item:", offeredItemId);
    console.log("Requested Item:", requestedItemId);


    try {

        const response = await fetch(
            `${API}/swap`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({

                    receiver: receiverId,

                    offeredItem: offeredItemId,

                    requestedItem: requestedItemId,

                    message: message
                })
            }
        );


        const data = await response.json();

        console.log(
            "Swap request response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to send swap request"
            );
        }


        swapMessage.textContent =
            "Swap request sent successfully!";

        swapMessage.style.color = "green";


        // Go to swap requests page
        setTimeout(() => {

            window.location.href =
                "swap-requests.html";

        }, 1500);

    } catch (error) {

        console.error(
            "Swap request error:",
            error
        );

        swapMessage.textContent =
            error.message;

        swapMessage.style.color = "red";
    }

});


// ==========================================
// START
// ==========================================

loadRequestedItem();
loadMyClothes();