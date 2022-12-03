class KeyboardController {

	private app: App;
	private enableDebug: boolean = false;

	constructor(app: App) {
		this.app = app;
		window.addEventListener("keydown", this.keydown.bind(this));
	}

	private keydown(e: KeyboardEvent) {
		if (e.keyCode == 67) { // c
			this.app.executeCommand(Command.ConnectController);
		}

		if (this.enableDebug) {
			if (e.keyCode == 40) { // down arrow
				this.app.executeCommand(Command.Down);
			} else if (e.keyCode == 37) { // left arrow
				this.app.executeCommand(Command.Left);
			} else if (e.keyCode == 39) { // right arrow
				this.app.executeCommand(Command.Right);
			} else if (e.keyCode == 82) { // r
				this.app.executeCommand(Command.RotateLeft);
			} else if (e.keyCode == 84) { // t
				this.app.executeCommand(Command.RotateRight);
			} else if (e.keyCode == 83) { // s
				this.app.executeCommand(Command.StartGame);
			}
		}
	}
}
