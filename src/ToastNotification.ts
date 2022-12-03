class ToastNotification {

	private element: HTMLDivElement;

	constructor(img: string, heading: string, description: string) {
		this.element = document.createElement("div");
		this.element.classList.add("notification");

		var imgEl = document.createElement("img");
		imgEl.src = img;
		this.element.appendChild(imgEl);

		var headingEl = document.createElement("h3");
		headingEl.textContent = heading;
		this.element.appendChild(headingEl);

		if (description != null) {
			var descriptionEl = document.createElement("p");
			descriptionEl.innerHTML = description;
			this.element.appendChild(descriptionEl);
		}
	}

	getElement() {
		return this.element;
	}

}