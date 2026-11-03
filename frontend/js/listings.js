
const API = "https://clothswap-backend-ul42.onrender.com/api";
const BACKEND_URL = "https://clothswap-backend-ul42.onrender.com";

const clothingContainer = document.getElementById("clothingContainer");
const searchInput = document.getElementById("clothingSearch");
const searchSuggestions = document.getElementById("searchSuggestions");

let allClothes = [];

async function loadClothes() {
    try {
        const response = await fetch(`${API}/clothing`);
        const data = await response.json();

        console.log("Clothing API response:", data);

        if (!response.ok) {
            throw new Error(data.message || "Failed to load clothes");
        }

        allClothes = data.clothing || [];

        displayClothes(allClothes);

    } catch (error) {
        console.error("Error loading clothes:", error);

        clothingContainer.innerHTML = `
            <p class="no-clothes" style="color:red;">
                Unable to load clothes. Please try again.
            </p>
        `;
    }
}

// Display product cards
function displayClothes(clothes) {
    clothingContainer.innerHTML = "";

    if (clothes.length === 0) {
        clothingContainer.innerHTML =
            '<p class="no-clothes">No matching clothes found.</p>';
        return;
    }

    clothes.forEach(item => {
        const card = document.createElement("div");
        card.className = "product-card";

        let imageUrl = "";

        if (item.images && item.images.length > 0) {
            const savedImage = item.images[0];

            imageUrl = savedImage.startsWith("http")
                ? savedImage
                : `${BACKEND_URL}${savedImage}`;
        }

        const image = imageUrl
            ? `
                <a
                    class="product-image-link"
                    href="item-details.html?id=${encodeURIComponent(item._id)}"
                >
                    <img
                        class="product-image"
                        src="${imageUrl}"
                        alt="${item.title || "Clothing image"}"
                        onerror="this.style.display='none'"
                    >
                </a>
              `
            : `
                <div class="product-image"
                     style="display:flex;align-items:center;justify-content:center;color:#888;">
                    Image not available
                </div>
              `;

        card.innerHTML = `
            ${image}

            <h2 class="product-name">
                ${item.title || "Untitled"}
            </h2>

            <p class="product-info">
                Brand: ${item.brand || "N/A"}
            </p>

            <p class="product-info">
                Size: ${item.size || "N/A"}
            </p>

            <p class="product-price">
                ₹${item.estimatedValue || 0}
            </p>

            <button
                class="view-details-btn"
                onclick="viewDetails('${item._id}')"
            >
                View Details
            </button>
        `;

        clothingContainer.appendChild(card);
    });
}

// Search clothes by name, brand or category
function searchClothes() {
    const searchText = searchInput.value.trim().toLowerCase();

    if (!searchText) {
        displayClothes(allClothes);
        searchSuggestions.innerHTML = "";
        return;
    }

    const matchingClothes = allClothes.filter(item => {
        const title = (item.title || "").toLowerCase();
        const brand = (item.brand || "").toLowerCase();
        const category = (item.category || "").toLowerCase();

        return (
            title.includes(searchText) ||
            brand.includes(searchText) ||
            category.includes(searchText)
        );
    });

    displayClothes(matchingClothes);
    showSuggestions(searchText);
}

// Show matching clothing-name suggestions
function showSuggestions(searchText) {
    searchSuggestions.innerHTML = "";

    if (!searchText) return;

    const matches = allClothes.filter(item => {
        const title = (item.title || "").toLowerCase();
        const brand = (item.brand || "").toLowerCase();
        const category = (item.category || "").toLowerCase();

        return (
            title.includes(searchText) ||
            brand.includes(searchText) ||
            category.includes(searchText)
        );
    });

    matches.slice(0, 6).forEach(item => {
        const suggestion = document.createElement("div");

        suggestion.className = "search-suggestion";
        suggestion.textContent = item.title || "Untitled";

        suggestion.addEventListener("click", () => {
            searchInput.value = item.title;
            searchSuggestions.innerHTML = "";
            displayClothes([item]);
        });

        searchSuggestions.appendChild(suggestion);
    });
}

// Open full details page
function viewDetails(itemId) {
    window.location.href =
        `item-details.html?id=${encodeURIComponent(itemId)}`;
}

// Search as the user types
searchInput.addEventListener("input", searchClothes);

// Close suggestions when clicking outside
document.addEventListener("click", event => {
    if (
        !searchInput.contains(event.target) &&
        !searchSuggestions.contains(event.target)
    ) {
        searchSuggestions.innerHTML = "";
    }
});

loadClothes();
