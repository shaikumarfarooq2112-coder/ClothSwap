const API = "http://localhost:5000/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const params = new URLSearchParams(window.location.search);
const swapRequestId = params.get("swapRequestId");

let currentUser = null;
let receiverId = null;

try {
    currentUser = JSON.parse(localStorage.getItem("user"));
} catch (error) {
    console.error("User data error:", error);
}

if (!swapRequestId) {
    document.getElementById("chatStatus").textContent =
        "Swap request not found.";
} else {
    loadChat();
}


// ==========================================
// LOAD SWAP REQUEST + MESSAGES
// ==========================================
async function loadChat() {
    try {
        // First get the swap request
        const swapResponse = await fetch(
            `${API}/swap/${swapRequestId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const swapResult = await swapResponse.json();

        if (!swapResponse.ok) {
            document.getElementById("chatStatus").textContent =
                swapResult.message || "Unable to load swap request.";

            return;
        }

        const swap = swapResult.swapRequest || swapResult;

        const currentUserId =
            currentUser?._id || currentUser?.id;

        const requesterId =
            swap.requester?._id || swap.requester;

        const receiverUserId =
            swap.receiver?._id || swap.receiver;

        // Determine who we are chatting with
        if (currentUserId === requesterId) {
            receiverId = receiverUserId;
        } else if (currentUserId === receiverUserId) {
            receiverId = requesterId;
        } else {
            document.getElementById("chatStatus").textContent =
                "You are not part of this swap.";

            return;
        }

        // Now load messages
        await loadMessages();

    } catch (error) {
        console.error("Load chat error:", error);

        document.getElementById("chatStatus").textContent =
            "Unable to load chat.";
    }
}


// ==========================================
// LOAD MESSAGES
// ==========================================
async function loadMessages() {
    try {
        const response = await fetch(
            `${API}/chat/${swapRequestId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result = await response.json();

        if (!response.ok) {
            document.getElementById("chatStatus").textContent =
                result.message || "Unable to load chat.";

            return;
        }

        document.getElementById("chatStatus").textContent =
            `${result.count || 0} message(s)`;

        displayMessages(result.messages || []);

    } catch (error) {
        console.error("Load messages error:", error);

        document.getElementById("chatStatus").textContent =
            "Unable to connect to server.";
    }
}


// ==========================================
// DISPLAY MESSAGES
// ==========================================
function displayMessages(messages) {
    const container =
        document.getElementById("messagesContainer");

    container.innerHTML = "";

    if (messages.length === 0) {
        container.innerHTML =
            "<p>No messages yet. Start the negotiation!</p>";

        return;
    }

    messages.forEach(chat => {

        const messageDiv =
            document.createElement("div");

        const senderId =
            chat.sender?._id || chat.sender;

        const currentUserId =
            currentUser?._id || currentUser?.id;

        const isMine =
            senderId === currentUserId;

        messageDiv.className =
            isMine
                ? "chat-message sent"
                : "chat-message received";

        messageDiv.innerHTML = `
            <strong>
                ${chat.sender?.name || "User"}
            </strong>

            <p>
                ${chat.message}
            </p>

            <small>
                ${new Date(chat.createdAt).toLocaleString()}
            </small>
        `;

        container.appendChild(messageDiv);

        // Mark received messages as read
        if (!isMine && !chat.read) {
            markAsRead(chat._id);
        }
    });

    container.scrollTop =
        container.scrollHeight;
}


// ==========================================
// SEND MESSAGE
// ==========================================
async function sendMessage() {

    const input =
        document.getElementById("messageInput");

    const message =
        input.value.trim();

    if (!message) {
        alert("Please enter a message.");
        return;
    }

    if (!currentUser) {
        alert("User information not found. Please login again.");
        return;
    }

    if (!receiverId) {
        alert("Receiver could not be identified.");
        return;
    }

    try {

        const response = await fetch(
            `${API}/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    receiver: receiverId,
                    swapRequest: swapRequestId,
                    message: message
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            alert(
                result.message ||
                "Failed to send message."
            );

            return;
        }

        // Clear input
        input.value = "";

        // Reload messages
        await loadMessages();

    } catch (error) {

        console.error(
            "Send message error:",
            error
        );

        alert(
            "Unable to send message. Make sure the backend server is running."
        );
    }
}


// ==========================================
// MARK MESSAGE AS READ
// ==========================================
async function markAsRead(messageId) {

    try {

        await fetch(
            `${API}/chat/${messageId}/read`,
            {
                method: "PUT",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

    } catch (error) {

        console.error(
            "Mark as read error:",
            error
        );
    }
}


// ==========================================
// ENTER KEY TO SEND
// ==========================================
document.addEventListener(
    "DOMContentLoaded",
    () => {

        const input =
            document.getElementById("messageInput");

        if (input) {

            input.addEventListener(
                "keypress",
                function(event) {

                    if (event.key === "Enter") {
                        sendMessage();
                    }

                }
            );

        }

    }
);