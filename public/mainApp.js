const form = document.querySelector("#shorten-form");
const destinationInput = document.querySelector("#destination-url");
const message = document.querySelector("#form-message");
const result = document.querySelector("#short-link-result");
const shortLink = document.querySelector("#short-link");

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
