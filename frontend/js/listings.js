const API = "http://localhost:5000/api";

const clothingContainer =
    document.getElementById("clothingContainer");


async function loadClothes() {

    try {

        const response =
            await fetch(`${API}/clothing`);

        const data =
            await response.json();

        console.log("Clothing API response:", data);

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load clothes"
            );
        }

        const clothes = data.clothing || [];

        clothingContainer.innerHTML = "";


        if (clothes.length === 0) {

            clothingContainer.innerHTML = `
                <p>No available clothes found.</p>
            `;

            return;
        }


        clothes.forEach(item => {

            const card =
                document.createElement("div");

            card.className = "feature-card";


            const image =
                item.images && item.images.length > 0
                ? `
                    <img
                        src="http://localhost:5000${item.images[0]}"
                        alt="${item.title}"
                        style="
                            width: 220px;
                            height: 220px;
                            object-fit: cover;
                            border-radius: 10px;
                        "
                    >
                  `
                : "";


            const location =
                item.location
                ? `${item.location.city || ""}, ${item.location.state || ""}`
                : "Not specified";


            card.innerHTML = `

                ${image}

                <h2>${item.title}</h2>

                <p>
                    <strong>Brand:</strong>
                    ${item.brand || "N/A"}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${item.category || "N/A"}
                </p>

                <p>
                    <strong>Size:</strong>
                    ${item.size || "N/A"}
                </p>

                <p>
                    <strong>Condition:</strong>
                    ${item.condition || "N/A"}
                </p>

                <p>
                    <strong>Estimated Value:</strong>
                    ₹${item.estimatedValue || 0}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${location}
                </p>

                <p>
                    <strong>Owner:</strong>
                    ${item.owner?.name || "Unknown"}
                </p>

                <button
                    onclick="viewDetails('${item._id}')"
                >
                    View Details
                </button>
            `;


            clothingContainer.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Error loading clothes:",
            error
        );

        clothingContainer.innerHTML = `
            <p style="color:red;">
                Unable to load clothes.
            </p>
        `;
    }
}


function viewDetails(itemId) {

    window.location.href =
        `item-details.html?id=${itemId}`;
}


loadClothes();