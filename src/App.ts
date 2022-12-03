class App {

	private mainCanvas: HTMLCanvasElement;
	private nextPartCanvas: HTMLCanvasElement;
	private tetris: Tetris;
	private mainTetrisRenderer: TetrisRenderer;
	private statusLabel: HTMLParagraphElement;
	private connectButton: HTMLButtonElement;
	private taskList: HTMLOListElement;

	private max25405Controller: Max25405EvkitController;
	private keyboardController: KeyboardController;
	private notificationPane: NotificationPane;

	private isStarted = false;

	init() {
		this.mainCanvas = document.querySelector("#tetris-main-area");
		this.nextPartCanvas = document.querySelector("#tetris-next-part");
		this.statusLabel = document.querySelector("#score");
		this.connectButton = document.querySelector("#connect-sensor-btn");
		this.taskList = document.querySelector("#task-list");

		this.tetris = new Tetris(10, 15);
		this.mainTetrisRenderer = new TetrisRenderer(this.mainCanvas, this.nextPartCanvas, this.tetris);
		this.resize();

		window.addEventListener("resize", this.resize.bind(this));
		requestAnimationFrame(this.paint.bind(this));
		this.setStepInterval();

		this.notificationPane = new NotificationPane(document.querySelector("#notifications"));
		this.connectButton.onclick = this.executeCommand.bind(this, Command.ConnectController);

		this.max25405Controller = new Max25405EvkitController(this);
		this.keyboardController = new KeyboardController(this);
	}

	private resize() {
		this.mainTetrisRenderer.resize();
	}

	getNotificationPane() {
		return this.notificationPane;
	}

	private markCompletedTasks(numberOfCompleted: number) {
		var imgs = this.taskList.querySelectorAll("img");
		for (var i = 0; i < numberOfCompleted; i++) {
			var img: HTMLImageElement = <HTMLImageElement>imgs[i];
			img.src = "img/completed.png";
		}
	}

	private setStepInterval() {
		var inverse = 20 - this.tetris.getScore();
		if (inverse < 0) {
			inverse = 0;
		}
		setTimeout(this.step.bind(this), 100 + 50 * inverse);
	}

	private step() {
		if (!this.isStarted) {
			this.setStepInterval();
			return;
		}

		this.tetris.doStep();

		if (!this.tetris.isGameOver()) {
			this.statusLabel.textContent = "Score: " + this.tetris.getScore().toString();
			this.setStepInterval();
		} else {
			this.statusLabel.textContent = "Game Over. Score: " + this.tetris.getScore().toString();
		}
	}

	executeCommand(cmd: Command) {
		if (cmd == Command.ConnectController) {
			this.markCompletedTasks(5);
			this.max25405Controller.requestSerialPort();
		} else if (cmd == Command.StartGame) {
			this.markCompletedTasks(7);
			this.isStarted = true;
		}

		if (!this.isStarted) {
			return;
		}

		if (cmd == Command.Down) {
			this.tetris.drop();
		} else if (cmd == Command.Left) {
			this.tetris.moveLeft();
		} else if (cmd == Command.Right) {
			this.tetris.moveRight();
		} else if (cmd == Command.RotateRight) {
			this.tetris.rotateRight();
		} else if (cmd == Command.RotateLeft) {
			this.tetris.rotateLeft();
		}
	}

	sensorConnectionSucceded() {
		this.markCompletedTasks(6);
	}

	paint() {
		this.mainTetrisRenderer.render();
		requestAnimationFrame(this.paint.bind(this));
	}
}

var app = new App();
window.addEventListener("load", app.init.bind(app));