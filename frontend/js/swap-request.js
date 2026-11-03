const API = "https://clothswap-backend-ul42.onrender.com/api";

const token = localStorage.getItem("token");
const currentUser = JSON.parse(localStorage.getItem("user") || "null");

const params = new URLSearchParams(window.location.search);
const requestedItemId = params.get("itemId");

const itemDetails = document.getElementById("itemDetails");
const offeredItem = document.getElementById("offeredItem");
const offeredItemSearch = document.getElementById("offeredItemSearch");
const clothingSuggestions = document.getElementById("clothingSuggestions");
const selectedClothing = document.getElementById("selectedClothing");
const swapForm = document.getElementById("swapForm");
const swapMessage = document.getElementById("swapMessage");

// Swap calculator elements
const swapValueComparison = document.getElementById("swapValueComparison");
const offeredItemValue = document.getElementById("offeredItemValue");
const requestedItemValue = document.getElementById("requestedItemValue");
const swapValueDifference = document.getElementById("swapValueDifference");
const swapValueStatus = document.getElementById("swapValueStatus");

let requestedItem = null;
let myClothes = [];
let selectedClothingItem = null;


// ==========================================
// CHECK LOGIN
// ==========================================

if (!token || !currentUser) {
    alert("Please login first.");
    window.location.href = "login.html";
}


// ==========================================
// HELPER: GET OWNER ID
// ==========================================

function getOwnerId(owner) {
    if (!owner) return null;

    if (typeof owner === "object") {
        return owner._id || owner.id || null;
    }

    return owner;
}


// ==========================================
// HELPER: GET IMAGE URL
// ==========================================

function getImageUrl(image) {
    if (!image) return "";

    if (image.startsWith("http")) {
        return image;
    }

    return `https://clothswap-backend-ul42.onrender.com${image}`;
}


// ==========================================
// HELPER: FORMAT CURRENCY
// ==========================================

function formatCurrency(value) {
    return Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}


// ==========================================
// RESET SWAP VALUE COMPARISON
// ==========================================

function resetSwapComparison() {
    if (!swapValueComparison) return;

    swapValueComparison.style.display = "none";

    offeredItemValue.textContent = "₹0";
    requestedItemValue.textContent = "₹0";
    swapValueDifference.textContent = "₹0";

    swapValueStatus.textContent = "";
    swapValueStatus.className = "";
}


// ==========================================
// CALCULATE SWAP VALUE COMPARISON
// ==========================================


function calculateSwapValue() {

    if (
        !requestedItem ||
        !selectedClothingItem ||
        !swapValueComparison
    ) {
        resetSwapComparison();
        return;
    }

    const offeredValue = Number(selectedClothingItem.estimatedValue);
    const requestedValue = Number(requestedItem.estimatedValue);

    if (
        !Number.isFinite(offeredValue) ||
        !Number.isFinite(requestedValue) ||
        offeredValue < 0 ||
        requestedValue < 0
    ) {
        resetSwapComparison();
        swapValueComparison.style.display = "block";
        swapValueStatus.textContent =
            "Unable to compare values. Please check the item details.";
        swapValueStatus.className = "value-lower";
        return;
    }

    const difference = Math.abs(offeredValue - requestedValue);

    offeredItemValue.textContent =
        `₹${formatCurrency(offeredValue)}`;

    requestedItemValue.textContent =
        `₹${formatCurrency(requestedValue)}`;

    swapValueDifference.textContent =
        `₹${formatCurrency(difference)}`;

    swapValueComparison.style.display = "block";
    swapValueStatus.className = "";

    if (difference === 0) {

        swapValueStatus.textContent =
            "Fair Swap! Both items have equal estimated values. This looks like a balanced exchange.";

        swapValueStatus.classList.add("value-equal");

    } else if (offeredValue < requestedValue) {

        swapValueStatus.textContent =
            `Your item has a lower estimated value by ₹${formatCurrency(difference)}. Consider offering an additional item or negotiating with the owner.`;

        swapValueStatus.classList.add("value-lower");

    } else {

        swapValueStatus.textContent =
            `Your item has a higher estimated value by ₹${formatCurrency(difference)}. You may negotiate for an additional item or a fair exchange.`;

        swapValueStatus.classList.add("value-higher");
    }
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

        const ownerId = getOwnerId(requestedItem.owner);

        requestedItem.receiverId = ownerId;

        console.log("Receiver ID:", ownerId);

        const image = Array.isArray(requestedItem.images)
            ? requestedItem.images[0]
            : requestedItem.images;

        const imageHTML = image
            ? `
                <img
                    src="${getImageUrl(image)}"
                    alt="${requestedItem.title || "Clothing item"}"
                    style="
                        width:250px;
                        max-width:100%;
                        border-radius:10px;
                        margin:10px 0;
                        object-fit:cover;
                    "
                    onerror="this.style.display='none'"
                >
            `
            : "<p>No image available</p>";

        itemDetails.innerHTML = `
            <div class="feature-card">

                <h2>${requestedItem.title || "Clothing Item"}</h2>

                ${imageHTML}

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
                    ₹${formatCurrency(requestedItem.estimatedValue || 0)}
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

        // Update calculator if an item is already selected
        calculateSwapValue();

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
// DISPLAY SEARCH SUGGESTIONS
// ==========================================

function displayMyClothes(searchText = "") {

    clothingSuggestions.innerHTML = "";
    clothingSuggestions.style.display = "none";

    const search = searchText.toLowerCase().trim();

    if (!search) {
        return;
    }

    const filteredClothes = myClothes
        .filter(item => {

            const searchableText = `
                ${item.title || ""}
                ${item.brand || ""}
                ${item.category || ""}
                ${item.size || ""}
            `.toLowerCase();

            return searchableText.includes(search);
        })
        .sort((a, b) => {

            const titleA = (a.title || "").toLowerCase();
            const titleB = (b.title || "").toLowerCase();

            if (titleA === search) return -1;
            if (titleB === search) return 1;

            if (titleA.startsWith(search) && !titleB.startsWith(search)) return -1;
            if (titleB.startsWith(search) && !titleA.startsWith(search)) return 1;

            return titleA.localeCompare(titleB);
        });

    if (filteredClothes.length === 0) {

        const noResult = document.createElement("div");

        noResult.textContent = "No matching clothes found.";

        noResult.style.padding = "12px";
        noResult.style.color = "#777";

        clothingSuggestions.appendChild(noResult);
        clothingSuggestions.style.display = "block";

        return;
    }

    filteredClothes.forEach(item => {

        const suggestion = document.createElement("div");

        suggestion.className = "clothing-suggestion";

        suggestion.textContent =
            `${item.title || "Clothing"} - ${item.brand || "N/A"} - Size ${item.size || "N/A"}`;

        suggestion.addEventListener("mousedown", function(event) {

            event.preventDefault();

            selectClothing(item);

        });

        clothingSuggestions.appendChild(suggestion);
    });

    clothingSuggestions.style.display = "block";
}


// ==========================================
// SELECT CLOTHING
// ==========================================

function selectClothing(item) {

    selectedClothingItem = item;

    offeredItem.value = item._id;

    offeredItemSearch.value = item.title || "Clothing";

    selectedClothing.textContent =
        `Selected: ${item.title || "Clothing"}`;

    clothingSuggestions.innerHTML = "";
    clothingSuggestions.style.display = "none";

    console.log("Selected clothing:", item);

    // Calculate comparison after selecting clothing
    calculateSwapValue();
}


// ==========================================
// SEARCH INPUT EVENT
// ==========================================

offeredItemSearch.addEventListener("input", function() {

    offeredItem.value = "";

    selectedClothingItem = null;

    selectedClothing.textContent = "";

    // Hide old comparison when search changes
    resetSwapComparison();

    displayMyClothes(this.value);

});


// Hide suggestions when clicking outside

document.addEventListener("click", function(event) {

    if (
        !offeredItemSearch.contains(event.target) &&
        !clothingSuggestions.contains(event.target)
    ) {
        clothingSuggestions.style.display = "none";
    }

});


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

        const currentUserId =
            currentUser._id ||
            currentUser.id ||
            currentUser.userId;

        console.log("Current user ID:", currentUserId);

        if (!currentUserId) {
            throw new Error("Unable to identify logged-in user.");
        }

        myClothes = clothes.filter(item => {

            const ownerId = getOwnerId(item.owner);

            return (
                String(ownerId) === String(currentUserId) &&
                String(item._id) !== String(requestedItemId)
            );
        });

        console.log("My clothes:", myClothes);

        if (myClothes.length === 0) {

            offeredItemSearch.placeholder =
                "You have no clothing listings. Add one first.";

        } else {

            offeredItemSearch.placeholder =
                "Type clothing name, brand or size...";

        }

    } catch (error) {

        console.error("Load my clothes error:", error);

        offeredItemSearch.placeholder =
            "Unable to load your clothes";

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

    if (!requestedItemId) {
        alert("Requested clothing item is missing.");
        return;
    }

    if (!offeredItemId || !selectedClothingItem) {
        alert("Please select your clothing item from the suggestions.");
        offeredItemSearch.focus();
        return;
    }

    if (!requestedItem) {
        alert("Requested clothing information is not loaded yet.");
        return;
    }

    const selectedItem = myClothes.find(
        item => String(item._id) === String(offeredItemId)
    );

    if (!selectedItem) {
        alert("Please select one of your own clothing items.");
        return;
    }

    const receiverId = requestedItem.receiverId;

    if (!receiverId) {
        alert("Unable to identify the clothing owner.");
        return;
    }

    const currentUserId =
        currentUser._id ||
        currentUser.id ||
        currentUser.userId;

    if (String(receiverId) === String(currentUserId)) {
        alert("You cannot send a swap request for your own clothing.");
        return;
    }

    console.log("Sending swap request:");
    console.log("Receiver:", receiverId);
    console.log("Offered Item:", offeredItemId);
    console.log("Requested Item:", requestedItemId);

    try {

        const response = await fetch(`${API}/swap`, {

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

        });

        const data = await response.json();

        console.log("Swap request response:", data);

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to send swap request"
            );
        }

        swapMessage.textContent =
            "Swap request sent successfully!";

        swapMessage.style.color = "green";

        setTimeout(() => {

            window.location.href = "swap-requests.html";

        }, 1500);

    } catch (error) {

        console.error("Swap request error:", error);

        swapMessage.textContent = error.message;

        swapMessage.style.color = "red";
    }

});


// ==========================================
// START
// ==========================================

resetSwapComparison();

loadRequestedItem();
loadMyClothes();
