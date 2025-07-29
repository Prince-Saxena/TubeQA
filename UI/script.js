// Global variables
let currentVideoId = null;
let chatHistory = [];
let availableLanguages = [];

// DOM elements
const videoUrlInput = document.getElementById("video-url");
const loadButton = document.getElementById("load-btn");
const playerContainer = document.getElementById("player");
const chatHistoryContainer = document.getElementById("chat-history");
const userQueryInput = document.getElementById("user-query");
const sendButton = document.getElementById("send-btn");
const sendText = document.getElementById("send-text");
const sendLoader = document.getElementById("send-loader");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// Check for saved theme preference or use system preference
const savedTheme =
	localStorage.getItem("theme") ||
	(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
document.documentElement.classList.toggle("dark", savedTheme === "dark");

// Extract YouTube video ID from URL
function extractVideoId(url) {
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);
	return match && match[2].length === 11 ? match[2] : null;
}

// Check available transcript languages
async function getAvailableLanguages(videoId) {
	try {
		const response = await fetch(
			`http://localhost:8000/langs?video_id=${videoId}`
		);
		const data = await response.json();
		return data.languages || ['en'];
	} catch (error) {
		console.error("Error fetching available languages:", error);
		return ['en'];
	}
}

// Load YouTube player and check available languages
async function loadPlayer(videoId) {
	try {
		// Show loading state
		loadButton.disabled = true;
		loadButton.innerHTML =
			'<svg class="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

		// Get available languages
		availableLanguages = await getAvailableLanguages(videoId);

		// Prefer English if available, otherwise use first available language
		const preferredLang = availableLanguages.includes("en")
			? "en"
			: availableLanguages.length > 0
			? availableLanguages[0]
			: "en";

		// Load player
		playerContainer.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;

		return preferredLang;
	} catch (error) {
		console.error("Error loading player:", error);
		return "en"; // Fallback to English
	} finally {
		loadButton.disabled = false;
		loadButton.textContent = "Load";
	}
}

// Clear chat history
function clearChatHistory() {
	chatHistory = [];
	renderChatHistory();
}

// Render chat history
function renderChatHistory() {
	if (chatHistory.length === 0) {
		chatHistoryContainer.innerHTML = `
            <div class="text-center text-gray-500 dark:text-gray-400 py-10">
                No messages yet. Load a video and ask something!
            </div>
        `;
		return;
	}

	chatHistoryContainer.innerHTML = chatHistory
		.map(
			(msg) => `
		<div class="flex ${msg.sender === "user" ? "justify-end" : "justify-start"}">
			<div class="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
				msg.sender === "user"
					? "bg-blue-500 text-white rounded-tr-none"
					: "bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-gray-200 rounded-tl-none"
			}">
				// <div class="prose prose-sm dark:prose-invert">${msg.text}</div>
				${
					msg.sender === "bot"
						? `<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
							${new Date(msg.timestamp).toLocaleTimeString()} • ${msg.lang.toUpperCase()}
						</div>`
						: ""
				}
			</div>
		</div>
	`
		)
		.join("");


	// Scroll to bottom
	chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
}

// Add message to chat history
function addMessage(sender, text, lang = "en") {
	const parsedText =
		sender === "bot" ? marked.parse(text) : text.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // Escape HTML for user input

	chatHistory.push({
		sender,
		text: parsedText,
		lang,
		timestamp: new Date(),
	});

	renderChatHistory();
}


// Show loading state
function setLoadingState(isLoading) {
	if (isLoading) {
		sendText.classList.add("hidden");
		sendLoader.classList.remove("hidden");
	} else {
		sendText.classList.remove("hidden");
		sendLoader.classList.add("hidden");
	}
}

// Send query to backend
async function sendQuery(query, lang) {
	try {
		addMessage("user", query);
		userQueryInput.disabled = true;
		sendButton.disabled = true;
		setLoadingState(true);
		userQueryInput.value = "";

		const response = await fetch("http://localhost:8000/query", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: query,
				video_id: currentVideoId,
				lang: lang,
			}),
		});

		const data = await response.json();
		addMessage("bot", data.Response, lang);
	} catch (error) {
		addMessage("bot", `Error: ${error.message}`, lang);
	} finally {
		userQueryInput.disabled = false;
		sendButton.disabled = false;
		setLoadingState(false);
		userQueryInput.focus();
	}
}

// Toggle dark/light theme
function toggleTheme() {
	const isDark = document.documentElement.classList.toggle("dark");
	localStorage.setItem("theme", isDark ? "dark" : "light");

	// Update icon
	if (isDark) {
		themeIcon.setAttribute(
			"d",
			"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
		);
	} else {
		themeIcon.setAttribute(
			"d",
			"M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
		);
	}
}

// Event listeners
loadButton.addEventListener("click", async () => {
	const videoUrl = videoUrlInput.value.trim();
	if (!videoUrl) return;

	const videoId = extractVideoId(videoUrl);
	if (!videoId) {
		alert("Please enter a valid YouTube URL");
		return;
	}

	// If loading a new video, clear chat history
	if (videoId !== currentVideoId) {
		currentVideoId = videoId;
		clearChatHistory();
	}

	const preferredLang = await loadPlayer(videoId);
	userQueryInput.disabled = false;
	sendButton.disabled = false;
	userQueryInput.focus();

	// Show available languages in console (for debugging)
	console.log("Available languages:", availableLanguages);
	console.log("Selected language:", preferredLang);
});

sendButton.addEventListener("click", async () => {
	const query = userQueryInput.value.trim();
	if (query && currentVideoId) {
		// Get preferred language (English if available)
		const preferredLang = availableLanguages.includes("en")
			? "en"
			: availableLanguages.length > 0
			? availableLanguages[0]
			: "en";
		await sendQuery(query, preferredLang);
	}
});

userQueryInput.addEventListener("keypress", async (e) => {
	if (e.key === "Enter") {
		const query = userQueryInput.value.trim();
		if (query && currentVideoId) {
			// Get preferred language (English if available)
			const preferredLang = availableLanguages.includes("en")
				? "en"
				: availableLanguages.length > 0
				? availableLanguages[0]
				: "en";
			await sendQuery(query, preferredLang);
		}
	}
});

themeToggle.addEventListener("click", toggleTheme);

// Initialize theme icon
if (document.documentElement.classList.contains("dark")) {
	themeIcon.setAttribute(
		"d",
		"M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
	);
}
