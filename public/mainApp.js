// Grab the form and output elements so the page can send the URL and show the result.
const form = document.querySelector("#shorten-form");
const destinationInput = document.querySelector("#destination-url");
const message = document.querySelector("#form-message");
const result = document.querySelector("#short-link-result");
const shortLink = document.querySelector("#short-link");

const loginLink = document.querySelector("#login-link");
const loginPrompt = document.querySelector("#login-prompt");
const userInfo = document.querySelector("#user-info");
const userName = document.querySelector("#user-name");
const logoutButton = document.querySelector("#logout-button");

// Show the form only to signed-in users; everyone else sees a Google sign-in link.
function renderAuth(user) {
	form.hidden = !user;
	loginPrompt.hidden = Boolean(user);
	loginLink.hidden = Boolean(user);
	userInfo.hidden = !user;
	userName.textContent = user ? user.name || user.email : "";
}

async function loadUser() {
	try {
		const response = await fetch("/api/me");
		renderAuth((await response.json()).user);
	} catch {
		renderAuth(null);
	}
}

logoutButton.addEventListener("click", async () => {
	await fetch("/auth/logout", { method: "POST" });
	result.hidden = true;
	renderAuth(null);
});

loadUser();

// Send the submitted URL to the API, show the created short link on success,
// and show a friendly error if the server rejects the input.
form.addEventListener("submit", async (event) => {
	event.preventDefault();
	message.hidden = true;
	result.hidden = true;

	try {
		const response = await fetch("/api/links", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ url: destinationInput.value.trim() }),
		});
		const data = await response.json();

		if (response.status === 401) {
			renderAuth(null);
		}

		if (!response.ok) {
			throw new Error(data.error || "Could not shorten that URL.");
		}

		shortLink.href = data.path;
		shortLink.textContent = new URL(data.path, window.location.origin).href;
		result.hidden = false;
	} catch (error) {
		message.textContent = error.message || "Could not reach the server. Try again.";
		message.hidden = false;
	}
});
