const API = "https://clothswap-backend-ul42.onrender.com/api";

const token = localStorage.getItem("token");


// Check login
if (!token) {
    window.location.href = "login.html";
}


// Form
const clothingForm =
    document.getElementById("clothingForm");


clothingForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const message =
        document.getElementById("message");

    try {

        // Create FormData
        const formData = new FormData();

        formData.append(
            "title",
            document.getElementById("title").value
        );

        formData.append(
            "description",
            document.getElementById("description").value
        );

        formData.append(
            "category",
            document.getElementById("category").value
        );

        formData.append(
            "brand",
            document.getElementById("brand").value
        );

        formData.append(
            "size",
            document.getElementById("size").value
        );

        formData.append(
            "condition",
            document.getElementById("condition").value
        );

        formData.append(
            "estimatedValue",
            document.getElementById("estimatedValue").value
        );

        formData.append(
            "city",
            document.getElementById("city").value
        );

        formData.append(
            "state",
            document.getElementById("state").value
        );


        // Get selected images
        const files =
            document.getElementById("images").files;


        // Add images to FormData
        for (let i = 0; i < files.length; i++) {

            formData.append(
                "images",
                files[i]
            );

        }


        message.textContent =
            "Uploading clothing...";


        const response = await fetch(
            `${API}/clothing`,
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${token}`
                },

                body: formData
            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            message.textContent =
                result.message || "Failed to list clothing.";

            console.error(result);

            return;
        }


        message.textContent =
            "Clothing listed successfully!";


        console.log(result);


        // Go to listings after 1 second
        setTimeout(() => {

            window.location.href =
                "listings.html";

        }, 1000);


    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to server.";

    }

});