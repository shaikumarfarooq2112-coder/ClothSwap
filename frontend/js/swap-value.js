const API = "http://localhost:5000/api";


// ========================================
// CHECK LOGIN
// ========================================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


// ========================================
// CALCULATE SWAP VALUE
// ========================================

document
    .getElementById("valueForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        // Get values
        const brand =
            document.getElementById("brand").value;

        const category =
            document.getElementById("category").value;

        const condition =
            document.getElementById("condition").value;

        const estimatedValue =
            document.getElementById("estimatedValue").value;


        const resultContainer =
            document.getElementById("calculatorResult");


        // Basic validation
        if (
            !brand ||
            !category ||
            !condition ||
            !estimatedValue
        ) {

            resultContainer.innerHTML = `
                <p>
                    Please fill in all fields.
                </p>
            `;

            return;
        }


        resultContainer.innerHTML = `
            <p>
                Calculating...
            </p>
        `;


        try {

            const response = await fetch(
                `${API}/swap-value/calculate`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        brand: brand,

                        category: category,

                        condition: condition,

                        estimatedValue:
                            Number(estimatedValue)

                    })
                }
            );


            const result =
                await response.json();


            console.log(
                "Swap Value Result:",
                result
            );


            if (!response.ok) {

                resultContainer.innerHTML = `
                    <p>
                        ${
                            result.message ||
                            "Unable to calculate swap value."
                        }
                    </p>
                `;

                return;
            }


            // Display result
            resultContainer.innerHTML = `

                <div class="feature-card">

                    <h2>
                        Estimated Swap Value
                    </h2>

                    <h1>
                        ₹${result.estimatedSwapValue}
                    </h1>

                    <p>
                        <strong>Brand:</strong>
                        ${brand}
                    </p>

                    <p>
                        <strong>Category:</strong>
                        ${category}
                    </p>

                    <p>
                        <strong>Condition:</strong>
                        ${condition}
                    </p>

                    <p>
                        Your estimated swap value is
                        <strong>
                            ₹${result.estimatedSwapValue}
                        </strong>.
                    </p>

                </div>

            `;

        } catch (error) {

            console.error(
                "Calculator error:",
                error
            );


            resultContainer.innerHTML = `
                <p>
                    Unable to connect to server.
                    Make sure the backend is running.
                </p>
            `;
        }

    });