
const API = "https://clothswap-backend-ul42.onrender.com/api";


// ========================================
// CHECK LOGIN
// ========================================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


// ========================================
// IMAGE URL HANDLER
// ========================================

function getImageUrl(imagePath) {

    if (!imagePath) {
        return "";
    }

    // Cloudinary and other complete image URLs
    if (/^https?:\/\//i.test(imagePath)) {
        return imagePath;
    }

    // Older images stored on the backend
    const backendURL = "https://clothswap-backend-ul42.onrender.com";

    return `${backendURL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}


// ========================================
// LOCATION SEARCH
// ========================================

document
    .getElementById("locationForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const city =
            document.getElementById("city").value.trim();

        const state =
            document.getElementById("state").value.trim();

        const category =
            document.getElementById("category").value;

        const results =
            document.getElementById("locationResults");


        // ========================================
        // CHECK LOCATION
        // ========================================

        if (!city && !state) {

            results.innerHTML = `
                <p>Please enter a city or state.</p>
            `;

            return;
        }


        results.innerHTML = `
            <p>Searching for clothes...</p>
        `;


        try {

            let url;


            // ========================================
            // CATEGORY + LOCATION
            // ========================================

            if (category) {

                const params = new URLSearchParams();

                if (city) {
                    params.append("city", city);
                }

                if (state) {
                    params.append("state", state);
                }

                params.append("category", category);

                url = `${API}/location/matches?${params.toString()}`;

            }


            // ========================================
            // LOCATION ONLY
            // ========================================

            else {

                const params = new URLSearchParams();

                if (city) {
                    params.append("city", city);
                }

                if (state) {
                    params.append("state", state);
                }

                url = `${API}/location/nearby?${params.toString()}`;
            }


            console.log("Location API:", url);


            const response = await fetch(url, {

                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });


            const result = await response.json();


            console.log("Location result:", result);


            // ========================================
            // API ERROR
            // ========================================

            if (!response.ok) {

                results.innerHTML = `
                    <div class="feature-card">
                        <p>
                            ${result.message || "Unable to find clothing."}
                        </p>
                    </div>
                `;

                return;
            }


            const clothing = result.clothing || [];


            // ========================================
            // NO RESULTS
            // ========================================

            if (clothing.length === 0) {

                results.innerHTML = `

                    <div class="feature-card">

                        <h2>No Clothes Found</h2>

                        <p>
                            No available clothing items were found
                            in this location.
                        </p>

                    </div>

                `;

                return;
            }


            // ========================================
            // DISPLAY RESULTS
            // ========================================

            results.innerHTML = "";


            clothing.forEach(item => {

                const card = document.createElement("div");

                card.className = "feature-card";


                // ========================================
                // IMAGE DISPLAY
                // ========================================

                let imageHTML = "";

                if (item.images && item.images.length > 0) {

                    const imageUrl = getImageUrl(item.images[0]);

                    imageHTML = `

                        <div class="clothing-image-container">

                            <img
                                src="${imageUrl}"
                                class="clothing-image"
                                alt="${item.title || "Clothing item"}"
                                onerror="this.style.display='none'"
                            >

                        </div>

                    `;
                }


                // ========================================
                // CLOTHING DETAILS
                // ========================================

                card.innerHTML = `

                    ${imageHTML}

                    <h2>
                        ${item.title || "Untitled Item"}
                    </h2>

                    <p>
                        <strong>Brand:</strong>
                        ${item.brand || "Not specified"}
                    </p>

                    <p>
                        <strong>Category:</strong>
                        ${item.category || "Not specified"}
                    </p>

                    <p>
                        <strong>Size:</strong>
                        ${item.size || "Not specified"}
                    </p>

                    <p>
                        <strong>Condition:</strong>
                        ${item.condition || "Not specified"}
                    </p>

                    <p>
                        <strong>Estimated Value:</strong>
                        ₹${item.estimatedValue || 0}
                    </p>

                    <p>
                        📍
                        ${item.location?.city || ""}
                        ${item.location?.state
                            ? ", " + item.location.state
                            : ""}
                    </p>

                    <p>
                        <strong>Owner:</strong>
                        ${item.owner?.name || "Unknown"}
                    </p>

                    <button
                        class="btn"
                        onclick="viewItem('${item._id}')">

                        View Details

                    </button>

                `;


                results.appendChild(card);

            });

        }


        // ========================================
        // ERROR HANDLING
        // ========================================

        catch (error) {

            console.error("Location search error:", error);

            results.innerHTML = `

                <div class="feature-card">

                    <h2>Unable to Connect</h2>

                    <p>
                        Unable to connect to the server.
                        Please try again.
                    </p>

                </div>

            `;

        }

    });


// ========================================
// VIEW ITEM
// ========================================

function viewItem(id) {

    window.location.href = `item-details.html?id=${id}`;

}
