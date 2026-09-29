const API = "http://localhost:5000/api";


// =====================================================
// LOAD CLOTHING ITEM
// =====================================================

async function loadItem() {

    const container =
        document.getElementById("itemContainer");


    // Check container
    if (!container) {
        console.error("itemContainer not found.");
        return;
    }


    // =================================================
    // GET ITEM ID FROM URL
    // =================================================

    const params =
        new URLSearchParams(window.location.search);

    const itemId =
        params.get("id");


    // =================================================
    // CHECK ITEM ID
    // =================================================

    if (!itemId) {

        container.innerHTML = `

            <div class="item-details-card">

                <h2>
                    Clothing item not found
                </h2>

                <p>
                    No clothing item ID was provided.
                </p>

                <button
                    class="btn"
                    onclick="goBack()">
                    Back to Listings
                </button>

            </div>

        `;

        return;
    }


    // =================================================
    // FETCH ITEM
    // =================================================

    try {

        const response = await fetch(
            `${API}/clothing/${encodeURIComponent(itemId)}`
        );


        const data =
            await response.json();


        // =================================================
        // CHECK RESPONSE
        // =================================================

        if (!response.ok) {

            container.innerHTML = `

                <div class="item-details-card">

                    <h2>
                        ${data.message || "Item not found"}
                    </h2>

                    <button
                        class="btn"
                        onclick="goBack()">
                        Back to Listings
                    </button>

                </div>

            `;

            return;
        }


        // =================================================
        // HANDLE API RESPONSE
        // =================================================

        const item =
            data.clothing ||
            data.item ||
            data;


        if (!item || !item._id) {

            container.innerHTML = `

                <div class="item-details-card">

                    <h2>
                        Clothing item not found
                    </h2>

                    <button
                        class="btn"
                        onclick="goBack()">
                        Back to Listings
                    </button>

                </div>

            `;

            return;
        }


        // =================================================
        // IMAGE
        // =================================================

        let imageHTML = "";


        if (
            item.images &&
            Array.isArray(item.images) &&
            item.images.length > 0
        ) {

            imageHTML = `

                <div class="details-image-container">

                    <img
                        src="${API.replace(
                            "/api",
                            ""
                        )}${item.images[0]}"
                        class="details-image"
                        alt="${item.title || "Clothing item"}"
                        onerror="this.style.display='none'"
                    >

                </div>

            `;

        } else {

            imageHTML = `

                <div class="details-image-container">

                    <p>
                        No image available
                    </p>

                </div>

            `;

        }


        // =================================================
        // OWNER DETAILS
        // =================================================

        const owner =
            item.owner || {};


        const ownerName =
            typeof owner === "object"
                ? owner.name || "Unknown"
                : "Unknown";


        const ownerEmail =
            typeof owner === "object"
                ? owner.email || "Not available"
                : "Not available";


        // =================================================
        // LOCATION
        // =================================================

        let locationText = "Not specified";


        if (item.location) {

            if (typeof item.location === "string") {

                locationText =
                    item.location;

            } else {

                const city =
                    item.location.city || "";


                const state =
                    item.location.state || "";


                if (city && state) {

                    locationText =
                        `${city}, ${state}`;

                } else if (city) {

                    locationText =
                        city;

                } else if (state) {

                    locationText =
                        state;

                }

            }

        }


        // =================================================
        // VALUE
        // =================================================

        const estimatedValue =
            item.estimatedValue ||
            item.estimatedSwapValue ||
            item.value ||
            0;


        // =================================================
        // STATUS
        // =================================================

        const status =
            item.status || "available";


        // =================================================
        // REQUEST SWAP BUTTON
        // =================================================

        let actionHTML = "";


        if (
            String(status).toLowerCase() ===
            "available"
        ) {

            actionHTML = `

                <button
                    class="btn"
                    onclick="requestSwap('${item._id}')">
                    Request Swap
                </button>

            `;

        } else {

            actionHTML = `

                <p>
                    <strong>
                        This item is not currently
                        available for swapping.
                    </strong>
                </p>

            `;

        }


        // =================================================
        // DISPLAY ITEM
        // =================================================

        container.innerHTML = `

            <div class="item-details-card">

                ${imageHTML}


                <h1>
                    ${item.title || "Clothing Item"}
                </h1>


                <p>
                    <strong>Description:</strong>
                    ${item.description ||
                    "No description available"}
                </p>


                <p>
                    <strong>Brand:</strong>
                    ${item.brand ||
                    "Not specified"}
                </p>


                <p>
                    <strong>Category:</strong>
                    ${item.category ||
                    item.type ||
                    "Not specified"}
                </p>


                <p>
                    <strong>Size:</strong>
                    ${item.size ||
                    "Not specified"}
                </p>


                <p>
                    <strong>Condition:</strong>
                    ${item.condition ||
                    "Not specified"}
                </p>


                <p>
                    <strong>Estimated Value:</strong>
                    ₹${estimatedValue}
                </p>


                <p>
                    <strong>Location:</strong>
                    ${locationText}
                </p>


                <p>
                    <strong>Owner:</strong>
                    ${ownerName}
                </p>


                <p>
                    <strong>Owner Email:</strong>
                    ${ownerEmail}
                </p>


                <p>
                    <strong>Status:</strong>
                    ${status}
                </p>


                <div class="item-actions">

                    ${actionHTML}


                    <button
                        class="btn"
                        onclick="goBack()">
                        Back to Listings
                    </button>

                </div>


                <p id="swapMessage"></p>

            </div>

        `;


    } catch (error) {

        console.error(
            "Error loading clothing item:",
            error
        );


        container.innerHTML = `

            <div class="item-details-card">

                <h2>
                    Unable to load clothing details
                </h2>

                <p>
                    Make sure the backend server
                    is running on port 5000.
                </p>

                <button
                    class="btn"
                    onclick="goBack()">
                    Back to Listings
                </button>

            </div>

        `;

    }

}


// =====================================================
// REQUEST SWAP
// =====================================================

function requestSwap(itemId) {

    // Check ID
    if (!itemId) {

        alert(
            "Clothing item ID is missing."
        );

        return;
    }


    // =================================================
    // REDIRECT WITH ITEM ID
    // =================================================

    window.location.href =
        `swap-request.html?itemId=${encodeURIComponent(itemId)}`;

}


// =====================================================
// GO BACK TO LISTINGS
// =====================================================

function goBack() {

    window.location.href =
        "listings.html";

}


// =====================================================
// START
// =====================================================

loadItem();