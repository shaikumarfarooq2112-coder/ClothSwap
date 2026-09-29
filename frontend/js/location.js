const API = "http://localhost:5000/api";


// ========================================
// CHECK LOGIN
// ========================================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
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


        // Check location
        if (!city && !state) {

            results.innerHTML = `
                <p>
                    Please enter a city or state.
                </p>
            `;

            return;
        }


        results.innerHTML = `
            <p>
                Searching for clothes...
            </p>
        `;


        try {

            let url;


            // ========================================
            // CATEGORY + LOCATION
            // ========================================

            if (category) {

                const params =
                    new URLSearchParams();

                if (city) {
                    params.append("city", city);
                }

                if (state) {
                    params.append("state", state);
                }

                params.append("category", category);


                url =
                    `${API}/location/matches?${params.toString()}`;

            }

            // ========================================
            // LOCATION ONLY
            // ========================================

            else {

                const params =
                    new URLSearchParams();

                if (city) {
                    params.append("city", city);
                }

                if (state) {
                    params.append("state", state);
                }


                url =
                    `${API}/location/nearby?${params.toString()}`;
            }


            console.log("Location API:", url);


            const response = await fetch(url, {

                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }

            });


            const result =
                await response.json();


            console.log(
                "Location result:",
                result
            );


            if (!response.ok) {

                results.innerHTML = `
                    <p>
                        ${
                            result.message ||
                            "Unable to find clothing."
                        }
                    </p>
                `;

                return;
            }


            const clothing =
                result.clothing || [];


            // ========================================
            // NO RESULTS
            // ========================================

            if (clothing.length === 0) {

                results.innerHTML = `

                    <div class="feature-card">

                        <h2>
                            No Clothes Found
                        </h2>

                        <p>
                            No available clothing items
                            were found in this location.
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

                const card =
                    document.createElement("div");


                card.className =
                    "feature-card";


                let imageHTML = "";


                if (
                    item.images &&
                    item.images.length > 0
                ) {

                    imageHTML = `

                        <div class="clothing-image-container">

                            <img
                                src="http://localhost:5000${item.images[0]}"
                                class="clothing-image"
                                alt="${item.title}"
                            >

                        </div>

                    `;
                }


                card.innerHTML = `

                    ${imageHTML}


                    <h2>
                        ${item.title}
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

        } catch (error) {

            console.error(
                "Location search error:",
                error
            );


            results.innerHTML = `

                <div class="feature-card">

                    <p>
                        Unable to connect to server.
                    </p>

                    <p>
                        Make sure your backend
                        server is running.
                    </p>

                </div>

            `;
        }

    });


// ========================================
// VIEW ITEM
// ========================================

function viewItem(id) {

    window.location.href =
        `item-details.html?id=${id}`;
}