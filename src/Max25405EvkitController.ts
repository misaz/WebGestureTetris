/// <reference path="../lib/w3c-web-serial.d.ts" />

class Max25405EvkitController {
	private serialPort: SerialPort;
	private writer: WritableStreamDefaultWriter<Uint8Array>;
	private reader: ReadableStreamDefaultReader<Uint8Array>;
	private isOpen: boolean = false;
	private isTimerSet: boolean = false;
	private pollingDelay: number = 1000 / 160;

	private app: App;
	private notificationPane: NotificationPane;
	private debugMode: boolean = false;

	constructor(app: App) {
		this.app = app;
		this.notificationPane = app.getNotificationPane();
		this.warnIfNotSupported();
	}

	private warnIfNotSupported() {
		if (!this.isSupported()) {
			this.notificationPane.addNotification("img/error.png", "Browser Not Supported", "Your browser do not support WebSerial API which is needed for running this game with gesture sensor. Use Microsoft Edge or Google Chrome.", 10000);
		}

	}

	private log(message: string) {
		if (!this.debugMode) {
			return;
		}

		console.log(message);
	}

	private async pollGesture() {
		var output = await this.executeCommand("poll");
		var parts = output.split(",");
		var gesture = parts[0];
		var gestureNumber = Number.parseInt(gesture);

		// no gesture or reserved gesture
		if (gestureNumber == 0 || gestureNumber == 8 || gestureNumber == 9 || gestureNumber == 11) {
			this.pollNext();
			return;
		}

		if (gestureNumber == 12) {
			this.notificationPane.addNotification("img/error.png", "Gesture detection error", "Gesture detection algorithm failed to detect gesture.", 2000);
			this.pollNext();
			return;
		}

		var mappings = [
			{ number: 1, name: "Click", command: null, picture: null },
			{ number: 2, name: "Rotate ClockWise", command: Command.RotateRight, picture: "img/rotate-right.png" },
			{ number: 3, name: "Rotate CounterClockWise", command: Command.RotateLeft, picture: "img/rotate-left.png" },
			{ number: 4, name: "Swipe Left", command: Command.Left, picture: "img/left.png" },
			{ number: 5, name: "Swipe Right", command: Command.Right, picture: "img/right.png" },
			{ number: 6, name: "Swipe Up", command: Command.StartGame, picture: "img/up.png" },
			{ number: 7, name: "Swipe Down", command: Command.Down, picture: "img/down.png" },
			{ number: 10, name: "Linger On Region", command: null, picture: null },
		]

		mappings.forEach(function (this: Max25405EvkitController, item: { number: number, name: string, command: Command, picture: string }) {
			if (gestureNumber != item.number) {
				return;
			}

			if (item.command === null) {
				this.notificationPane.addNotification("img/unknown.png", "Unsupported gesture", "Unsupported gesture <strong>" + item.name + "</string> was detected.", 2000);
				return;
			}

			this.notificationPane.addNotification(item.picture, item.name, "<strong>" + item.name + "</string> gesture was detected.", 2000);

			this.app.executeCommand(item.command);
		}.bind(this));

		this.pollNext();
	}

	private pollNext() {
		setTimeout(this.pollGesture.bind(this), this.pollingDelay);
	}

	async requestSerialPort() {
		this.warnIfNotSupported();

		if (!this.isSupported()) {
			return;
		}

		this.serialPort = await navigator.serial.requestPort({
			filters: [
				{
					usbVendorId: 0x0B6A, // Maxim Integrated
					usbProductId: 0x4360 // MAX32620 MCU with MAX25405EVKIT firmware
				}
			]
		});

		await this.serialPort.open({ baudRate: 115200 });

		if (!this.serialPort.readable || !this.serialPort.writable) {
			this.isOpen = false;
			await this.serialPort.close();
			throw "Unable to open specified COM port.";
		}

		this.writer = this.serialPort.writable.getWriter();
		this.reader = this.serialPort.readable.getReader();

		var versionString = await this.executeCommand("ver");
		if (!versionString.startsWith("firmware version")) {
			// when connection was reseted while previous commenad was typed but not
			// send we now received invalid command output. Reexecution of ver command
			// can resolve this possible issue.
			versionString = await this.executeCommand("ver");
		}
		if (!versionString.startsWith("firmware version")) {
			// in case when even second command do noit produced expected event we
			// give up and throw error
			this.isOpen = false;
			await this.serialPort.close();
			throw "Connected device do not properly respond to commands.";
		}

		await this.executeCommand("gesture 0x7E", false);

		this.isOpen = true;
		this.pollNext();

		this.app.sensorConnectionSucceded();
	}

	private async executeCommand(command: string, readOutput: boolean = true) {
		this.log("> " + command);
		await this.writer.write(new TextEncoder().encode(command + "\n"));
		if (readOutput) {
			var output = await this.readLine();
			this.log("< " + output);
			return output;
		} else {
			return "";
		}
	}

	private async readLine(): Promise<string> {
		var message = "";
		var completed = false;
		while (!completed && message.indexOf("\n") == -1) {
			var output = await this.reader.read();
			if (output.done) {
				completed = true;
			} else {
				var received = new TextDecoder().decode(output.value);
				message = message + received;
			}
		}
		return message;
	}

	isSupported(): boolean {
		return !!navigator.serial;
	}

}