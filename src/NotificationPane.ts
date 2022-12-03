class NotificationPane {

	private container: HTMLDivElement;
	private notifications: Array<ToastNotification> = [];

	constructor(container: HTMLDivElement) {
		this.container = container;
	}

	addNotification(img: string, heading: string, description: string, timeout: number = 5000) {
		var n = new ToastNotification(img, heading, description);
		this.container.appendChild(n.getElement());
		this.notifications.push(n);
		setTimeout(this.deleteNotification.bind(this, n), timeout);
	}

	private deleteNotification(notification: ToastNotification) {
		var index = this.notifications.indexOf(notification);
		if (index != -1) {
			this.notifications.splice(index, 1);
		}

		var element = notification.getElement();

		element.classList.add("deleting");

		setTimeout(function (this: NotificationPane) {
			this.container.removeChild(element);
		}.bind(this), 900);
	}
}
