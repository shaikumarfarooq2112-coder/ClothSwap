const API = "http://localhost:5000/api";


// =====================================================
// LOGIN INFORMATION
// =====================================================

const token =
    localStorage.getItem("token");

const currentUser =
    JSON.parse(
        localStorage.getItem("user") || "null"
    );


// =====================================================
// HTML ELEMENTS
// =====================================================

const incomingContainer =
    document.getElementById(
        "incomingRequests"
    );

const sentContainer =
    document.getElementById(
        "sentRequests"
    );


// =====================================================
// CHECK LOGIN
// =====================================================

if (!token || !currentUser) {

    alert("Please login first.");

    window.location.href =
        "login.html";

}


// =====================================================
// LOAD INCOMING REQUESTS
// =====================================================

async function loadIncomingRequests() {

    try {

        const response =
            await fetch(
                `${API}/swap/incoming`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Incoming requests:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load incoming requests."
            );

        }


        const requests =
            data.swapRequests ||
            data.requests ||
            [];


        // ==========================================
        // NO REQUESTS
        // ==========================================

        if (requests.length === 0) {

            incomingContainer.innerHTML = `

                <div class="feature-card">

                    <p>
                        No incoming swap requests.
                    </p>

                </div>

            `;

            return;

        }


        // ==========================================
        // DISPLAY REQUESTS
        // ==========================================

        incomingContainer.innerHTML = "";


        requests.forEach(request => {

            incomingContainer.appendChild(
                createRequestCard(
                    request,
                    "incoming"
                )
            );

        });


    } catch (error) {

        console.error(
            "Incoming requests error:",
            error
        );


        incomingContainer.innerHTML = `

            <div class="feature-card">

                <p style="color:red;">
                    ${error.message}
                </p>

            </div>

        `;

    }

}



// =====================================================
// LOAD SENT REQUESTS
// =====================================================

async function loadSentRequests() {

    try {

        const response =
            await fetch(
                `${API}/swap/sent`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Sent requests:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load sent requests."
            );

        }


        const requests =
            data.swapRequests ||
            data.requests ||
            [];


        // ==========================================
        // NO REQUESTS
        // ==========================================

        if (requests.length === 0) {

            sentContainer.innerHTML = `

                <div class="feature-card">

                    <p>
                        You have not sent any swap requests.
                    </p>

                </div>

            `;

            return;

        }


        // ==========================================
        // DISPLAY REQUESTS
        // ==========================================

        sentContainer.innerHTML = "";


        requests.forEach(request => {

            sentContainer.appendChild(
                createRequestCard(
                    request,
                    "sent"
                )
            );

        });


    } catch (error) {

        console.error(
            "Sent requests error:",
            error
        );


        sentContainer.innerHTML = `

            <div class="feature-card">

                <p style="color:red;">
                    ${error.message}
                </p>

            </div>

        `;

    }

}



// =====================================================
// CREATE REQUEST CARD
// =====================================================

function createRequestCard(
    request,
    type
) {

    const card =
        document.createElement("div");


    card.className =
        "feature-card";


    // ==========================================
    // USER DETAILS
    // ==========================================

    const requester =
        request.requester || {};

    const receiver =
        request.receiver || {};


    const requesterName =
        typeof requester === "object"
            ? requester.name || "Unknown"
            : "Unknown";


    const receiverName =
        typeof receiver === "object"
            ? receiver.name || "Unknown"
            : "Unknown";


    // ==========================================
    // ITEM DETAILS
    // ==========================================

    const offeredItem =
        request.offeredItem || {};


    const requestedItem =
        request.requestedItem || {};


    const offeredTitle =
        offeredItem.title ||
        offeredItem.name ||
        "Clothing Item";


    const requestedTitle =
        requestedItem.title ||
        requestedItem.name ||
        "Clothing Item";


    // ==========================================
    // STATUS
    // ==========================================

    const status =
        request.status || "pending";


    // ==========================================
    // DATE
    // ==========================================

    let dateText =
        "Date not available";


    if (request.createdAt) {

        dateText =
            new Date(
                request.createdAt
            ).toLocaleString();

    }


    // ==========================================
    // MESSAGE
    // ==========================================

    const message =
        request.message ||
        "No message";


    // ==========================================
    // ACTION BUTTONS
    // ==========================================

    let actionHTML = "";


    if (
        type === "incoming" &&
        status === "pending"
    ) {

        actionHTML = `

            <button
                class="btn"
                onclick="acceptRequest('${request._id}')"
            >
                Accept
            </button>


            <button
                class="btn"
                onclick="rejectRequest('${request._id}')"
            >
                Reject
            </button>

        `;

    }


    // ==========================================
    // CHAT BUTTON
    // ==========================================

    if (
        status === "accepted"
    ) {

        actionHTML += `

            <button
                class="btn"
                onclick="openChat('${request._id}')"
            >
                Open Chat
            </button>

        `;

    }


    // ==========================================
    // CARD HTML
    // ==========================================

    card.innerHTML = `

        <h3>
            ${type === "incoming"
                ? "Swap Request From"
                : "Swap Request To"}
            ${
                type === "incoming"
                    ? requesterName
                    : receiverName
            }
        </h3>


        <p>
            <strong>
                Your Item:
            </strong>

            ${
                type === "incoming"
                    ? requestedTitle
                    : offeredTitle
            }
        </p>


        <p>
            <strong>
                ${
                    type === "incoming"
                        ? "Offered Item"
                        : "Requested Item"
                }:
            </strong>

            ${
                type === "incoming"
                    ? offeredTitle
                    : requestedTitle
            }
        </p>


        <p>
            <strong>
                Message:
            </strong>

            ${message}
        </p>


        <p>
            <strong>
                Status:
            </strong>

            ${status}
        </p>


        <p>
            <strong>
                Date:
            </strong>

            ${dateText}
        </p>


        <div style="margin-top:15px;">

            ${actionHTML}

        </div>

    `;


    return card;

}



// =====================================================
// ACCEPT REQUEST
// =====================================================

async function acceptRequest(
    requestId
) {

    if (!requestId) {

        alert(
            "Swap request ID is missing."
        );

        return;

    }


    const confirmAccept =
        confirm(
            "Are you sure you want to accept this swap request?"
        );


    if (!confirmAccept) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/swap/${requestId}/accept`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Accept response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to accept request."
            );

        }


        alert(
            "Swap request accepted successfully!"
        );


        // Reload requests
        loadIncomingRequests();
        loadSentRequests();


    } catch (error) {

        console.error(
            "Accept request error:",
            error
        );


        alert(
            error.message
        );

    }

}



// =====================================================
// REJECT REQUEST
// =====================================================

async function rejectRequest(
    requestId
) {

    if (!requestId) {

        alert(
            "Swap request ID is missing."
        );

        return;

    }


    const confirmReject =
        confirm(
            "Are you sure you want to reject this swap request?"
        );


    if (!confirmReject) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/swap/${requestId}/reject`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Reject response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to reject request."
            );

        }


        alert(
            "Swap request rejected."
        );


        // Reload requests
        loadIncomingRequests();
        loadSentRequests();


    } catch (error) {

        console.error(
            "Reject request error:",
            error
        );


        alert(
            error.message
        );

    }

}



// =====================================================
// OPEN CHAT
// =====================================================

function openChat(
    requestId
) {

    if (!requestId) {

        alert(
            "Swap request ID is missing."
        );

        return;

    }


    window.location.href =
        `chat.html?swapRequestId=${encodeURIComponent(requestId)}`;

}



// =====================================================
// START PAGE
// =====================================================

loadIncomingRequests();

loadSentRequests();